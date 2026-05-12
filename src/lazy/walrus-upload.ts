/**
 * Walrus upload client — lazy-loaded only on submit/publish
 *
 * Uses the Walrus HTTP Publisher API.
 * Docs: https://docs.walrus.site/usage/web-api.html
 */

// Walrus publisher endpoint (mainnet)
const WALRUS_PUBLISHER_URL = 'https://publisher.walrus-testnet.walrus.space'

export interface WalrusUploadResult {
  blobId: string
  objectId?: string
  expiryEpoch: number
}

export interface WalrusUploadOptions {
  data: Uint8Array | string
  epochs: number
}

export async function uploadToWalrus(options: WalrusUploadOptions): Promise<WalrusUploadResult> {
  const { data, epochs } = options

  const body = typeof data === 'string' ? new TextEncoder().encode(data) : data

  const url = `${WALRUS_PUBLISHER_URL}/v1/blobs?epochs=${epochs}`

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    body: body as BodyInit,
  })

  if (!response.ok) {
    const text = await response.text().catch(() => 'Unknown error')
    throw new Error(`Walrus upload failed (${response.status}): ${text}`)
  }

  const result = await response.json()

  // Walrus API returns either { newlyCreated: {...} } or { alreadyCertified: {...} }
  const info =
    result.newlyCreated?.blobObject ??
    result.alreadyCertified?.blobObject ??
    result.newlyCreated ??
    result.alreadyCertified

  if (!info) {
    throw new Error('Unexpected Walrus response format')
  }

  return {
    blobId:
      info.blobId ??
      result.newlyCreated?.blobObject?.blobId ??
      result.alreadyCertified?.blobId ??
      '',
    objectId: info.id ?? undefined,
    expiryEpoch: info.storage?.endEpoch ?? info.endEpoch ?? epochs,
  }
}
