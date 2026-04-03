"use client"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

// ── StatCard ────────────────────────────────────
export function StatCard({ label, value, sub, trend, icon: Icon, iconBg, iconColor, className, animClass }) {
  const trendColor = trend === "up" ? "text-rose-500" : trend === "down" ? "text-emerald-500" : "text-muted-foreground"
  const TrendIcon  = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus

  return (
    <div className={cn("bg-card rounded-xl border border-border shadow-card p-5", animClass, className)}>
      <div className="flex items-start justify-between mb-3">
        <div className={cn("p-2 rounded-lg", iconBg)}>
          <Icon className={cn("w-4 h-4", iconColor)} />
        </div>
        {trend && <TrendIcon className={cn("w-4 h-4", trendColor)} />}
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{value}</p>
      {sub && <p className={cn("text-xs", trend ? trendColor : "text-muted-foreground")}>{sub}</p>}
    </div>
  )
}

// ── TrendBadge ──────────────────────────────────
export function TrendBadge({ trend, value, label }) {
  if (!value) return null
  const styles = {
    up:   "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400",
    down: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    same: "bg-muted text-muted-foreground",
  }
  const icons = { up: "↑", down: "↓", same: "—" }
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full", styles[trend])}>
      {icons[trend]} {value}{label ? ` ${label}` : ""}
    </span>
  )
}

// ── EmptyState ──────────────────────────────────
export function EmptyState({ icon = "📭", title, sub, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <span className="text-5xl mb-4">{icon}</span>
      <p className="font-semibold text-foreground mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{title}</p>
      {sub && <p className="text-sm text-muted-foreground max-w-xs">{sub}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// ── SectionHeader ───────────────────────────────
export function SectionHeader({ title, description, action, className }) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-4", className)}>
      <div>
        <h2 className="font-semibold text-foreground" style={{ fontFamily: "'Syne', sans-serif" }}>{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

// ── CategoryDot ─────────────────────────────────
export function CategoryDot({ color, size = "sm" }) {
  const sizes = { sm: "w-2 h-2", md: "w-2.5 h-2.5" }
  return <span className={cn("rounded-full inline-block flex-shrink-0", sizes[size])} style={{ backgroundColor: color }} />
}

// ── AmountDisplay ───────────────────────────────
export function AmountDisplay({ amount, type, size = "default" }) {
  const sizes    = { sm: "text-sm", default: "text-base", lg: "text-lg", xl: "text-2xl" }
  const color    = type === "income" ? "text-emerald-600 dark:text-emerald-400" : type === "expense" ? "text-foreground" : "text-foreground"
  const prefix   = type === "income" ? "+" : type === "expense" ? "−" : ""
  return (
    <span className={cn("font-semibold tabular-nums", sizes[size], color)} style={{ fontFamily: "'DM Mono', monospace" }}>
      {prefix}৳{Number(amount).toLocaleString("en-IN")}
    </span>
  )
}

// ── ProgressBar ─────────────────────────────────
export function ProgressBar({ value, color, className }) {
  return (
    <div className={cn("h-1.5 bg-muted rounded-full overflow-hidden", className)}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
      />
    </div>
  )
}

// ── ObservationCard ─────────────────────────────
export function ObservationCard({ obs }) {
  const styles = {
    success: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300",
    alert:   "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300",
    warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300",
    info:    "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300",
  }
  return (
    <div className={cn("rounded-xl border p-4 flex gap-3", styles[obs.type] ?? styles.info)}>
      <span className="text-xl leading-none mt-0.5 flex-shrink-0">{obs.icon}</span>
      <div>
        <p className="font-semibold text-sm mb-0.5">{obs.title}</p>
        <p className="text-sm opacity-80 leading-relaxed">{obs.text}</p>
      </div>
    </div>
  )
}
