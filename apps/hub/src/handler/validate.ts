import type { ValidateIncomingMessage } from '@dpin-uptime/common/types'
import { prisma } from '@dpin-uptime/store/'
import { verifyMessage } from './message'

export const validateHandler = async ({
  callbackId,
  signedMessage,
  status,
  latency,
  websiteId,
  validatorId,
}: ValidateIncomingMessage) => {
  try {
    // Verify the signature
    const validator = await prisma.validator.findUnique({
      where: { id: validatorId },
    })

    if (!validator) {
      console.error(`Validator ${validatorId} not found`)
      return
    }

    // Verify the signed message
    const messageToVerify = `${callbackId}:${status}:${latency}:${websiteId}`
    const verified = verifyMessage(
      messageToVerify,
      validator.publicKey,
      signedMessage
    )

    if (!verified) {
      console.error(
        `Invalid signature from validator ${validatorId} for callback ${callbackId}`
      )
      return
    }

    // Save the website tick to database
    const tick = await prisma.websiteTick.create({
      data: {
        websiteId,
        validatorId,
        status,
        latency,
      },
    })

    console.log(
      `✓ Saved tick for website ${websiteId}: ${status} (${latency}ms)`
    )

    // Check for incident detection (multiple consecutive failures)
    await checkAndCreateIncident(websiteId)

    return tick
  } catch (error) {
    console.error('Error handling validation response:', error)
  }
}

/**
 * Check if we should create an incident based on recent failures
 * Creates an incident if there are 3 consecutive "Bad" ticks
 */
async function checkAndCreateIncident(websiteId: string) {
  try {
    // Get the last 5 ticks for this website
    const recentTicks = await prisma.websiteTick.findMany({
      where: { websiteId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    if (recentTicks.length < 3) {
      return // Not enough data yet
    }

    // Check if the last 3 ticks are all "Bad"
    const lastThree = recentTicks.slice(0, 3)
    const allBad = lastThree.every((tick) => tick.status === 'Bad')

    if (!allBad) {
      // If service is back up, auto-resolve open incidents
      const lastStatus = recentTicks[0].status
      if (lastStatus === 'Good') {
        await autoResolveIncidents(websiteId)
      }
      return
    }

    // Check if there's already an open incident
    const existingIncident = await prisma.incident.findFirst({
      where: {
        monitorId: websiteId,
        status: {
          in: ['OPEN', 'ACKNOWLEDGED'],
        },
      },
    })

    if (existingIncident) {
      return // Incident already exists
    }

    // Create new incident
    const monitor = await prisma.monitor.findUnique({
      where: { id: websiteId },
    })

    if (!monitor) {
      return
    }

    const incident = await prisma.incident.create({
      data: {
        monitorId: websiteId,
        title: `${monitor.name || monitor.url} is down`,
        status: 'OPEN',
        severity: 'CRITICAL',
      },
    })

    console.log(`🚨 Created incident ${incident.id} for monitor ${websiteId}`)
  } catch (error) {
    console.error('Error checking for incident:', error)
  }
}

/**
 * Auto-resolve open incidents when service recovers
 */
async function autoResolveIncidents(websiteId: string) {
  try {
    const openIncidents = await prisma.incident.findMany({
      where: {
        monitorId: websiteId,
        status: {
          in: ['OPEN', 'ACKNOWLEDGED'],
        },
      },
    })

    if (openIncidents.length === 0) {
      return
    }

    // Resolve all open incidents
    await prisma.incident.updateMany({
      where: {
        monitorId: websiteId,
        status: {
          in: ['OPEN', 'ACKNOWLEDGED'],
        },
      },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
    })

    console.log(
      `✓ Auto-resolved ${openIncidents.length} incident(s) for monitor ${websiteId}`
    )
  } catch (error) {
    console.error('Error auto-resolving incidents:', error)
  }
}
