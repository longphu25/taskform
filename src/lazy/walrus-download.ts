/**
 * Walrus download client — lightweight, loaded on form page to fetch schema
 *
 * Uses the Walrus HTTP Aggregator API.
 * Docs: https://docs.walrus.site/usage/web-api.html
 */

// Walrus aggregator endpoint (mainnet)
const WALRUS_AGGREGATOR_URL = 'https://aggregator.walrus-testnet.walrus.space'

export interface WalrusDownloadOptions {
  blobId: string
}

export async function downloadFromWalrus(options: WalrusDownloadOptions): Promise<Uint8Array> {
  const { blobId } = options

  const url = `${WALRUS_AGGREGATOR_URL}/v1/blobs/${blobId}`

  const response = await fetch(url)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Blob not found — it may have expired or the ID is invalid')
    }
    throw new Error(`Walrus download failed (${response.status})`)
  }

  const buffer = await response.arrayBuffer()
  return new Uint8Array(buffer)
}

/**
 * Download and parse JSON from Walrus
 */
export async function downloadJsonFromWalrus<T = unknown>(blobId: string): Promise<T> {
  const bytes = await downloadFromWalrus({ blobId })
  const text = new TextDecoder().decode(bytes)
  return JSON.parse(text) as T
}
