/**
 * Sui client and dApp Kit setup — lazy-loaded when wallet interaction is needed.
 */
import { SuiGrpcClient } from '@mysten/sui/grpc'
import { createDAppKit } from '@mysten/dapp-kit-core'

export const PACKAGE_ID = '0x78dedecd2d0b90e7a101c9222edf85e4415fb4618a0ccf1c522d50757f27aee0'
export const REGISTRY_ID = '0xba18f32751bdfd9849f20d72d22cdae0a3fc13f199b4a6097dbe4e61d9138485'

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
