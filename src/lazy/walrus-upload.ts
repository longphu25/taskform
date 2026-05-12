/**
 * Walrus upload client — lazy-loaded only on submit/publish
 */

export interface WalrusUploadResult {
  blobId: string
  objectId?: string
  expiryEpoch: number
}

export interface WalrusUploadOptions {
  data: Uint8Array | string
  epochs: number
}

export async function uploadToWalrus(_options: WalrusUploadOptions): Promise<WalrusUploadResult> {
  // TODO: Implement Walrus upload in Phase 4 (Day 3)
  throw new Error('Walrus upload not yet implemented')
}
