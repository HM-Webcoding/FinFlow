const STORAGE_PREFIX  = "finflow:"
const SCHEMA_VERSION  = 1

/**
 * Build a namespaced storage key.
 * @param {string} key
 * @returns {string}
 */
const ns = (key) => `${STORAGE_PREFIX}${key}`

/**
 * Check if localStorage is available (guards SSR / private-browsing quota errors).
 * @returns {boolean}
 */
const isAvailable = () => {
  if (typeof window === "undefined") return false
  try {
    const probe = "__finflow_probe__"
    localStorage.setItem(probe, "1")
    localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

export const storageGet = (key, fallback) => {
  if (!isAvailable()) return fallback
  try {
    const raw = localStorage.getItem(ns(key))
    if (raw === null) return fallback
    const parsed = JSON.parse(raw)
    // Discard if schema version mismatch
    if (parsed?.__v !== SCHEMA_VERSION) return fallback
    return parsed.data ?? fallback
  } catch {
    return fallback
  }
}

export const storageSet = (key, value) => {
  if (!isAvailable()) return
  try {
    localStorage.setItem(ns(key), JSON.stringify({ __v: SCHEMA_VERSION, data: value }))
  } catch {
    // QuotaExceededError — fail silently; the app still works without persistence
  }
}

export const storageRemove = (key) => {
  if (!isAvailable()) return
  try {
    localStorage.removeItem(ns(key))
  } catch { /* noop */ }
}

/**
 * Clear every key belonging to this app (keys prefixed with STORAGE_PREFIX).
 */
export const storageClear = () => {
  if (!isAvailable()) return
  try {
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k?.startsWith(STORAGE_PREFIX)) keysToRemove.push(k)
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k))
  } catch { /* noop */ }
}

// ── Named keys ───────────────────────────────────────────────────────────────
// Centralise key names so typos are caught at import time.

export const STORAGE_KEYS = {
  TRANSACTIONS: "transactions",
  THEME:        "theme",
  ROLE:         "role",
}