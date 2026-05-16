/**
 * Walrus upload via @mysten/walrus SDK + Sui PTB (no publisher dependency).
 *
 * Flow:
 * 1. Check WAL balance — auto-swap SUI → WAL if insufficient
 * 2. Encode blob locally (WASM)
 * 3. Register blob on-chain (Sui TX — user signs via wallet)
 * 4. Upload slivers to storage nodes (via upload relay)
 * 5. Certify blob on-chain (Sui TX — user signs via wallet)
 *
 * User pays for storage with SUI (auto-swapped to WAL) or WAL directly.
 */
import { SuiGrpcClient } from '@mysten/sui/grpc'
import { walrus, WalrusFile } from '@mysten/walrus'
import { Transaction } from '@mysten/sui/transactions'
import walrusWasmUrl from '@mysten/walrus-wasm/web/walrus_wasm_bg.wasm?url'

export interface WalrusUploadResult {
  blobId: string
  downloadId: string
  objectId?: string
  expiryEpoch: number
  /** Effects from the certify TX (includes any appended moveCalls). */
  certifyEffects?: {
    changedObjects?: Array<{ objectId: string; idOperation: string; outputOwner: unknown }>
  }
}

export interface WalrusUploadOptions {
  data: Uint8Array | string
  epochs: number
  onStep?: (step: 'swap' | 'encode' | 'register' | 'upload' | 'certify') => void
  /** Optional: append extra moveCall(s) to the certify TX to reduce total signatures. */
  appendToCertify?: (tx: Transaction, meta: { blobId: string; objectId: string }) => void
}

// Walrus Exchange on testnet (SUI ↔ WAL)
const WAL_EXCHANGE_PACKAGE = '0x82593828ed3fcb8c6a235eac9abd0adbe9c5f9bbffa9b1e7a45cdd884481ef9f'
const WAL_EXCHANGE_ID = '0xf4d164ea2def5fe07dc573992a029e010dba09b1a8dcbc44c5c2e79567f39073'
const WAL_COIN_TYPE = '0x8270feb7375eee355e64fdb69c50abb6b5f9393a722883c1cf45f8e26048810a::wal::WAL'

let walrusClient: ReturnType<typeof createWalrusClient> | null = null

function createWalrusClient() {
  return new SuiGrpcClient({
    network: 'testnet',
    baseUrl: 'https://fullnode.testnet.sui.io:443',
  }).$extend(
    walrus({
      uploadRelay: {
        host: 'https://upload-relay.testnet.walrus.space',
        sendTip: { max: 1_000 },
      },
      wasmUrl: walrusWasmUrl,
    }),
  )
}

export function getWalrusClient() {
  if (!walrusClient) {
    walrusClient = createWalrusClient()
  }
  return walrusClient
}

/**
 * Check WAL balance vs estimated storage cost.
 * Auto-swap SUI → WAL if insufficient.
 */
async function ensureWalBalance(
  ownerAddress: string,
  dataSize: number,
  epochs: number,
  onStep?: (step: 'swap' | 'encode' | 'register' | 'upload' | 'certify') => void,
): Promise<void> {
  const { dAppKit, getSuiClient } = await import('./sui-client')
  const client = getSuiClient()
  const walrusClient = getWalrusClient()

  // Estimate storage cost in WAL
  const { totalCost } = await walrusClient.walrus.storageCost(dataSize, epochs)

  // Check current WAL balance
  let walBalance = 0n
  try {
    const resp = await client.core.getBalance({ owner: ownerAddress, coinType: WAL_COIN_TYPE })
    walBalance = BigInt(resp.balance?.balance ?? resp.balance?.coinBalance ?? 0n)
  } catch {
    // No WAL coins
  }

  if (walBalance >= totalCost) return

  // Swap exact needed amount of SUI → WAL
  onStep?.('swap')
  const needed = totalCost - walBalance
  const tx = new Transaction()
  tx.setSender(ownerAddress)
  const [suiCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(needed)])
  const walCoin = tx.moveCall({
    target: `${WAL_EXCHANGE_PACKAGE}::wal_exchange::exchange_all_for_wal`,
    arguments: [tx.object(WAL_EXCHANGE_ID), suiCoin],
  })
  tx.transferObjects([walCoin], ownerAddress)

  const result = await dAppKit.signAndExecuteTransaction({ transaction: tx })
  const txResult = result.Transaction ?? result.FailedTransaction
  if (!txResult || ('status' in txResult && txResult.status?.error)) {
    throw new Error('SUI → WAL swap failed. Please ensure you have enough SUI.')
  }
}

