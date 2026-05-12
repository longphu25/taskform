import type { StoragePolicy } from '../../../types/form'

interface StoragePolicyPanelProps {
  policy: StoragePolicy
  onChange: (policy: StoragePolicy) => void
}

const EPOCH_LABELS: { key: keyof StoragePolicy; label: string }[] = [
  { key: 'schemaDuration', label: 'Form schema' },
  { key: 'submissionDuration', label: 'Submissions' },
  { key: 'screenshotDuration', label: 'Screenshots' },
  { key: 'videoDuration', label: 'Videos' },
]

export function StoragePolicyPanel({ policy, onChange }: StoragePolicyPanelProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
      <h3 className="mb-4 text-sm font-medium text-zinc-400">Storage Policy (Walrus epochs)</h3>
      <div className="space-y-3">
        {EPOCH_LABELS.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <span className="text-sm text-zinc-300">{label}</span>
            <input
              type="number"
              value={policy[key]}
              onChange={(e) => onChange({ ...policy, [key]: Math.max(1, Number(e.target.value)) })}
              min={1}
              max={100}
              className="w-20 rounded-lg border border-white/10 bg-zinc-800 px-3 py-1.5 text-center text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-zinc-600">1 epoch ≈ 1 day on Walrus testnet</p>
    </div>
  )
}
