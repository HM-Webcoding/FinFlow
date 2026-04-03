"use client"
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend,
} from "recharts"
import { Wallet, ArrowUpCircle, ArrowDownCircle, PiggyBank } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { StatCard, SectionHeader, ProgressBar, AmountDisplay } from "@/components/shared"
import { ChartTooltip } from "@/components/shared/ChartTooltip"
import { useSummary, useMonthlyTotals, useCategoryBreakdown } from "@/hooks/useFinanceData"
import { formatCurrency } from "@/utils/format"

export default function Dashboard() {
  const summary    = useSummary()
  const monthly    = useMonthlyTotals()
  const categories = useCategoryBreakdown()

  const stats = [
    {
      label: "Net Balance",
      value: formatCurrency(summary.balance),
      sub:   `${summary.savingsRate.toFixed(1)}% savings rate`,
      icon:  Wallet,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: summary.balance >= 0 ? "down" : "up",
      animClass: "animate-fade-up-1",
    },
    {
      label: "Total Income",
      value: formatCurrency(summary.totalIncome),
      sub:   "Jan – Mar 2026",
      icon:  ArrowUpCircle,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      animClass: "animate-fade-up-2",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(summary.totalExpense),
      sub:   `Avg ৳${Math.round(summary.avgExpense).toLocaleString("en-IN")} / txn`,
      icon:  ArrowDownCircle,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-500",
      animClass: "animate-fade-up-3",
    },
    {
      label: "Total Saved",
      value: formatCurrency(summary.balance),
      sub:   `${summary.txCount} transactions`,
      icon:  PiggyBank,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      animClass: "animate-fade-up-4",
    },
  ]

  return (
    <div className="space-y-5">

      {/* ── Stat cards ────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Area chart ────────────────── */}
      <Card className="animate-fade-up">
        <CardHeader>
          <CardTitle>Income vs Expenses</CardTitle>
          <CardDescription>Monthly trend — Jan to Mar 2026</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={monthly} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#059669" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#dc2626" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="gSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => formatCurrency(v, true)} tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} width={58} />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, fontFamily: "DM Sans" }} />
              <Area type="monotone" dataKey="income"  name="Income"   stroke="#059669" fill="url(#gIncome)"  strokeWidth={2.5} dot={{ r: 4, fill: "#059669", strokeWidth: 0 }} activeDot={{ r: 5 }} />
              <Area type="monotone" dataKey="expense" name="Expenses" stroke="#dc2626" fill="url(#gExpense)" strokeWidth={2.5} dot={{ r: 4, fill: "#dc2626", strokeWidth: 0 }} activeDot={{ r: 5 }} />
              <Area type="monotone" dataKey="savings" name="Savings"  stroke="#2563eb" fill="url(#gSavings)" strokeWidth={2}   dot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }} activeDot={{ r: 5 }} strokeDasharray="5 3" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ── Category charts ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Horizontal bar chart — lg:col-span-3 */}
        <Card className="lg:col-span-3 animate-fade-up">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Total expenses per category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categories.slice(0, 6)} layout="vertical" margin={{ top: 0, right: 8, left: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => formatCurrency(v, true)} tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 12, fill: "#64748b", fontFamily: "DM Sans" }} axisLine={false} tickLine={false} width={96} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="amount" name="Spent" radius={[0, 6, 6, 0]} maxBarSize={16}>
                  {categories.slice(0, 6).map((entry) => (
                    <Cell key={entry.category} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Progress breakdown — lg:col-span-2 */}
        <Card className="lg:col-span-2 animate-fade-up">
          <CardHeader>
            <CardTitle>Category Share</CardTitle>
            <CardDescription>% of total expenses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {categories.slice(0, 6).map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5 text-sm text-slate-600">
                    <span className="text-base leading-none">{cat.icon}</span>
                    <span className="font-medium">{cat.label}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 tabular-nums">{cat.percent.toFixed(1)}%</span>
                    <AmountDisplay amount={cat.amount} size="sm" />
                  </div>
                </div>
                <ProgressBar value={cat.percent} color={cat.color} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Monthly summary table ──────── */}
      <Card className="animate-fade-up">
        <CardHeader>
          <CardTitle>Monthly Summary</CardTitle>
          <CardDescription>Income, expenses, and savings per month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Month</th>
                  <th className="text-right py-2 px-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Income</th>
                  <th className="text-right py-2 px-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Expenses</th>
                  <th className="text-right py-2 pl-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Saved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {monthly.map((m) => (
                  <tr key={m.key} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 pr-4 font-medium text-foreground">{m.month}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-emerald-600 font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>
                      +{formatCurrency(m.income)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-foreground font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>
                      −{formatCurrency(m.expense)}
                    </td>
                    <td className="py-3 pl-4 text-right tabular-nums font-semibold" style={{ fontFamily: "'DM Mono', monospace" }}>
                      <span className={m.savings >= 0 ? "text-blue-600" : "text-rose-500"}>
                        {m.savings >= 0 ? "+" : "−"}{formatCurrency(Math.abs(m.savings))}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border bg-muted/30">
                  <td className="py-3 pr-4 font-bold text-foreground text-xs uppercase tracking-wider">Total</td>
                  <td className="py-3 px-4 text-right tabular-nums text-emerald-600 font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>
                    +{formatCurrency(summary.totalIncome)}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-foreground font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>
                    −{formatCurrency(summary.totalExpense)}
                  </td>
                  <td className="py-3 pl-4 text-right tabular-nums font-bold text-blue-600" style={{ fontFamily: "'DM Mono', monospace" }}>
                    +{formatCurrency(summary.balance)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
