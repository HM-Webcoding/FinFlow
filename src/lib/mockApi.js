
import { INITIAL_TRANSACTIONS } from "@/data/transactions"
import { STORAGE_KEYS, storageGet, storageSet } from "./storage"

const CONFIG = {
  BASE_LATENCY_MS: 350,
  JITTER_MS: 150,
  WRITE_ERROR_RATE: 0.0,
}

const delay = () =>
  new Promise((resolve) =>
    setTimeout(resolve, CONFIG.BASE_LATENCY_MS + Math.random() * CONFIG.JITTER_MS)
  )

const ok    = (data)    => ({ ok: true,  data,  error: null  })
const fail  = (message) => ({ ok: false, data:  null, error: message })

/** Randomly simulate a server-side write error */
const maybeThrow = () => {
  if (CONFIG.WRITE_ERROR_RATE > 0 && Math.random() < CONFIG.WRITE_ERROR_RATE) {
    throw new Error("Internal server error (simulated)")
  }
}

// ── In-memory request queue (prevents concurrent writes corrupting state) ────

let _writeQueue = Promise.resolve()

const enqueue = (fn) => {
  _writeQueue = _writeQueue.then(fn).catch(() => {})
  return _writeQueue
}

// ── API ──────────────────────────────────────────────────────────────────────

/**
 * GET /transactions
 *
 * Loads from localStorage. Falls back to INITIAL_TRANSACTIONS on first run.
 * @returns {Promise<{ ok: boolean, data: Array|null, error: string|null }>}
 */
export const apiGetTransactions = async () => {
  await delay()
  try {
    const stored = storageGet(STORAGE_KEYS.TRANSACTIONS, null)
    // First-run: seed with mock data and persist
    if (stored === null) {
      storageSet(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS)
      return ok(INITIAL_TRANSACTIONS)
    }
    return ok(stored)
  } catch (err) {
    return fail(err.message ?? "Failed to load transactions")
  }
}

/**
 * POST /transactions
 *
 * Appends a new transaction.
 * @param {Object} data  Raw form data (amount is a string at this point)
 * @returns {Promise<{ ok: boolean, data: Object|null, error: string|null }>}
 */
export const apiCreateTransaction = async (data) => {
  return enqueue(async () => {
    await delay()
    try {
      maybeThrow()
      const current = storageGet(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS)
      const newTx = {
        ...data,
        id:     `txn_${Date.now()}`,
        amount: Number(data.amount),
      }
      storageSet(STORAGE_KEYS.TRANSACTIONS, [newTx, ...current])
      return ok(newTx)
    } catch (err) {
      return fail(err.message ?? "Failed to create transaction")
    }
  })
}

/**
 * PUT /transactions/:id
 *
 * Updates an existing transaction by id.
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<{ ok: boolean, data: Object|null, error: string|null }>}
 */
export const apiUpdateTransaction = async (id, data) => {
  return enqueue(async () => {
    await delay()
    try {
      maybeThrow()
      const current = storageGet(STORAGE_KEYS.TRANSACTIONS, [])
      const index   = current.findIndex((t) => t.id === id)
      if (index === -1) return fail(`Transaction ${id} not found`)
      const updated = { ...current[index], ...data, amount: Number(data.amount) }
      const next    = [...current]
      next[index]   = updated
      storageSet(STORAGE_KEYS.TRANSACTIONS, next)
      return ok(updated)
    } catch (err) {
      return fail(err.message ?? "Failed to update transaction")
    }
  })
}

/**
 * DELETE /transactions/:id
 *
 * Removes a transaction by id.
 * @param {string} id
 * @returns {Promise<{ ok: boolean, data: { id: string }|null, error: string|null }>}
 */
export const apiDeleteTransaction = async (id) => {
  return enqueue(async () => {
    await delay()
    try {
      maybeThrow()
      const current = storageGet(STORAGE_KEYS.TRANSACTIONS, [])
      const next    = current.filter((t) => t.id !== id)
      if (next.length === current.length) return fail(`Transaction ${id} not found`)
      storageSet(STORAGE_KEYS.TRANSACTIONS, next)
      return ok({ id })
    } catch (err) {
      return fail(err.message ?? "Failed to delete transaction")
    }
  })
}

/**
 * PUT /preferences
 *
 * Persists user preferences (theme, role) as a single atomic write.
 * @param {{ theme?: string, role?: string }} prefs
 * @returns {Promise<{ ok: boolean, data: Object|null, error: string|null }>}
 */
export const apiSavePreferences = async (prefs) => {
  await delay()
  try {
    if (prefs.theme !== undefined) storageSet(STORAGE_KEYS.THEME, prefs.theme)
    if (prefs.role  !== undefined) storageSet(STORAGE_KEYS.ROLE,  prefs.role)
    return ok(prefs)
  } catch (err) {
    return fail(err.message ?? "Failed to save preferences")
  }
}

/**
 * GET /preferences
 *
 * Reads persisted theme + role from localStorage.
 * @returns {Promise<{ ok: boolean, data: { theme: string, role: string }|null, error: string|null }>}
 */
export const apiGetPreferences = async () => {
  await delay()
  try {
    return ok({
      theme: storageGet(STORAGE_KEYS.THEME, "light"),
      role:  storageGet(STORAGE_KEYS.ROLE,  "viewer"),
    })
  } catch (err) {
    return fail(err.message ?? "Failed to load preferences")
  }
}

/**
 * DELETE /data  (dev helper)
 * @returns {Promise<{ ok: boolean, data: null, error: string|null }>}
 */
export const apiResetData = async () => {
  await delay()
  try {
    storageSet(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS)
    storageSet(STORAGE_KEYS.THEME, "light")
    storageSet(STORAGE_KEYS.ROLE,  "viewer")
    return ok(null)
  } catch (err) {
    return fail(err.message ?? "Failed to reset data")
  }
}