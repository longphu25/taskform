import type { SponsorSettings } from '../../../types/form'

interface SponsorPanelProps {
  settings: SponsorSettings
  onChange: (settings: SponsorSettings) => void
}

export function SponsorPanel({ settings, onChange }: SponsorPanelProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-400">Sponsored Submissions</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => onChange({ ...settings, enabled: e.target.checked })}
            className="size-4 rounded accent-indigo-500"
          />
          <span className="text-xs text-zinc-400">Enable</span>
        </label>
      </div>

      {settings.enabled && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-zinc-300">Budget (SUI)</span>
            <input
              type="number"
              value={settings.budgetSUI}
              onChange={(e) =>
                onChange({ ...settings, budgetSUI: Math.max(0, Number(e.target.value)) })
              }
              min={0}
              step={0.1}
              className="w-24 rounded-lg border border-white/10 bg-zinc-800 px-3 py-1.5 text-center text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-zinc-300">Max sponsored</span>
            <input
              type="number"
              value={settings.maxSponsored}
              onChange={(e) =>
                onChange({ ...settings, maxSponsored: Math.max(0, Number(e.target.value)) })
              }
              min={0}
              className="w-24 rounded-lg border border-white/10 bg-zinc-800 px-3 py-1.5 text-center text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-zinc-300">Max file size (MB)</span>
            <input
              type="number"
              value={settings.maxFileSizeMB}
              onChange={(e) =>
                onChange({ ...settings, maxFileSizeMB: Math.max(1, Number(e.target.value)) })
              }
              min={1}
              max={100}
              className="w-24 rounded-lg border border-white/10 bg-zinc-800 px-3 py-1.5 text-center text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      )}
    </div>
  )
}
