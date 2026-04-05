"use client"
import Dashboard from "@/components/dashboard/Dashboard"
import Insights from "@/components/insights/Insights"
import Transactions from "@/components/transactions/Transactions"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/context/AppContext"
import {
  Menu,
  Moon,
  ShieldCheck,
  Sun
} from "lucide-react"
import { useState } from "react"
import ApiErrorBanner from "../ui/apiErrorBanner"
import MutatingDot from "../ui/mutatingIndicator"
import { PageSkeleton } from "../ui/skeleton"
import Sidebar from "./Sidebar"

const PAGE_TITLES = {
  dashboard:    { title: "Dashboard",    sub: "Your financial overview"      },
  transactions: { title: "Transactions", sub: "All your income & expenses"   },
  insights:     { title: "Insights",     sub: "Smart financial observations" },
}

export default function DashboardShell() {
  const {
    isAdmin, isDark, toggleTheme, loading, mutating, apiError, clearApiError,
  } = useApp()

  const [tab, setTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const page = PAGE_TITLES[tab]

  return (
    <div className="flex h-dvh" style={{ background: "hsl(var(--page-bg))" }}>

      {/* ── Mobile overlay ─────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══════════════ SIDEBAR ══════════════════════ */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentTab={tab} onChange={setTab} />
      
      {/* ══════════════ MAIN AREA ════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top header */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 sm:px-6 border-b"
          style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-base leading-none"
                style={{ fontFamily: "'Syne', sans-serif", color: "hsl(var(--foreground))" }}>
                {page.title}
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                {page.sub}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Saving indicator */}
            {mutating && <MutatingDot />}

            {/* Theme button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all hover:bg-muted"
              style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}
            >
              {isDark
                ? <><Sun  className="w-3.5 h-3.5 text-amber-500" /><span className="hidden sm:inline">Light</span></>
                : <><Moon className="w-3.5 h-3.5 text-indigo-500" /><span className="hidden sm:inline">Dark</span></>
              }
            </button>

            {isAdmin && (
              <Badge variant="admin" className="gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span className="hidden sm:inline">Admin</span>
              </Badge>
            )}
          </div>
        </header>

        {/* API error banner */}
        {apiError && (
          <ApiErrorBanner message={apiError} onDismiss={clearApiError} />
        )}

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {loading ? (
            <PageSkeleton />
          ) : (
            <div className="p-4 sm:p-6">
              {tab === "dashboard"    && <Dashboard    key="dashboard"    />}
              {tab === "transactions" && <Transactions key="transactions" />}
              {tab === "insights"     && <Insights     key="insights"     />}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}