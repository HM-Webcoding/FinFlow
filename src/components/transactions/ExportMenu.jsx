import { useExport } from "@/hooks/useExport"
import { cn } from "@/lib/utils"
import { CheckCircle2, ChevronDown, Download, FileJsonIcon, FileText, Loader2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"

export default function ExportMenu({ transactions }) {
  const { exportCSV, exportJSON, exporting, lastExport } = useExport(transactions)
  const [open, setOpen]   = useState(false)
  const containerRef      = useRef(null)
  const justExported      = lastExport && Date.now() - lastExport.timestamp < 3000

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open])

  const handleExport = (fn) => {
    fn()
    // Close menu after a short delay so user sees the loading state
    setTimeout(() => setOpen(false), 500)
  }

  const disabled = transactions.length === 0

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        className={cn(
          "gap-1.5 shrink-0 transition-all",
          justExported && "border-emerald-400 text-emerald-600 dark:text-emerald-400"
        )}
        title={disabled ? "No transactions to export" : "Export transactions"}
      >
        {exporting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : justExported ? (
          <CheckCircle2 className="w-3.5 h-3.5" />
        ) : (
          <Download className="w-3.5 h-3.5" />
        )}
        Export
        <ChevronDown className={cn("w-3 h-3 transition-transform duration-150", open && "rotate-180")} />
      </Button>

      {/* Dropdown panel */}
      {open && (
        <div
          className={cn(
            "absolute right-0 top-full mt-1.5 z-50 w-56",
            "bg-card border border-border rounded-xl shadow-modal",
            "animate-in fade-in-0 zoom-in-95 duration-100 origin-top-right"
          )}
        >
          {/* Header */}
          <div className="px-3 pt-3 pb-2 border-b border-border">
            <p className="text-xs font-semibold text-foreground">Export transactions</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {transactions.length} record{transactions.length !== 1 ? "s" : ""} will be exported
            </p>
          </div>

          {/* Options */}
          <div className="p-1.5 space-y-0.5">
            {/* CSV */}
            <button
              onClick={() => handleExport(exportCSV)}
              disabled={exporting}
              className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground leading-none mb-1">CSV</p>
                <p className="text-xs text-muted-foreground leading-snug">
                  Spreadsheet-compatible. Open in Excel, Google Sheets, Numbers.
                </p>
              </div>
            </button>

            {/* JSON */}
            <button
              onClick={() => handleExport(exportJSON)}
              disabled={exporting}
              className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                <FileJsonIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground leading-none mb-1">JSON</p>
                <p className="text-xs text-muted-foreground leading-snug">
                  With metadata envelope. Useful for APIs and developer tooling.
                </p>
              </div>
            </button>
          </div>

          {/* Footer note */}
          <div className="px-3 pb-3 pt-1 border-t border-border mt-1">
            <p className="text-xs text-muted-foreground">
              {lastExport
                ? `Last export: ${lastExport.count} records as .${lastExport.format}`
                : "Exports the current filtered view"
              }
            </p>
          </div>
        </div>
      )}
    </div>
  )
}