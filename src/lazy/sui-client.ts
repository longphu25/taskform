/**
 * Sui client and dApp Kit setup — lazy-loaded when wallet interaction is needed.
 */
import { SuiGrpcClient } from '@mysten/sui/grpc'
import { createDAppKit } from '@mysten/dapp-kit-core'

export const PACKAGE_ID = '0x168cecda7807f9e20e0a87611834d37583b7e7545a57fe0c92fab5b6477d5eff'
export const REGISTRY_ID = '0x836a4776d73ceea1aeba030e11bd306825e2c2efc06f16bd6f1326bead8ad021'

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
