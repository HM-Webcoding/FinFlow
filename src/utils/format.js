// src/utils/format.js

export const formatCurrency = (amount, compact = false) => {
  const n = Number(amount)
  if (compact) {
    if (n >= 100000) return `৳${(n / 100000).toFixed(1)}L`
    if (n >= 1000)   return `৳${(n / 1000).toFixed(1)}k`
  }
  return `৳${n.toLocaleString("en-IN")}`
}

export const formatDate = (dateStr) =>
  new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  })

export const formatDateShort = (dateStr) =>
  new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short", day: "numeric",
  })

export const formatMonthYear = (dateStr) =>
  new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short", year: "numeric",
  })

export const getMonthKey   = (dateStr) => dateStr.slice(0, 7)
export const getMonthLabel = (key)     => formatMonthYear(key + "-01")

export const formatPercent = (ratio, decimals = 1) =>
  `${(ratio * 100).toFixed(decimals)}%`
