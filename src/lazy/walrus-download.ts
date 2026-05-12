/**
 * Walrus download client — lightweight, can be loaded eagerly on form page
 */

export interface WalrusDownloadOptions {
  blobId: string
}

export async function downloadFromWalrus(_options: WalrusDownloadOptions): Promise<Uint8Array> {
  // TODO: Implement Walrus download in Phase 4 (Day 3)
  throw new Error('Walrus download not yet implemented')
}
