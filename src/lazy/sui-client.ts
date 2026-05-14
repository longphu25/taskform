/**
 * Sui client and dApp Kit setup — lazy-loaded when wallet interaction is needed.
 */
import { SuiGrpcClient } from '@mysten/sui/grpc'
import { createDAppKit } from '@mysten/dapp-kit-core'

export const PACKAGE_ID = '0x618af641c9284ec83110455fecca162ee74d62af37ee3b279f6780e4a29d6d2b'
export const REGISTRY_ID = '0x5b7c1c11736440be1ab102270277458cbeea6ae7f53131180ebb42fc4fb3de7b'

const GRPC_URLS: Record<string, string> = {
  mainnet: 'https://fullnode.mainnet.sui.io:443',
  testnet: 'https://fullnode.testnet.sui.io:443',
  devnet: 'https://fullnode.devnet.sui.io:443',
}

export const dAppKit = createDAppKit({
  networks: ['mainnet', 'testnet', 'devnet'],
  defaultNetwork: 'testnet',
  createClient: (network) =>
    new SuiGrpcClient({
      network,
      baseUrl: GRPC_URLS[network],
      mvr: {
        overrides: {
          packages: {
            '@local-pkg/taskform': PACKAGE_ID,
          },
        },
      },
    }),
})

export function getSuiClient() {
  return dAppKit.getClient()
}
