import type { SignupIncomingMessage } from '@dpin-uptime/common/types'
import type { AvailableValidator } from '@/types'
import { prisma } from '@dpin-uptime/store/'
import type { ServerWebSocket } from 'bun'

export const signupHandler = async (
  ws: ServerWebSocket<unknown>,
  { ip, publicKey, signedMessage, callbackId }: SignupIncomingMessage,
  availableValidators: AvailableValidator[],
) => {
  const validatorDb = await prisma.validator.findFirst({
    where: {
      publicKey,
    },
  })

  if (validatorDb) {
    // Check if validator is approved
    if (validatorDb.status !== 'APPROVED') {
      ws.send(
        JSON.stringify({
          type: 'error',
          data: {
            message: `Validator registration is ${validatorDb.status}. Please wait for approval.`,
            callbackId,
          },
        }),
      )
      ws.close(1008, 'Validator not approved')
      return
    }

    // Validator is approved, allow connection
    ws.send(
      JSON.stringify({
        type: 'signup',
        data: {
          validatorId: validatorDb.id,
          callbackId,
          status: 'approved',
        },
      }),
    )

    availableValidators.push({
      validatorId: validatorDb.id,
      socket: ws,
      publicKey: validatorDb.publicKey,
    })
    return
  }

  // Create new validator with PENDING status
  // Auto-approve if this is the first validator (for development)
  const validatorCount = await prisma.validator.count()
  const autoApprove = validatorCount === 0

  const validator = await prisma.validator.create({
    data: {
      ip,
      publicKey,
      location: 'unknown', //TODO: Given the ip, return the location
      status: autoApprove ? 'APPROVED' : 'PENDING',
      approvedAt: autoApprove ? new Date() : undefined,
      approvedBy: autoApprove ? 'system' : undefined,
    },
  })

  if (!autoApprove) {
    ws.send(
      JSON.stringify({
        type: 'signup',
        data: {
          validatorId: validator.id,
          callbackId,
          status: 'pending',
          message: 'Validator registered. Waiting for approval from admin.',
        },
      }),
    )
    ws.close(1008, 'Validator pending approval')
    return
  }

  // Auto-approved validator
  ws.send(
    JSON.stringify({
      type: 'signup',
      data: {
        validatorId: validator.id,
        callbackId,
        status: 'approved',
      },
    }),
  )

  availableValidators.push({
    validatorId: validator.id,
    socket: ws,
    publicKey: validator.publicKey,
  })

  console.log('[SignupHandler] First validator auto-approved:', validator.id)
}
