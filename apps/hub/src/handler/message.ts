import { PublicKey } from '@solana/web3.js'
import nacl_util from 'tweetnacl-util'
import nacl from 'tweetnacl'

export const verifyMessage = (message: string, publicKey: string, signature: string) => {
  const messageBytes = nacl_util.decodeUTF8(message)

  const result = nacl.sign.detached.verify(
    messageBytes,
    new Uint8Array(JSON.parse(signature)),
    new PublicKey(publicKey).toBytes(),
  )

  return result
}
