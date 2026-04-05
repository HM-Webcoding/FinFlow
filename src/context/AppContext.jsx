"use client"
import {
  apiCreateTransaction,
  apiDeleteTransaction,
  apiGetPreferences,
  apiGetTransactions,
  apiResetData,
  apiSavePreferences,
  apiUpdateTransaction,
} from "@/lib/mockApi"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

// ── Constants ────────────────────────────────────────────────────────────────

export const DEFAULT_FILTERS = {
  type:      "all",
  category:  "all",
  search:    "",
  sortBy:    "date",
  sortDir:   "desc",
  dateFrom:  "",
  dateTo:    "",
  amountMin: "",
  amountMax: "",
}

// ── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext(null)

// ── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }) {

  // ── Remote / persistence state ──────────────────
  const [transactions,  setTransactions]  = useState([])
  const [theme, setThemeState] = useState("light")
  const [role, setRoleState] = useState("viewer")

  // ── API lifecycle state ─────────────────────────
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(null)
  const [mutating, setMutating] = useState(false)

  // ── UI-only state (not persisted) ───────────────
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  // Guard against React StrictMode double-invoke
  const initRef = useRef(false)

  // ── Derived ─────────────────────────────────────
  const isAdmin  = role === "admin"
  const isViewer = role === "viewer"
  const isDark   = theme === "dark"

  const hasActiveFilters = useMemo(
    () => Object.entries(filters).some(([k, v]) => DEFAULT_FILTERS[k] !== v),
    [filters]
  )

  // ── Apply theme class to <html> ──────────────────
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  // ════════════════════════════════════════════════
  //  BOOT — load persisted data on mount
  // ════════════════════════════════════════════════
  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    const boot = async () => {
      setLoading(true)
      setApiError(null)
      try {
        // Fire both requests in parallel — mirrors a real API
        const [txResult, prefResult] = await Promise.all([
          apiGetTransactions(),
          apiGetPreferences(),
        ])

        if (txResult.ok) {
          setTransactions(txResult.data)
        } else {
          setApiError(txResult.error)
        }

        if (prefResult.ok) {
          setThemeState(prefResult.data.theme)
          setRoleState(prefResult.data.role)
        }
      } catch (err) {
        setApiError("Unexpected error loading data.")
      } finally {
        setLoading(false)
      }
    }

    boot()
  }, [])

  // ════════════════════════════════════════════════
  //  THEME
  // ════════════════════════════════════════════════
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "light" ? "dark" : "light"
      // Optimistic — UI updates immediately, persistence is async
      apiSavePreferences({ theme: next })
      return next
    })
  }, [])

  // ════════════════════════════════════════════════
  //  ROLE
  // ════════════════════════════════════════════════
  const setRole = useCallback((next) => {
    setRoleState(next)
    apiSavePreferences({ role: next })
  }, [])

  // ════════════════════════════════════════════════
  //  TRANSACTIONS — CRUD (all optimistic with rollback)
  // ════════════════════════════════════════════════

  /**
   * Add a new transaction.
   * Optimistic update → persist → replace optimistic with real id.
   * On failure the optimistic item is rolled back.
   */
  const addTransaction = useCallback(async (data) => {
    const optimisticId = `txn_opt_${Date.now()}`
    const optimistic   = { ...data, id: optimisticId, amount: Number(data.amount) }

    setTransactions((prev) => [optimistic, ...prev])
    setMutating(true)
    setApiError(null)

    const result = await apiCreateTransaction(data)

    if (result.ok) {
      // Swap optimistic record for the persisted one (has stable id)
      setTransactions((prev) =>
        prev.map((t) => (t.id === optimisticId ? result.data : t))
      )
    } else {
      setTransactions((prev) => prev.filter((t) => t.id !== optimisticId))
      setApiError(result.error)
    }

    setMutating(false)
    return result
  }, [])

  /**
   * Update an existing transaction.
   * Optimistic update → persist → apply server response.
   * On failure restores previous value.
   */
  const updateTransaction = useCallback(async (id, data) => {
    let prevSnapshot = null

    setTransactions((prev) => {
      prevSnapshot = prev.find((t) => t.id === id)
      return prev.map((t) =>
        t.id === id ? { ...t, ...data, amount: Number(data.amount) } : t
      )
    })
    setMutating(true)
    setApiError(null)

    const result = await apiUpdateTransaction(id, data)

    if (result.ok) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? result.data : t))
      )
    } else {
      if (prevSnapshot) {
        setTransactions((prev) =>
          prev.map((t) => (t.id === id ? prevSnapshot : t))
        )
      }
      setApiError(result.error)
    }

    setMutating(false)
    return result
  }, [])

  /**
   * Delete a transaction.
   * Optimistic removal → persist.
   * On failure restores the removed item at the top of the list.
   */
  const deleteTransaction = useCallback(async (id) => {
    let snapshot = null

    setTransactions((prev) => {
      snapshot = prev.find((t) => t.id === id)
      return prev.filter((t) => t.id !== id)
    })
    setMutating(true)
    setApiError(null)

    const result = await apiDeleteTransaction(id)

    if (!result.ok) {
      if (snapshot) setTransactions((prev) => [snapshot, ...prev])
      setApiError(result.error)
    }

    setMutating(false)
    return result
  }, [])

  // ════════════════════════════════════════════════
  //  RESET — wipes localStorage and reseeds demo data
  // ════════════════════════════════════════════════
  const resetToDemo = useCallback(async () => {
    setLoading(true)
    setApiError(null)

    const result = await apiResetData()

    if (result.ok) {
      const [txResult, prefResult] = await Promise.all([
        apiGetTransactions(),
        apiGetPreferences(),
      ])
      if (txResult.ok)   setTransactions(txResult.data)
      if (prefResult.ok) {
        setThemeState(prefResult.data.theme)
        setRoleState(prefResult.data.role)
      }
    } else {
      setApiError(result.error)
    }

    setLoading(false)
  }, [])

  // ════════════════════════════════════════════════
  //  FILTERS
  // ════════════════════════════════════════════════
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters   = useCallback(() => setFilters(DEFAULT_FILTERS), [])
  const clearApiError  = useCallback(() => setApiError(null), [])

  // ── Context value ────────────────────────────────
  const value = {
    // theme
    theme, isDark, toggleTheme,
    // role
    role, isAdmin, isViewer, setRole,
    // data
    transactions,
    // API lifecycle
    loading, mutating, apiError, clearApiError,
    // CRUD
    addTransaction, updateTransaction, deleteTransaction,
    // dev / demo
    resetToDemo,
    // filters
    filters, hasActiveFilters, updateFilter, resetFilters,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}