/**
 * Upload data to Walrus using PTB (user signs transactions via wallet).
 * Uses writeFilesFlow for browser-compatible multi-step signing.
 * Auto-swaps SUI → WAL if user lacks WAL balance.
 *
 * Optionally appends extra moveCall(s) to the certify TX via `appendToCertify`,
 * reducing total wallet signatures (e.g. gộp certify + submit_form = 1 sign).
 */
export async function uploadToWalrus(options: WalrusUploadOptions): Promise<WalrusUploadResult> {
  const { data, epochs, onStep, appendToCertify } = options

  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data
  const client = getWalrusClient()

  const { dAppKit } = await import('./sui-client')

  const connection = dAppKit.stores.$connection.get()
  if (!connection.isConnected || !connection.account) {
    throw new Error('Wallet not connected. Please connect your wallet first.')
  }

  const ownerAddress = connection.account.address

  // Step 0: Ensure user has WAL (auto-swap if needed)
  await ensureWalBalance(ownerAddress, bytes.length, epochs, onStep)

  // Create the write flow
  const flow = client.walrus.writeFilesFlow({
    files: [WalrusFile.from({ contents: bytes, identifier: 'schema.json' })],
  })

  // Step 1: Encode
  onStep?.('encode')
  const encoded = await flow.encode()

  // Step 2: Register (user signs TX)
  onStep?.('register')
  const registerTx = flow.register({
    epochs,
    owner: ownerAddress,
    deletable: false,
  })

  const registerResult = await dAppKit.signAndExecuteTransaction({ transaction: registerTx })
  const regTx = registerResult.Transaction ?? registerResult.FailedTransaction
  if (!regTx || ('status' in regTx && regTx.status?.error)) {
    throw new Error('Blob registration transaction failed')
  }

  // Parse blobObjectId from register TX created objects
  let blobObjectId = ''
  const changedObjects = regTx.effects?.changedObjects ?? []
  for (const obj of changedObjects) {
    if (obj.idOperation !== 'Created') continue
    const owner = obj.outputOwner
    if (owner && 'AddressOwner' in owner) {
      blobObjectId = obj.objectId
    }
  }

  // Step 3: Upload slivers to storage nodes (via upload relay)
  onStep?.('upload')
  await flow.upload({
    digest: (registerResult.Transaction ?? registerResult.FailedTransaction)!.digest,
  })

  // Step 4: Certify (user signs TX) — optionally with appended moveCall(s)
  onStep?.('certify')
  const certifyTx = flow.certify()

  // Append extra operations to certify TX (e.g. submit_form) to save a signature
  if (appendToCertify && blobObjectId) {
    appendToCertify(certifyTx, { blobId: encoded.blobId, objectId: blobObjectId })
  }

  const certifyResult = await dAppKit.signAndExecuteTransaction({ transaction: certifyTx })
  const certTx = certifyResult.Transaction ?? certifyResult.FailedTransaction
  if (!certTx || ('status' in certTx && certTx.status?.error)) {
    throw new Error('Blob certification transaction failed')
  }

  // Step 5: Get results
  const files = await flow.listFiles()
  const file = files[0]

  return {
    blobId: file?.blobId ?? encoded.blobId,
    downloadId: file?.id ?? '',
    objectId: file?.blobObject?.id ?? blobObjectId,
    expiryEpoch: epochs,
    certifyEffects: certTx?.effects ? { changedObjects: certTx.effects.changedObjects } : undefined,
  }
}
