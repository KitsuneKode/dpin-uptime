import type { ServerWebSocket } from 'bun'

export type AvailableValidator = {
  validatorId: string
  socket: ServerWebSocket<unknown>
  publicKey: string
}
