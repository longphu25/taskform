/**
 * Seal encryption — lazy-loaded only when sensitive fields exist.
 * Account-based pattern: only creator address can decrypt.
 */
import { SealClient } from '@mysten/seal'
import { getSuiClient, PACKAGE_ID } from './sui-client'

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
 * ID = bcs(creator_address) — only creator can decrypt.
 */
export async function encryptField(params: {
  creatorAddress: string
  plaintext: string
}): Promise<Uint8Array> {
  const { bcs } = await import('@mysten/sui/bcs')
  const { toHex } = await import('@mysten/sui/utils')

  // ID = bcs serialized address (32 bytes)
  const idBytes = bcs.Address.serialize(params.creatorAddress).toBytes()

  const client = getSealClient()
  const { encryptedObject } = await client.encrypt({
    threshold: 2,
    packageId: PACKAGE_ID,
    id: toHex(idBytes),
    data: new TextEncoder().encode(params.plaintext),
  })

  return encryptedObject
}
