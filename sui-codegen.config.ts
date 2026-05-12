import type { SuiCodegenConfig } from '@mysten/codegen/src/config.js'

const config: SuiCodegenConfig = {
  output: './src/contract',
  generateSummaries: true,
  prune: true,
  packages: [
    {
      package: '@local-pkg/taskform',
      path: './contract',
    },
  ],
}

export default config
