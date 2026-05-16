/**
 * Sui client and dApp Kit setup — lazy-loaded when wallet interaction is needed.
 */
import { SuiGrpcClient } from '@mysten/sui/grpc'
import { createDAppKit } from '@mysten/dapp-kit-core'

export const PACKAGE_ID = '0x74c03ba837ce1a8efce0ca36c25a5e734cbfb266a660d1a480a54ad6b02560c6'
export const REGISTRY_ID = '0x217f15103336d13f408caedc8a9b10cd1aa6ee199aab22da7f130fed1e9e3f5f'

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
