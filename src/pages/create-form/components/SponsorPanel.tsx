import type { SponsorSettings } from '../../../types/form'

interface SponsorPanelProps {
  settings: SponsorSettings
  onChange: (settings: SponsorSettings) => void
}

export function SponsorPanel({ settings, onChange }: SponsorPanelProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-medium text-zinc-500">Sponsored</h3>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => onChange({ ...settings, enabled: e.target.checked })}
            className="size-3.5 rounded accent-indigo-500"
          />
          <span className="text-[10px] text-zinc-400">Enable</span>
        </label>
      </div>

      {settings.enabled && (
        <div className="space-y-2">
          <Row label="Budget (SUI)">
            <input
              type="number"
              value={settings.budgetSUI}
              onChange={(e) =>
                onChange({ ...settings, budgetSUI: Math.max(0, Number(e.target.value)) })
              }
              min={0}
              step={0.1}
              className="w-16 rounded border border-white/10 bg-zinc-800 px-2 py-1 text-center text-xs text-white outline-none focus:border-indigo-500"
            />
          </Row>
          <Row label="Max count">
            <input
              type="number"
              value={settings.maxSponsored}
              onChange={(e) =>
                onChange({ ...settings, maxSponsored: Math.max(0, Number(e.target.value)) })
              }
              min={0}
              className="w-16 rounded border border-white/10 bg-zinc-800 px-2 py-1 text-center text-xs text-white outline-none focus:border-indigo-500"
            />
          </Row>
          <Row label="Max file (MB)">
            <input
              type="number"
              value={settings.maxFileSizeMB}
              onChange={(e) =>
                onChange({ ...settings, maxFileSizeMB: Math.max(1, Number(e.target.value)) })
              }
              min={1}
              max={100}
              className="w-16 rounded border border-white/10 bg-zinc-800 px-2 py-1 text-center text-xs text-white outline-none focus:border-indigo-500"
            />
          </Row>
        </div>
      )}
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-zinc-400">{label}</span>
      {children}
    </div>
  )
}
