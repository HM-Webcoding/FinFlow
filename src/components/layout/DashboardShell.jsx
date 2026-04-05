"use client"
import Dashboard from "@/components/dashboard/Dashboard"
import Insights from "@/components/insights/Insights"
import Transactions from "@/components/transactions/Transactions"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useApp } from "@/context/AppContext"
import { cn } from "@/lib/utils"
import {
  ArrowLeftRight,
  ChevronRight,
  Eye,
  LayoutDashboard,
  Lightbulb,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  TrendingUp,
  X,
} from "lucide-react"
import { useState } from "react"

const NAV_ITEMS = [
  { id: "dashboard",    label: "Dashboard",    icon: LayoutDashboard, description: "Overview & charts"  },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight,  description: "All transactions"   },
  { id: "insights",     label: "Insights",     icon: Lightbulb,       description: "Analytics & trends" },
]

const PAGE_TITLES = {
  dashboard:    { title: "Dashboard",    sub: "Your financial overview"       },
  transactions: { title: "Transactions", sub: "All your income & expenses"    },
  insights:     { title: "Insights",     sub: "Smart financial observations"  },
}

export default function DashboardShell() {
  const { role, setRole, isAdmin, theme, toggleTheme } = useApp()
  const [tab,         setTab]         = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isDark = theme === "dark"
  const page   = PAGE_TITLES[tab]

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
      <aside
        className={cn(
          "sidebar fixed top-0 left-0 z-40 flex flex-col h-dvh",
          "w-64 transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:static lg:z-auto lg:shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >

        {/* ── Brand header ──────────────────────────── */}
        <div
          className="flex items-center justify-between px-5 h-16 border-b"
          style={{ borderColor: "hsl(var(--sidebar-border))" }} 
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-sm shrink-0">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span
              className="font-bold text-lg"
              style={{ fontFamily: "'Syne', sans-serif", color: "hsl(var(--sidebar-fg))" }}
            >
              FinFlow
            </span>
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-md transition-colors sidebar-theme-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Nav section label ─────────────────────── */}
        <div className="px-5 pt-5 pb-2">
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "hsl(var(--sidebar-muted))" }}
          >
            Navigation
          </p>
        </div>

        {/* ── Nav items ─────────────────────────────── */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-2">
          {NAV_ITEMS.map(({ id, label, icon: Icon, description }) => {
            const active = tab === id
            return (
              <button
                key={id}
                onClick={() => { setTab(id); setSidebarOpen(false) }}
                className={cn(
                  "sidebar-link w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left",
                  active && "active"
                )}
              >
                {/* Icon box */}
                <div className="sidebar-icon w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                  <Icon
                    className="w-4 h-4"
                    style={{ color: active ? "hsl(var(--sidebar-active-fg))" : "hsl(var(--sidebar-fg))" }}
                  />
                </div>

                {/* Label */}
                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm font-medium leading-none mb-0.5"
                    style={{ color: active ? "hsl(var(--sidebar-active-fg))" : "hsl(var(--sidebar-fg))" }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-xs truncate"
                    style={{ color: active ? "hsl(var(--sidebar-active-fg) / 0.65)" : "hsl(var(--sidebar-muted))" }}
                  >
                    {description}
                  </p>
                </div>

                {/* Active chevron */}
                {active && (
                  <ChevronRight
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: "hsl(var(--sidebar-active-fg) / 0.6)" }}
                  />
                )}
              </button>
            )
          })}
        </nav>

        {/* ── Bottom panel ──────────────────────────── */}
        <div
          className="p-4 border-t space-y-2.5"
          style={{ borderColor: "hsl(var(--sidebar-border))" }}
        >

          {/* Role switcher */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2 px-1"
              style={{ color: "hsl(var(--sidebar-muted))" }}
            >
              Access Role
            </p>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger
                className="w-full h-9 text-sm border focus:ring-1 focus:ring-offset-0"
                style={{
                  background:   "hsl(var(--sidebar-hover))",
                  borderColor:  "hsl(var(--sidebar-border))",
                  color:        "hsl(var(--sidebar-fg))",
                }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">
                  <span className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-slate-400" /> Viewer
                  </span>
                </SelectItem>
                <SelectItem value="admin">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Admin
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Theme toggle row */}
          <button
            onClick={toggleTheme}
            className="sidebar-theme-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl"
          >
            {/* Icon */}
            <div className="sidebar-icon w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
              {isDark
                ? <Sun  className="w-4 h-4 text-amber-400" />
                : <Moon className="w-4 h-4 text-indigo-500" />
              }
            </div>

            {/* Text */}
            <div className="flex-1 text-left">
              <p
                className="text-sm font-medium leading-none mb-0.5"
                style={{ color: "hsl(var(--sidebar-fg))" }}
              >
                {isDark ? "Light mode" : "Dark mode"}
              </p>
              <p className="text-xs" style={{ color: "hsl(var(--sidebar-muted))" }}>
                {isDark ? "Switch to light" : "Switch to dark"}
              </p>
            </div>

            {/* Animated toggle pill */}
            <div
              className={cn(
                "w-9 h-5 rounded-full flex items-center px-0.5 transition-colors duration-300",
                isDark ? "bg-blue-500" : "bg-slate-300"
              )}
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300",
                  isDark ? "translate-x-4" : "translate-x-0"
                )}
              />
            </div>
          </button>

          {/* User profile row */}
          <div className="sidebar-user flex items-center gap-2.5 px-3 py-2.5 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">HR</span>
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-xs font-semibold truncate leading-none mb-0.5"
                style={{ color: "hsl(var(--sidebar-fg))" }}
              >
                Hamidur Rashid
              </p>
              <p className="text-xs truncate" style={{ color: "hsl(var(--sidebar-muted))" }}>
                {isAdmin ? "Administrator" : "Viewer"}
              </p>
            </div>
            {isAdmin && (
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            )}
          </div>
        </div>
      </aside>

      {/* ══════════════ MAIN AREA ════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── Top header ────────────────────────────── */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 sm:px-6 border-b"
          style={{
            background:  "hsl(var(--background))",
            borderColor: "hsl(var(--border))",
          }}
        >
          {/* Left: hamburger (mobile) + page title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1
                className="font-bold text-base leading-none"
                style={{ fontFamily: "'Syne', sans-serif", color: "hsl(var(--foreground))" }}
              >
                {page.title}
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                {page.sub}
              </p>
            </div>
          </div>

          {/* Right: compact theme button + admin badge */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all hover:bg-muted"
              style={{
                borderColor: "hsl(var(--border))",
                color:       "hsl(var(--muted-foreground))",
              }}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
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

        {/* ── Page content ──────────────────────────── */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {tab === "dashboard"    && <Dashboard    key="dashboard"    />}
          {tab === "transactions" && <Transactions key="transactions" />}
          {tab === "insights"     && <Insights     key="insights"     />}
        </main>
      </div>
    </div>
  )
}
