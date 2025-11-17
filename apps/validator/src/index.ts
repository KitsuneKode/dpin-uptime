import { privateKey } from './utils/config'
import { Keypair } from '@solana/web3.js'
import nacl_util from 'tweetnacl-util'
import { randomUUID } from 'crypto'
import nacl from 'tweetnacl'
import bs58 from 'bs58'
// Configuration
const HUB_URL = process.env.HUB_URL || 'ws://localhost:8082'
const VALIDATOR_IP = process.env.VALIDATOR_IP || 'localhost'

// Generate or load Solana keypair
// In production, you'd load this from a secure location
// const keypair = Keypair.generate()

const keypair = Keypair.fromSecretKey(bs58.decode(privateKey))

console.log('=== Validator Starting ===')
console.log(`Public Key: ${keypair.publicKey.toBase58()}`)
console.log(`Connecting to hub: ${HUB_URL}`)

let validatorId: string | null = null
let ws: WebSocket | null = null

/**
 * Sign a message with the validator's keypair
 */
function signMessage(message: string): string {
  const messageBytes = nacl_util.decodeUTF8(message)
  const signature = nacl.sign.detached(messageBytes, keypair.secretKey)
  return JSON.stringify(Array.from(signature))
}

/**
 * Ping a website and measure response time
 */
async function pingWebsite(url: string): Promise<{ status: 'Good' | 'Bad'; latency: number }> {
  const startTime = Date.now()

  try {
    const response = await fetch(url, {
      method: 'HEAD', // Use HEAD to minimize data transfer
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    const latency = Date.now() - startTime

    // Consider 2xx and 3xx status codes as "Good"
    const status = response.status < 400 ? 'Good' : 'Bad'

    return { status, latency }
  } catch (error) {
    const latency = Date.now() - startTime
    console.error(`Failed to ping ${url}:`, error)
    return { status: 'Bad', latency }
  }
}

/**
 * Connect to the hub and register as a validator
 */
function connectToHub() {
  ws = new WebSocket(HUB_URL)

  ws.onopen = () => {
    console.log('✓ Connected to hub')

    // Sign up as a validator
    const callbackId = randomUUID()
    const message = `Signed message for ${callbackId}, ${keypair.publicKey.toBase58()}`
    const signedMessage = signMessage(message)

    const signupMessage = {
      type: 'signup',
      data: {
        ip: VALIDATOR_IP,
        publicKey: keypair.publicKey.toBase58(),
        signedMessage,
        callbackId,
      },
    }

    ws!.send(JSON.stringify(signupMessage))
    console.log('→ Sent signup request')
  }

  ws.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data)
      console.log('← Received message:', data)

      // Handle signup response
      if (data.type === 'signup') {
        validatorId = data.data.validatorId
        console.log(`✓ Registered as validator: ${validatorId}`)
      }

      // Handle validation request
      if (data.type === 'validate') {
        const { url, callbackId, websiteId } = data.data

        console.log(`→ Pinging ${url}...`)

        // Ping the website
        const result = await pingWebsite(url)

        console.log(`✓ Result: ${result.status} (${result.latency}ms)`)

        // Sign the result
        const messageToSign = `${callbackId}:${result.status}:${result.latency}:${websiteId}`
        const signedMessage = signMessage(messageToSign)

        // Send response back to hub
        const response = {
          type: 'validate',
          data: {
            callbackId,
            signedMessage,
            status: result.status,
            latency: result.latency,
            websiteId,
            validatorId: validatorId!,
          },
        }

        ws!.send(JSON.stringify(response))
        console.log(`← Sent validation result for ${url}`)
      }
    } catch (error) {
      console.error('Error handling message:', error)
    }
  }

  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }

  ws.onclose = () => {
    console.log('✗ Disconnected from hub. Reconnecting in 5 seconds...')
    ws = null
    validatorId = null

    // Reconnect after 5 seconds
    setTimeout(() => {
      connectToHub()
    }, 5000)
  }
}

// Start the validator
connectToHub()

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down validator...')
  if (ws) {
    ws.close()
  }
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\nShutting down validator...')
  if (ws) {
    ws.close()
  }
  process.exit(0)
})
