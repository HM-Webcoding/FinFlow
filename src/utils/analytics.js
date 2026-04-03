// src/utils/analytics.js
import { getMonthKey, formatMonthYear } from "./format"
import { CATEGORIES } from "../data/transactions"

// ── Monthly totals ──────────────────────────────
export const getMonthlyTotals = (transactions) => {
  const map = {}
  transactions.forEach((t) => {
    const key = getMonthKey(t.date)
    if (!map[key]) map[key] = { key, month: formatMonthYear(t.date), income: 0, expense: 0, count: 0 }
    if (t.type === "income")  map[key].income  += t.amount
    if (t.type === "expense") map[key].expense += t.amount
    map[key].count++
  })
  return Object.values(map)
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((m) => ({ ...m, savings: m.income - m.expense }))
}

// ── Category breakdown (expenses) ──────────────
export const getExpensesByCategory = (transactions) => {
  const total = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0)
  const map = {}
  transactions.filter((t) => t.type === "expense").forEach((t) => {
    if (!map[t.category]) map[t.category] = { amount: 0, count: 0 }
    map[t.category].amount += t.amount
    map[t.category].count++
  })
  return Object.entries(map)
    .map(([category, { amount, count }]) => ({
      category,
      label:   CATEGORIES[category]?.label ?? category,
      color:   CATEGORIES[category]?.color ?? "#94a3b8",
      bg:      CATEGORIES[category]?.bg    ?? "#f1f5f9",
      icon:    CATEGORIES[category]?.icon  ?? "💳",
      amount,
      count,
      percent: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
}

// ── Income breakdown ────────────────────────────
export const getIncomeByCategory = (transactions) => {
  const total = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const map = {}
  transactions.filter((t) => t.type === "income").forEach((t) => {
    if (!map[t.category]) map[t.category] = 0
    map[t.category] += t.amount
  })
  return Object.entries(map)
    .map(([category, amount]) => ({
      category,
      label:   CATEGORIES[category]?.label ?? category,
      color:   CATEGORIES[category]?.color ?? "#94a3b8",
      amount,
      percent: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
}

// ── Summary ─────────────────────────────────────
export const getSummary = (transactions) => {
  const totalIncome  = transactions.filter((t) => t.type === "income").reduce((s, t)  => s + t.amount, 0)
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0)
  const balance      = totalIncome - totalExpense
  const savingsRate  = totalIncome > 0 ? (balance / totalIncome) * 100 : 0
  const txCount      = transactions.length
  const avgExpense   = txCount > 0 ? totalExpense / transactions.filter((t) => t.type === "expense").length : 0
  return { totalIncome, totalExpense, balance, savingsRate, txCount, avgExpense }
}

// ── Month-over-month ────────────────────────────
export const getMoMComparison = (transactions) => {
  const monthly = getMonthlyTotals(transactions)
  if (monthly.length < 2) {
    const m = monthly[0] ?? { expense: 0, income: 0, savings: 0, month: "—" }
    return { thisMonth: m, lastMonth: null, delta: 0, deltaPercent: 0, trend: "same", incomeDelta: 0, incomePercent: 0 }
  }
  const thisMonth = monthly[monthly.length - 1]
  const lastMonth = monthly[monthly.length - 2]
  const delta         = thisMonth.expense - lastMonth.expense
  const deltaPercent  = lastMonth.expense > 0 ? (delta / lastMonth.expense) * 100 : 0
  const incomeDelta   = thisMonth.income - lastMonth.income
  const incomePercent = lastMonth.income > 0 ? (incomeDelta / lastMonth.income) * 100 : 0
  return {
    thisMonth, lastMonth,
    delta, deltaPercent, trend: delta > 0 ? "up" : delta < 0 ? "down" : "same",
    incomeDelta, incomePercent,
  }
}

// ── Top category ────────────────────────────────
export const getTopCategory = (transactions) => getExpensesByCategory(transactions)[0] ?? null

// ── Daily spending (last 30 days) ───────────────
export const getDailySpending = (transactions) => {
  const map = {}
  transactions.filter((t) => t.type === "expense").forEach((t) => {
    map[t.date] = (map[t.date] || 0) + t.amount
  })
  return Object.entries(map)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

// ── Filter + sort ───────────────────────────────
export const filterTransactions = (transactions, filters = {}) => {
  const {
    type = "all", category = "all", search = "",
    sortBy = "date", sortDir = "desc",
    dateFrom = "", dateTo = "",
    amountMin = "", amountMax = "",
  } = filters

  let result = [...transactions]

  if (type !== "all")     result = result.filter((t) => t.type === type)
  if (category !== "all") result = result.filter((t) => t.category === category)
  if (dateFrom)           result = result.filter((t) => t.date >= dateFrom)
  if (dateTo)             result = result.filter((t) => t.date <= dateTo)
  if (amountMin !== "")   result = result.filter((t) => t.amount >= Number(amountMin))
  if (amountMax !== "")   result = result.filter((t) => t.amount <= Number(amountMax))

  if (search.trim()) {
    const q = search.toLowerCase()
    result = result.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.note?.toLowerCase().includes(q) ||
        CATEGORIES[t.category]?.label?.toLowerCase().includes(q)
    )
  }

  result.sort((a, b) => {
    let va = a[sortBy], vb = b[sortBy]
    if (sortBy === "amount") { va = Number(va); vb = Number(vb) }
    if (va < vb) return sortDir === "asc" ? -1 : 1
    if (va > vb) return sortDir === "asc" ?  1 : -1
    return 0
  })

  return result
}

// ── Generate observations ───────────────────────
export const generateObservations = ({ topCategory, mom, monthly, summary, categoryBreakdown }) => {
  const obs = []

  if (topCategory) {
    obs.push({
      type: "warning",
      icon: "🏆",
      title: "Top spending area",
      text: `${topCategory.label} is your biggest expense at ${topCategory.percent.toFixed(1)}% of total spending.`,
    })
  }

  if (mom.trend === "down" && mom.lastMonth) {
    obs.push({
      type: "success",
      icon: "📉",
      title: "Spending decreased",
      text: `Your spending dropped by ৳${Math.abs(mom.delta).toLocaleString("en-IN")} (${Math.abs(mom.deltaPercent).toFixed(1)}%) compared to ${mom.lastMonth.month}. Keep it up!`,
    })
  } else if (mom.trend === "up" && mom.lastMonth) {
    obs.push({
      type: "alert",
      icon: "📈",
      title: "Spending increased",
      text: `You spent ৳${Math.abs(mom.delta).toLocaleString("en-IN")} more (${Math.abs(mom.deltaPercent).toFixed(1)}%) than ${mom.lastMonth.month}. Review discretionary expenses.`,
    })
  }

  const profitableMonths = monthly.filter((m) => m.savings > 0)
  if (profitableMonths.length === monthly.length && monthly.length > 0) {
    obs.push({
      type: "success",
      icon: "💰",
      title: "Consistently saving",
      text: `You saved money every month — ${monthly.map((m) => `৳${m.savings.toLocaleString("en-IN")} in ${m.month}`).join(", ")}.`,
    })
  }

  if (summary.savingsRate >= 30) {
    obs.push({
      type: "success",
      icon: "🎯",
      title: "Healthy savings rate",
      text: `Your savings rate of ${summary.savingsRate.toFixed(1)}% is above the recommended 20% benchmark.`,
    })
  } else if (summary.savingsRate < 10 && summary.savingsRate > 0) {
    obs.push({
      type: "alert",
      icon: "⚠️",
      title: "Low savings rate",
      text: `Only ${summary.savingsRate.toFixed(1)}% of income is being saved. Aim for at least 20% to build a financial cushion.`,
    })
  }

  if (categoryBreakdown.length >= 2) {
    const top2 = categoryBreakdown.slice(0, 2)
    const combined = top2.reduce((s, c) => s + c.percent, 0)
    if (combined > 50) {
      obs.push({
        type: "info",
        icon: "📊",
        title: "Concentrated spending",
        text: `${top2[0].label} and ${top2[1].label} account for ${combined.toFixed(1)}% of your expenses. Consider diversifying your budget.`,
      })
    }
  }

  return obs
}
