"use client"
import { ObservationCard, ProgressBar, TrendBadge } from "@/components/shared"
import { ChartTooltip, PieTooltip } from "@/components/shared/ChartTooltip"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useInsights } from "@/hooks/useFinanceData"
import { formatCurrency } from "@/utils/format"
import { Lightbulb } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis,
} from "recharts"

export default function Insights() {
  const { topCategory, mom, monthly, summary, categoryBreakdown, observations } = useInsights()

  return (
    <div className="space-y-5">

      {/* ── Header ────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Syne', sans-serif" }}>Insights</h1>
        <p className="text-sm text-slate-500 mt-0.5">Auto-generated observations from your financial data</p>
      </div>

      {/* ── KPI cards ─────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Top spending category */}
        {topCategory && (
          <Card className="animate-fade-up-1">
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Top Spending</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: topCategory.bg }}>
                  {topCategory.icon}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{topCategory.label}</p>
                  <p className="font-bold text-xl" style={{ color: topCategory.color, fontFamily: "'Syne', sans-serif" }}>
                    {formatCurrency(topCategory.amount)}
                  </p>
                </div>
              </div>
              <ProgressBar value={topCategory.percent} color={topCategory.color} />
              <p className="text-xs text-slate-400 mt-1.5">{topCategory.percent.toFixed(1)}% of total expenses</p>
            </CardContent>
          </Card>
        )}

        {/* This month */}
        <Card className="animate-fade-up-2">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">This Month</p>
            <p className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
              {formatCurrency(mom.thisMonth?.expense ?? 0)}
            </p>
            <p className="text-sm text-slate-500 mb-3">{mom.thisMonth?.month}</p>
            <TrendBadge
              trend={mom.trend}
              value={mom.lastMonth ? `${Math.abs(mom.deltaPercent).toFixed(1)}%` : null}
              label={mom.lastMonth ? `vs ${mom.lastMonth.month}` : null}
            />
          </CardContent>
        </Card>

        {/* Last month */}
        <Card className="animate-fade-up-3">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Last Month</p>
            <p className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
              {mom.lastMonth ? formatCurrency(mom.lastMonth.expense) : "—"}
            </p>
            <p className="text-sm text-slate-500 mb-3">{mom.lastMonth?.month ?? "No data"}</p>
            {mom.lastMonth && (
              <p className="text-xs text-slate-400">
                Saved{" "}
                <span className="font-semibold text-blue-600">{formatCurrency(mom.lastMonth.savings)}</span>
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Charts row ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Donut chart */}
        <Card className="animate-fade-up">
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
            <CardDescription>Breakdown by category — all months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="amount"
                  nameKey="label"
                  cx="50%" cy="50%"
                  innerRadius={58} outerRadius={88}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {categoryBreakdown.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, fontFamily: "DM Sans" }}
                  formatter={(value) => <span className="text-slate-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly savings bar */}
        <Card className="animate-fade-up">
          <CardHeader>
            <CardTitle>Monthly Savings</CardTitle>
            <CardDescription>Net amount saved each month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthly} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => formatCurrency(v, true)} tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} width={58} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="savings" name="Savings" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {monthly.map((m) => (
                    <Cell key={m.key} fill={m.savings >= 0 ? "#2563eb" : "#dc2626"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Category detail list ──────────────────── */}
      <Card className="animate-fade-up">
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>All expense categories ranked by spending</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryBreakdown.map((cat, i) => (
              <div key={cat.category}>
                {i > 0 && <Separator className="mb-4" />}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-foreground" style={{ backgroundColor: cat.bg }}>
                      {cat.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-muted-foreground">{cat.label}</p>
                      <p className="text-xs text-slate-400">{cat.count} transaction{cat.count !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground tabular-nums" style={{ fontFamily: "'DM Mono', monospace" }}>
                      {formatCurrency(cat.amount)}
                    </p>
                    <p className="text-xs text-slate-400">{cat.percent.toFixed(1)}%</p>
                  </div>
                </div>
                <ProgressBar value={cat.percent} color={cat.color} />
              </div>
            ))}
            {categoryBreakdown.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No expense data available.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Observations ─────────────────────────── */}
      <Card className="animate-fade-up">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-50">
              <Lightbulb className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <CardTitle>Smart Observations</CardTitle>
              <CardDescription>Insights generated from your spending patterns</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {observations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Add more transactions to unlock personalized insights.
            </p>
          ) : (
            <div className="space-y-3">
              {observations.map((obs, i) => (
                <ObservationCard key={i} obs={obs} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Summary stats row ─────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Savings Rate", value: `${summary.savingsRate.toFixed(1)}%`, sub: "of total income", color: summary.savingsRate >= 20 ? "text-emerald-600" : "text-rose-500" },
          { label: "Avg per Transaction", value: formatCurrency(Math.round(summary.avgExpense)), sub: "per expense entry", color: "text-slate-900" },
          { label: "Total Transactions", value: summary.txCount, sub: "across 3 months", color: "text-slate-900" },
          { label: "Net Savings", value: formatCurrency(summary.balance), sub: "total accumulated", color: "text-blue-600" },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
              <p className={`text-xl font-bold tabular-nums ${item.color}`} style={{ fontFamily: "'Syne', sans-serif" }}>{item.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
