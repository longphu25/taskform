/**
 * Seal decryption client — lazy-loaded only in dashboard for admin decrypt
 */

export interface SealDecryptOptions {
  ciphertext: Uint8Array
  policyId: string
}

export async function decryptWithSeal(_options: SealDecryptOptions): Promise<string> {
  // TODO: Implement Seal decryption in Phase 8 (Day 6)
  throw new Error('Seal decryption not yet implemented')
}
