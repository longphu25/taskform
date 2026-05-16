/**
 * Sui client and dApp Kit setup — lazy-loaded when wallet interaction is needed.
 */
import { SuiGrpcClient } from '@mysten/sui/grpc'
import { createDAppKit } from '@mysten/dapp-kit-core'

export const PACKAGE_ID = '0xa704222949feffa24631d47797c8b15465f7776d412ace0233621e4840eb9dab'
export const REGISTRY_ID = '0xb6567ce9583cd459297cd724ce11a0b201b9537fcfa3eb0556377493f4ba27be'

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
