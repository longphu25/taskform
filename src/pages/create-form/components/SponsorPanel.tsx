import type { SponsorSettings } from '../../../types/form'

interface SponsorPanelProps {
  settings: SponsorSettings
  onChange: (settings: SponsorSettings) => void
}

export function SponsorPanel({ settings, onChange }: SponsorPanelProps) {
  return (
    <div className="rounded-xl border border-[rgba(190,255,234,0.16)] bg-[rgba(8,24,25,0.82)] p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-medium text-[#9fb9b1]/70">Sponsored</h3>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => onChange({ ...settings, enabled: e.target.checked })}
            className="size-3.5 rounded accent-[#80ffd5]"
          />
          <span className="text-[10px] text-[#9fb9b1]">Enable</span>
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
              className="w-16 rounded border border-[rgba(190,255,234,0.16)] bg-[#0d1c1d] px-2 py-1 text-center text-xs text-[#effff8] outline-none focus:border-[#80ffd5]"
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
              className="w-16 rounded border border-[rgba(190,255,234,0.16)] bg-[#0d1c1d] px-2 py-1 text-center text-xs text-[#effff8] outline-none focus:border-[#80ffd5]"
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
              className="w-16 rounded border border-[rgba(190,255,234,0.16)] bg-[#0d1c1d] px-2 py-1 text-center text-xs text-[#effff8] outline-none focus:border-[#80ffd5]"
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
      <span className="text-xs text-[#9fb9b1]">{label}</span>
      {children}
    </div>
  )
}
