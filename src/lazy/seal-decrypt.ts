/**
 * Seal decryption — lazy-loaded only in dashboard for creator decrypt.
 * Account-based: only the creator address can decrypt.
 */
import { SessionKey, EncryptedObject } from '@mysten/seal'
import { Transaction } from '@mysten/sui/transactions'
import { getSealClient } from './seal-encrypt'
import { getSuiClient, PACKAGE_ID, dAppKit } from './sui-client'

/**
 * Decrypt an encrypted field value.
 * Caller must be the creator address used during encryption.
 */
export async function decryptField(params: { encryptedData: Uint8Array }): Promise<string> {
  const { fromHex } = await import('@mysten/sui/utils')

  const client = getSealClient()
  const suiClient = getSuiClient()

  const connection = dAppKit.stores.$connection.get()
  if (!connection.isConnected || !connection.account) {
    throw new Error('Wallet not connected')
  }
  const userAddress = connection.account.address

  const parsed = EncryptedObject.parse(params.encryptedData)
  const idHex =
    typeof parsed.id === 'string'
      ? parsed.id
      : Array.from(parsed.id as Uint8Array)
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('')
  const idBytes = [...fromHex(idHex)]

  // Create session key with wallet address and sign with wallet
  const sessionKey = await SessionKey.create({
    address: userAddress,
    packageId: PACKAGE_ID,
    ttlMin: 10,
    suiClient,
  })
  // Sign the session key personal message with wallet
  const message = sessionKey.getPersonalMessage()
  const { signature } = await dAppKit.signPersonalMessage({ message })
  sessionKey.setPersonalMessageSignature(signature)

  // Build TX — account_based: seal_approve(id, ctx)
  const tx = new Transaction()
  tx.moveCall({
    package: PACKAGE_ID,
    module: 'seal_policy',
    function: 'seal_approve',
    arguments: [tx.pure.vector('u8', idBytes)],
  })
  const txBytes = await tx.build({ client: suiClient, onlyTransactionKind: true })

  const decrypted = await client.decrypt({
    data: params.encryptedData,
    sessionKey,
    txBytes,
  })

  return new TextDecoder().decode(decrypted)
}
