import type { InferUser } from '@dpin-uptime/auth/server'
import { PORT } from './utils/config'

const availableValidators: AvailableValidator[] = []

import { withdrawalProcessor } from './jobs/withdrawal-processor'
import type { IncomingMessage } from '@dpin-uptime/common/types'
import { PingScheduler } from './services/ping-scheduler'
import { validateHandler } from './handler/validate'
import { signupHandler } from './handler/sign-up'
import { verifyMessage } from './handler/message'
import type { AvailableValidator } from './types'

const server = Bun.serve<{ user: InferUser }, {}>({
  fetch(req, server) {
    const success = server.upgrade(req)
    if (success) {
      // Bun automatically returns a 101 Switching Protocols
      // if the upgrade succeeds
      return undefined
    }

    // handle HTTP request normally
    return new Response('Upgrade Failed', { status: 500 })
  },
  port: PORT,
  websocket: {
    // this is called when a message is received
    async message(ws, message: string) {
      console.log(`Received ${message}`)

      const data: IncomingMessage = JSON.parse(message)

      if (data.type === 'signup') {
        const verified = verifyMessage(
          `Signed message for ${data.data.callbackId}, ${data.data.publicKey}`,
          data.data.publicKey,
          data.data.signedMessage,
        )
        if (verified) {
          await signupHandler(ws, data.data, availableValidators)
          console.log(`✓ Validator registered. Total validators: ${availableValidators.length}`)
        } else {
          console.error('Failed to verify validator signature')
        }
      }

      if (data.type === 'validate') {
        await validateHandler(data.data)
      }
    },
    // Handle validator disconnection
    close(ws) {
      const index = availableValidators.findIndex((v) => v.socket === ws)
      if (index !== -1) {
        const validator = availableValidators[index]
        availableValidators.splice(index, 1)
        console.log(
          `Validator ${validator?.validatorId} disconnected. Remaining: ${availableValidators.length}`,
        )
      }
    },
  },
})

console.log(`Listening on ${server.hostname}:${PORT}`)

// Start the ping scheduler
const pingScheduler = new PingScheduler(availableValidators, 30000) // Ping every 30 seconds
pingScheduler.start()

// Start the withdrawal processor
withdrawalProcessor.start()

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...')
  pingScheduler.stop()
  withdrawalProcessor.stop()
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\nShutting down gracefully...')
  pingScheduler.stop()
  withdrawalProcessor.stop()
  process.exit(0)
})
