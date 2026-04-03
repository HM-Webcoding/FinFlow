"use client"
import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react"
import { INITIAL_TRANSACTIONS } from "@/data/transactions"

const AppContext = createContext(null)

export const DEFAULT_FILTERS = {
  type: "all",
  category: "all",
  search: "",
  sortBy: "date",
  sortDir: "desc",
  dateFrom: "",
  dateTo: "",
  amountMin: "",
  amountMax: "",
}

export function AppProvider({ children }) {
  // ── Theme ─────────────────────────────────────
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"))
  }, [])

  // ── Role ──────────────────────────────────────
  const [role, setRole] = useState("viewer")

  // ── Transactions ──────────────────────────────
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS)

  // ── Filters ───────────────────────────────────
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  // ── UI state ──────────────────────────────────
  const [activeTab, setActiveTab] = useState("dashboard")

  // ── Derived ───────────────────────────────────
  const isAdmin = role === "admin"
  const isViewer = role === "viewer"

  // ── Actions ───────────────────────────────────
  const addTransaction = useCallback((data) => {
    const newTx = {
      ...data,
      id: `txn_${Date.now()}`,
      amount: Number(data.amount),
    }
    setTransactions((prev) => [newTx, ...prev])
    return newTx
  }, [])

  const updateTransaction = useCallback((id, data) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data, amount: Number(data.amount) } : t))
    )
  }, [])

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([k, v]) => DEFAULT_FILTERS[k] !== v)
  }, [filters])

  const value = {
    // theme
    theme, toggleTheme,
    // state
    role, isAdmin, isViewer,
    transactions,
    filters, hasActiveFilters,
    activeTab,
    // setters
    setRole,
    setActiveTab,
    // actions
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateFilter,
    resetFilters,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
