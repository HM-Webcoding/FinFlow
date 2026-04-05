"use client"
import { CATEGORIES } from "@/data/transactions"
import { formatDate } from "@/utils/format"
import { useCallback, useState } from "react"

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Escape a single CSV cell value — wraps in quotes if needed */
const escapeCSV = (value) => {
  if (value === null || value === undefined) return ""
  const str = String(value)
  // Quote if the value contains comma, double-quote, or newline
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/** Convert an array of objects to a RFC-4180 compliant CSV string */
const toCSV = (rows) => {
  if (!rows.length) return ""
  const headers = Object.keys(rows[0])
  const lines   = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => headers.map((h) => escapeCSV(row[h])).join(",")),
  ]
  return lines.join("\r\n")
}

/** Trigger a browser file download */
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement("a"), {
    href:     url,
    download: filename,
  })
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // Revoke after a short delay so the download has time to start
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

/** Build a filename like "finflow-transactions-2026-04-05" */
const buildFilename = (ext) => {
  const date = new Date().toISOString().slice(0, 10)
  return `finflow-transactions-${date}.${ext}`
}

/** Normalise a raw transaction object into a clean export row */
const normaliseRow = (txn) => ({
  id:          txn.id,
  date:        txn.date,
  date_label:  formatDate(txn.date),
  description: txn.description,
  category:    CATEGORIES[txn.category]?.label ?? txn.category,
  type:        txn.type,
  amount:      txn.amount,
  note:        txn.note ?? "",
})

// ── Hook ────────────────────────────────────────────────────────────────────

/**
 * useExport
 *
 * @param {Array} transactions — the (already filtered) list to export
 * @returns {{ exportCSV, exportJSON, exporting, lastExport }}
 */
export function useExport(transactions) {
  const [exporting,  setExporting]  = useState(false)   // brief loading feedback
  const [lastExport, setLastExport] = useState(null)     // { format, count, timestamp }

  const run = useCallback(
    async (format) => {
      if (!transactions.length) return
      setExporting(true)

      try {
        const rows     = transactions.map(normaliseRow)
        const filename = buildFilename(format)

        if (format === "csv") {
          downloadFile(toCSV(rows), filename, "text/csv;charset=utf-8;")
        } else {
          // Pretty-printed JSON with metadata envelope
          const payload = {
            meta: {
              exported_at:       new Date().toISOString(),
              total_records:     rows.length,
              total_income:      transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
              total_expense:     transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
            },
            transactions: rows,
          }
          downloadFile(JSON.stringify(payload, null, 2), filename, "application/json")
        }

        setLastExport({ format, count: rows.length, timestamp: Date.now() })
      } finally {
        // Small delay so the button state is visible even on fast machines
        setTimeout(() => setExporting(false), 400)
      }
    },
    [transactions]
  )

  const exportCSV  = useCallback(() => run("csv"),  [run])
  const exportJSON = useCallback(() => run("json"), [run])

  return { exportCSV, exportJSON, exporting, lastExport }
}