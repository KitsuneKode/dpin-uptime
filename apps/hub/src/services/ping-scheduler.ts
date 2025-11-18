import type { AvailableValidator } from '@/types'
import { prisma } from '@dpin-uptime/store/'
import { randomUUID } from 'crypto'

/**
 * Ping scheduler that periodically sends validation requests to validators
 */
export class PingScheduler {
  private intervalId: Timer | null = null
  private pingInterval: number // in milliseconds
  private availableValidators: AvailableValidator[]

  constructor(availableValidators: AvailableValidator[], pingInterval = 30000) {
    this.availableValidators = availableValidators
    this.pingInterval = pingInterval
  }

  /**
   * Start the ping scheduler
   */
  start() {
    console.log(`Starting ping scheduler (interval: ${this.pingInterval}ms)`)

    // Run immediately
    this.runPingCycle()

    // Then run at intervals
    this.intervalId = setInterval(() => {
      this.runPingCycle()
    }, this.pingInterval)
  }

  /**
   * Stop the ping scheduler
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
      console.log('Ping scheduler stopped')
    }
  }

  /**
   * Run a single ping cycle
   */
  private async runPingCycle() {
    try {
      // Get all active monitors
      const monitors = await prisma.monitor.findMany({
        where: {
          archived: false,
        },
      })

      if (monitors.length === 0) {
        console.log('No active monitors to ping')
        return
      }

      if (this.availableValidators.length === 0) {
        console.log('No validators available')
        return
      }

      console.log(
        `Pinging ${monitors.length} monitor(s) with ${this.availableValidators.length} validator(s)`,
      )

      // Send ping requests to validators
      monitors.forEach((monitor) => {
        // For MVP, we'll use a simple round-robin approach
        // In production, you'd want more sophisticated load balancing
        const validator = this.getRandomValidator()

        if (!validator) {
          console.log('No validator available for monitor', monitor.id)
          return
        }

        const callbackId = randomUUID()

        const message = {
          type: 'validate',
          data: {
            url: monitor.url,
            callbackId,
            websiteId: monitor.id,
          },
        }

        try {
          validator.socket.send(JSON.stringify(message))
          console.log(
            `→ Sent ping request to validator ${validator.validatorId} for ${monitor.url}`,
          )
        } catch (error) {
          console.error(`Failed to send ping to validator ${validator.validatorId}:`, error)
          // Remove validator from available list if socket is dead
          this.removeValidator(validator.validatorId)
        }
      })
    } catch (error) {
      console.error('Error in ping cycle:', error)
    }
  }

  /**
   * Get a random validator from available validators
   */
  private getRandomValidator(): AvailableValidator | null {
    if (this.availableValidators.length === 0) {
      return null
    }

    const randomIndex = Math.floor(Math.random() * this.availableValidators.length)
    return this.availableValidators[randomIndex]
  }

  /**
   * Remove a validator from the available list
   */
  private removeValidator(validatorId: string) {
    const index = this.availableValidators.findIndex((v) => v.validatorId === validatorId)
    if (index !== -1) {
      this.availableValidators.splice(index, 1)
      console.log(`Removed validator ${validatorId} from available list`)
    }
  }

  /**
   * Get the number of available validators
   */
  getValidatorCount(): number {
    return this.availableValidators.length
  }
}
