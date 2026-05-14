import { useState, useEffect } from 'react'
import { Coins } from 'lucide-react'

interface StorageCostEstimateProps {
  dataSize: number
  epochs: number
}

export function StorageCostEstimate({ dataSize, epochs }: StorageCostEstimateProps) {
  const [cost, setCost] = useState<{ storage: string; total: string } | null>(null)

  useEffect(() => {
    if (dataSize <= 0 || epochs <= 0) return

    let cancelled = false
    import('../../../lazy/walrus-upload').then(async ({ getWalrusClient }) => {
      try {
        const client = getWalrusClient()
        const result = await client.walrus.storageCost(dataSize, epochs)
        if (!cancelled) {
          const totalWal = (Number(result.totalCost) / 1_000_000_000).toFixed(4)
          const storageWal = (Number(result.storageCost) / 1_000_000_000).toFixed(4)
          setCost({ storage: storageWal, total: totalWal })
        }
      } catch {
        // silently fail
      }
    })

    return () => {
      cancelled = true
    }
  }, [dataSize, epochs])

  if (!cost) return null

  return (
    <div className="rounded-lg border border-white/10 bg-zinc-800/50 px-3 py-2">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Coins className="size-3 text-zinc-500" />
        <span className="text-xs font-medium text-zinc-400">Estimated cost</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-500">Storage</span>
        <span className="font-mono text-zinc-300">{cost.storage} WAL</span>
      </div>
      <div className="flex items-center justify-between text-xs mt-1">
        <span className="text-zinc-500">Total</span>
        <span className="font-mono text-white">{cost.total} WAL</span>
      </div>
    </div>
  )
}
