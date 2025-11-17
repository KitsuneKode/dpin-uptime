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
    ws.send(
      JSON.stringify({
        type: 'signup',
        data: {
          validatorId: validatorDb.id,
          callbackId,
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

  //TODO: Given the ip, return the location
  const validator = await prisma.validator.create({
    data: {
      ip,
      publicKey,
      location: 'unknown',
    },
  })

  ws.send(
    JSON.stringify({
      type: 'signup',
      data: {
        validatorId: validator.id,
        callbackId,
      },
    }),
  )

  availableValidators.push({
    validatorId: validator.id,
    socket: ws,
    publicKey: validator.publicKey,
  })
}
