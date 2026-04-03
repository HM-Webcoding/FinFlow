"use client"
import { useMemo } from "react"
import { useApp } from "@/context/AppContext"
import {
  getSummary, getMonthlyTotals, getExpensesByCategory, getIncomeByCategory,
  getTopCategory, getMoMComparison, filterTransactions,
  getDailySpending, generateObservations,
} from "@/utils/analytics"

export const useSummary = () => {
  const { transactions } = useApp()
  return useMemo(() => getSummary(transactions), [transactions])
}

export const useMonthlyTotals = () => {
  const { transactions } = useApp()
  return useMemo(() => getMonthlyTotals(transactions), [transactions])
}

export const useCategoryBreakdown = () => {
  const { transactions } = useApp()
  return useMemo(() => getExpensesByCategory(transactions), [transactions])
}

export const useIncomeBreakdown = () => {
  const { transactions } = useApp()
  return useMemo(() => getIncomeByCategory(transactions), [transactions])
}

export const useDailySpending = () => {
  const { transactions } = useApp()
  return useMemo(() => getDailySpending(transactions), [transactions])
}

export const useInsights = () => {
  const { transactions } = useApp()
  return useMemo(() => {
    const topCategory       = getTopCategory(transactions)
    const mom               = getMoMComparison(transactions)
    const monthly           = getMonthlyTotals(transactions)
    const summary           = getSummary(transactions)
    const categoryBreakdown = getExpensesByCategory(transactions)
    const observations      = generateObservations({ topCategory, mom, monthly, summary, categoryBreakdown })
    return { topCategory, mom, monthly, summary, categoryBreakdown, observations }
  }, [transactions])
}

export const useFilteredTransactions = () => {
  const { transactions, filters } = useApp()
  return useMemo(() => filterTransactions(transactions, filters), [transactions, filters])
}
