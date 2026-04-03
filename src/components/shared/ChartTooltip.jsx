"use client"
import { formatCurrency } from "@/utils/format"

export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card border border-border rounded-xl shadow-card-hover p-3 text-sm min-w-[140px]">
      {label && <p className="font-semibold text-muted-foreground mb-2 text-xs uppercase tracking-wider">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-semibold text-foreground tabular-nums" style={{ fontFamily: "'DM Mono', monospace" }}>
            {formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const p = payload[0]
  return (
    <div className="bg-card border border-border rounded-xl shadow-card-hover p-3 text-sm">
      <p className="font-semibold text-foreground">{p.name}</p>
      <p className="text-muted-foreground tabular-nums" style={{ fontFamily: "'DM Mono', monospace" }}>
        {formatCurrency(p.value)} <span className="text-xs">({p.payload.percent?.toFixed(1)}%)</span>
      </p>
    </div>
  )
}
