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
    <div className="rounded-lg border border-[rgba(190,255,234,0.16)] bg-[rgba(12,34,35,0.58)] px-3 py-2">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Coins className="size-3 text-[#9fb9b1]/70" />
        <span className="text-xs font-medium text-[#9fb9b1]">Estimated cost</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#9fb9b1]/70">Storage</span>
        <span className="font-mono text-[#effff8]/85">{cost.storage} WAL</span>
      </div>
      <div className="flex items-center justify-between text-xs mt-1">
        <span className="text-[#9fb9b1]/70">Total</span>
        <span className="font-mono text-[#effff8]">{cost.total} WAL</span>
      </div>
    </div>
  )
}
