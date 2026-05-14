/**
 * Seal decryption — lazy-loaded only in dashboard for admin decrypt.
 * Requires CreatorCap ownership to decrypt.
 */
import { SessionKey } from '@mysten/seal'
import { Transaction } from '@mysten/sui/transactions'
import { getSealClient } from './seal-encrypt'
import { getSuiClient, PACKAGE_ID, dAppKit } from './sui-client'

/**
 * Decrypt an encrypted field value.
 * Caller must own CreatorCap for the form.
 */
export async function decryptField(params: {
  encryptedData: Uint8Array
  creatorCapId: string
}): Promise<string> {
  const client = getSealClient()
  const suiClient = getSuiClient()

  // Get current wallet address
  const connection = dAppKit.stores.$connection.get()
  if (!connection.isConnected || !connection.account) {
    throw new Error('Wallet not connected')
  }

  // Create ephemeral session key
  const { Ed25519Keypair } = await import('@mysten/sui/keypairs/ed25519')
  const sessionKp = new Ed25519Keypair()
  const sessionKey = await SessionKey.create({
    address: sessionKp.getPublicKey().toSuiAddress(),
    packageId: PACKAGE_ID,
    ttlMin: 10,
    signer: sessionKp,
    suiClient,
  })

  // Build approval TX — calls seal_approve with CreatorCap
  const { EncryptedObject } = await import('@mysten/seal')
  const parsed = EncryptedObject.parse(params.encryptedData)
  const rawId = parsed.id as unknown
  const idBytes: number[] = rawId instanceof Uint8Array ? [...rawId] : (rawId as number[])

  const tx = new Transaction()
  tx.moveCall({
    package: PACKAGE_ID,
    module: 'seal_policy',
    function: 'seal_approve',
    arguments: [tx.pure.vector('u8', idBytes), tx.object(params.creatorCapId)],
  })
  const txBytes = await tx.build({ client: suiClient, onlyTransactionKind: true })

  const decrypted = await client.decrypt({
    data: params.encryptedData,
    sessionKey,
    txBytes,
  })

  return new TextDecoder().decode(decrypted)
}
