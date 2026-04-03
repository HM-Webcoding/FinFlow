"use client"
import { useState } from "react"
import { useApp } from "@/context/AppContext"
import { useFilteredTransactions } from "@/hooks/useFinanceData"
import { CATEGORIES } from "@/data/transactions"
import { formatCurrency, formatDate } from "@/utils/format"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { AmountDisplay, CategoryDot, EmptyState } from "@/components/shared"
import { Plus, Search, X, ArrowUpDown, ArrowUp, ArrowDown, Filter, ChevronDown, ChevronUp } from "lucide-react"
import AddTransactionModal from "./AddTransactionModal"
import { cn } from "@/lib/utils"

function SortButton({ field, label, sortBy, sortDir, onClick }) {
  const active = sortBy === field
  const Icon   = !active ? ArrowUpDown : sortDir === "desc" ? ArrowDown : ArrowUp
  return (
    <button
      onClick={() => onClick(field)}
      className={cn(
        "flex items-center gap-1 text-xs font-semibold uppercase tracking-wider select-none transition-colors",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
      <Icon className={cn("w-3 h-3", active ? "opacity-100" : "opacity-40")} />
    </button>
  )
}

export default function Transactions() {
  const { filters, updateFilter, resetFilters, isAdmin, hasActiveFilters } = useApp()
  const transactions = useFilteredTransactions()
  const [showModal,    setShowModal]    = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const toggleSort = (field) => {
    if (filters.sortBy === field) updateFilter("sortDir", filters.sortDir === "desc" ? "asc" : "desc")
    else { updateFilter("sortBy", field); updateFilter("sortDir", "desc") }
  }

  const totalFiltered = transactions.reduce(
    (acc, t) => { if (t.type === "income") acc.income += t.amount; else acc.expense += t.amount; return acc },
    { income: 0, expense: 0 }
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Syne', sans-serif" }}>Transactions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {transactions.length} result{transactions.length !== 1 ? "s" : ""}{hasActiveFilters && " (filtered)"}
          </p>
        </div>
        {isAdmin && (
          <Button size="sm" onClick={() => setShowModal(true)} className="gap-1.5 shrink-0">
            <Plus className="w-4 h-4" /> Add Transaction
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by name, note or category…"
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={filters.type} onValueChange={(v) => updateFilter("type", v)}>
              <SelectTrigger className="w-36"><SelectValue placeholder="All types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.category} onValueChange={(v) => updateFilter("category", v)}>
              <SelectTrigger className="w-44"><SelectValue placeholder="All categories" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <Separator className="my-1" />
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">{cat.icon} {cat.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              onClick={() => setShowAdvanced((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-medium border transition-colors",
                showAdvanced
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-muted-foreground border-border hover:bg-muted"
              )}
            >
              <Filter className="w-3.5 h-3.5" />
              Filters
              {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1 text-muted-foreground h-9">
                <X className="w-3.5 h-3.5" /> Reset
              </Button>
            )}
          </div>

          {/* Advanced filters */}
          {showAdvanced && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">From date</p>
                <Input type="date" value={filters.dateFrom} onChange={(e) => updateFilter("dateFrom", e.target.value)} className="text-sm" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">To date</p>
                <Input type="date" value={filters.dateTo} onChange={(e) => updateFilter("dateTo", e.target.value)} className="text-sm" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Min amount (৳)</p>
                <Input type="number" placeholder="0" value={filters.amountMin} onChange={(e) => updateFilter("amountMin", e.target.value)} className="text-sm tabular-nums" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Max amount (৳)</p>
                <Input type="number" placeholder="∞" value={filters.amountMax} onChange={(e) => updateFilter("amountMax", e.target.value)} className="text-sm tabular-nums" />
              </div>
            </div>
          )}

          {/* Filtered totals */}
          {hasActiveFilters && transactions.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border text-xs text-muted-foreground">
              <span className="font-medium">Filtered total:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">+{formatCurrency(totalFiltered.income)}</span>
              <span className="text-foreground font-semibold tabular-nums">−{formatCurrency(totalFiltered.expense)}</span>
              <span className={cn("font-semibold tabular-nums", totalFiltered.income - totalFiltered.expense >= 0 ? "text-blue-600 dark:text-blue-400" : "text-rose-500")}>
                net {totalFiltered.income - totalFiltered.expense >= 0 ? "+" : "−"}{formatCurrency(Math.abs(totalFiltered.income - totalFiltered.expense))}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        {transactions.length === 0 ? (
          <EmptyState
            icon={hasActiveFilters ? "🔍" : "📋"}
            title={hasActiveFilters ? "No transactions match your filters" : "No transactions yet"}
            sub={hasActiveFilters ? "Try adjusting or resetting your filters" : "Add your first transaction to get started"}
            action={
              hasActiveFilters
                ? <Button variant="outline" size="sm" onClick={resetFilters}>Clear filters</Button>
                : isAdmin
                  ? <Button size="sm" onClick={() => setShowModal(true)}>Add Transaction</Button>
                  : null
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-4 py-3">
                    <SortButton field="date" label="Date" sortBy={filters.sortBy} sortDir={filters.sortDir} onClick={toggleSort} />
                  </th>
                  <th className="text-left px-4 py-3">
                    <SortButton field="description" label="Description" sortBy={filters.sortBy} sortDir={filters.sortDir} onClick={toggleSort} />
                  </th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</span>
                  </th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</span>
                  </th>
                  <th className="text-right px-4 py-3">
                    <SortButton field="amount" label="Amount" sortBy={filters.sortBy} sortDir={filters.sortDir} onClick={toggleSort} />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((txn) => {
                  const cat = CATEGORIES[txn.category]
                  return (
                    <tr key={txn.id} className="hover:bg-muted/40 transition-colors duration-100">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-muted-foreground tabular-nums text-xs" style={{ fontFamily: "'DM Mono', monospace" }}>
                          {formatDate(txn.date)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 max-w-[260px]">
                        <p className="font-medium text-foreground truncate">{txn.description}</p>
                        {txn.note && <p className="text-xs text-muted-foreground truncate mt-0.5">{txn.note}</p>}
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <CategoryDot color={cat?.color} />
                          <span className="text-muted-foreground text-xs">{cat?.label ?? txn.category}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <Badge variant={txn.type === "income" ? "income" : "expense"}>
                          {txn.type === "income" ? "Income" : "Expense"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <AmountDisplay amount={txn.amount} type={txn.type} size="sm" />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              {transactions.length > 1 && (
                <tfoot>
                  <tr className="border-t border-border bg-muted/30">
                    <td colSpan={4} className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {transactions.length} transactions
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex flex-col items-end gap-0.5">
                        {totalFiltered.income > 0 && (
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums" style={{ fontFamily: "'DM Mono', monospace" }}>
                            +{formatCurrency(totalFiltered.income)}
                          </span>
                        )}
                        {totalFiltered.expense > 0 && (
                          <span className="text-xs font-semibold text-foreground tabular-nums" style={{ fontFamily: "'DM Mono', monospace" }}>
                            −{formatCurrency(totalFiltered.expense)}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </Card>

      <AddTransactionModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}
