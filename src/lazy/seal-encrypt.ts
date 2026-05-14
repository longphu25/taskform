/**
 * Seal encryption — lazy-loaded only when sensitive fields exist.
 * Encrypts data so only the form creator (CreatorCap holder) can decrypt.
 */
import { SealClient } from '@mysten/seal'
import { getSuiClient, PACKAGE_ID } from './sui-client'

// Testnet key servers
const KEY_SERVER_CONFIGS = [
  { objectId: '0x73d05d62c18d9374e3ea529e8e0ed6161da1a141a94d3f76ae3fe4e99356db75', weight: 1 },
  { objectId: '0xf5d14a81a982144ae441cd7d64b09027f116a468bd36e7eca494f750591623c8', weight: 1 },
  { objectId: '0x6a0726a1ea3d62ba2f2ae51104f2c3633c003fb75621d06fde47f04dc930ba06', weight: 1 },
]

let _sealClient: SealClient | null = null

export function getSealClient(): SealClient {
  if (!_sealClient) {
    _sealClient = new SealClient({
      suiClient: getSuiClient(),
      serverConfigs: KEY_SERVER_CONFIGS,
      verifyKeyServers: false,
    })
  }
  return _sealClient
}

/**
 * Encrypt sensitive field value.
 * Identity = formObjectId bytes + random nonce (so each encryption is unique).
 * Only CreatorCap holder for that form can decrypt.
 */
export async function encryptField(params: {
  formObjectId: string
  plaintext: string
}): Promise<Uint8Array> {
  const { toHex, fromHex } = await import('@mysten/sui/utils')

  const formIdBytes = fromHex(params.formObjectId.replace('0x', ''))
  const nonce = new Uint8Array(16)
  crypto.getRandomValues(nonce)

  // id = formObjectId bytes + nonce
  const id = new Uint8Array(formIdBytes.length + nonce.length)
  id.set(formIdBytes, 0)
  id.set(nonce, formIdBytes.length)

  const client = getSealClient()
  const { encryptedObject } = await client.encrypt({
    threshold: 2,
    packageId: PACKAGE_ID,
    id: toHex(id),
    data: new TextEncoder().encode(params.plaintext),
  })

  return encryptedObject
}
