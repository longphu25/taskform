import type { StoragePolicy } from '../../../types/form'

interface StoragePolicyPanelProps {
  policy: StoragePolicy
  onChange: (policy: StoragePolicy) => void
}

const EPOCH_LABELS: { key: keyof StoragePolicy; label: string }[] = [
  { key: 'schemaDuration', label: 'Schema' },
  { key: 'submissionDuration', label: 'Submissions' },
  { key: 'screenshotDuration', label: 'Screenshots' },
  { key: 'videoDuration', label: 'Videos' },
]

export function StoragePolicyPanel({ policy, onChange }: StoragePolicyPanelProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-3">
      <h3 className="mb-3 text-xs font-medium text-zinc-500">Storage (epochs)</h3>
      <div className="space-y-2">
        {EPOCH_LABELS.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">{label}</span>
            <input
              type="number"
              value={policy[key]}
              onChange={(e) => onChange({ ...policy, [key]: Math.max(1, Number(e.target.value)) })}
              min={1}
              max={100}
              className="w-14 rounded border border-white/10 bg-zinc-800 px-2 py-1 text-center text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
