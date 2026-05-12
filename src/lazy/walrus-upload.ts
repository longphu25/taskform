/**
 * Walrus upload via @mysten/walrus SDK + Sui PTB (no publisher dependency).
 *
 * Flow:
 * 1. Encode blob locally (WASM)
 * 2. Register blob on-chain (Sui TX — user signs via wallet)
 * 3. Upload slivers to storage nodes (via upload relay)
 * 4. Certify blob on-chain (Sui TX — user signs via wallet)
 *
 * User pays for storage directly with their SUI + WAL.
 */
import { SuiGrpcClient } from '@mysten/sui/grpc'
import { walrus, WalrusFile } from '@mysten/walrus'
import walrusWasmUrl from '@mysten/walrus-wasm/web/walrus_wasm_bg.wasm?url'

export interface WalrusUploadResult {
  blobId: string
  objectId?: string
  expiryEpoch: number
}

export interface WalrusUploadOptions {
  data: Uint8Array | string
  epochs: number
}

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

function getWalrusClient() {
  if (!walrusClient) {
    walrusClient = createWalrusClient()
  }
  return walrusClient
}

/**
 * Upload data to Walrus using PTB (user signs transactions via wallet).
 * Uses writeFilesFlow for browser-compatible multi-step signing.
 */
export async function uploadToWalrus(options: WalrusUploadOptions): Promise<WalrusUploadResult> {
  const { data, epochs } = options

  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data
  const client = getWalrusClient()

  const { dAppKit } = await import('./sui-client')

  const connection = dAppKit.stores.$connection.get()
  if (!connection.isConnected || !connection.account) {
    throw new Error('Wallet not connected. Please connect your wallet first.')
  }

  const ownerAddress = connection.account.address

  // Create the write flow
  const flow = client.walrus.writeFilesFlow({
    files: [WalrusFile.from({ contents: bytes, identifier: 'schema.json' })],
  })

  // Step 1: Encode
  await flow.encode()

  // Step 2: Register (user signs TX)
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

  // Step 3: Upload slivers to storage nodes (via upload relay)
  await flow.upload({
    digest: (registerResult.Transaction ?? registerResult.FailedTransaction)!.digest,
  })

  // Step 4: Certify (user signs TX)
  const certifyTx = flow.certify()
  const certifyResult = await dAppKit.signAndExecuteTransaction({ transaction: certifyTx })
  const certTx = certifyResult.Transaction ?? certifyResult.FailedTransaction
  if (!certTx || ('status' in certTx && certTx.status?.error)) {
    throw new Error('Blob certification transaction failed')
  }

  // Step 5: Get results
  const files = await flow.listFiles()
  const file = files[0]

  return {
    blobId: file?.blobId ?? '',
    objectId: file?.id,
    expiryEpoch: epochs,
  }
}
