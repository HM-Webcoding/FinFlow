import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useApp } from "@/context/AppContext"
import { cn } from "@/lib/utils"
import {
    ArrowLeftRight,
    Eye,
    LayoutDashboard,
    Lightbulb,
    Loader2,
    Moon,
    RotateCcw,
    ShieldCheck,
    Sun,
    TrendingUp,
    X
} from "lucide-react"
import { useState } from "react"
import NavItems from "./NavItems"
const NAV_ITEMS = [
  { id: "dashboard",    label: "Dashboard",    icon: LayoutDashboard, description: "Overview & charts"  },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight,  description: "All transactions"   },
  { id: "insights",     label: "Insights",     icon: Lightbulb,       description: "Analytics & trends" },
]

export default function Sidebar({ sidebarOpen, setSidebarOpen, currentTab, onChange }) {
    const [resetting, setResetting] = useState(false)
    const {
        role, setRole, isAdmin,
         isDark, toggleTheme,
        loading, resetToDemo,
      } = useApp()


    const handleReset = async () => {
    if (!confirm("Reset all data to demo transactions? This cannot be undone.")) return
    setResetting(true)
    await resetToDemo()
    setResetting(false)
  }

    return (
         <aside
        className={cn(
          "sidebar fixed top-0 left-0 h-dvh z-40 flex flex-col",
          "w-64 transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:static lg:z-auto lg:shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
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
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-md transition-colors sidebar-theme-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav section label */}
        <div className="px-5 pt-5 pb-2">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "hsl(var(--sidebar-muted))" }}>
            Navigation
          </p>
        </div>

        {/* Nav items */}
        <NavItems NAV_ITEMS={NAV_ITEMS} currentTab={currentTab} onChange={onChange} setSidebarOpen={setSidebarOpen} />
        {/* Bottom panel */}
        <div className="p-4 border-t space-y-2.5" style={{ borderColor: "hsl(var(--sidebar-border))" }}>

          {/* Role switcher */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2 px-1"
              style={{ color: "hsl(var(--sidebar-muted))" }}>
              Access Role
            </p>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger
                className="w-full h-9 text-sm border focus:ring-1 focus:ring-offset-0"
                style={{ background: "hsl(var(--sidebar-hover))", borderColor: "hsl(var(--sidebar-border))", color: "hsl(var(--sidebar-fg))" }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">
                  <span className="flex items-center gap-2"><Eye className="w-3.5 h-3.5 text-slate-400" /> Viewer</span>
                </SelectItem>
                <SelectItem value="admin">
                  <span className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Admin</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="sidebar-theme-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl"
          >
            <div className="sidebar-icon w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
              {isDark
                ? <Sun  className="w-4 h-4 text-amber-400" />
                : <Moon className="w-4 h-4 text-indigo-500" />
              }
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium leading-none mb-0.5" style={{ color: "hsl(var(--sidebar-fg))" }}>
                {isDark ? "Light mode" : "Dark mode"}
              </p>
              <p className="text-xs" style={{ color: "hsl(var(--sidebar-muted))" }}>
                {isDark ? "Switch to light" : "Switch to dark"}
              </p>
            </div>
            <div className={cn("w-9 h-5 rounded-full flex items-center px-0.5 transition-colors duration-300", isDark ? "bg-blue-500" : "bg-slate-300")}>
              <div className={cn("w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300", isDark ? "translate-x-4" : "translate-x-0")} />
            </div>
          </button>

          {/* Reset to demo data */}
          {
            isAdmin && (
                <button
            onClick={handleReset}
            disabled={resetting || loading}
            className="sidebar-theme-btn w-full flex items-center gap-3 px-3 py-2 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <div className="sidebar-icon w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
              {resetting
                ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: "hsl(var(--sidebar-muted))" }} />
                : <RotateCcw className="w-4 h-4" style={{ color: "hsl(var(--sidebar-muted))" }} />
              }
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium leading-none mb-0.5" style={{ color: "hsl(var(--sidebar-fg))" }}>
                Reset demo data
              </p>
              <p className="text-xs" style={{ color: "hsl(var(--sidebar-muted))" }}>
                Restore original transactions
              </p>
            </div>
          </button>
        )
        }
          

          {/* User profile */}
          <div className="sidebar-user flex items-center gap-2.5 px-3 py-2.5 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">HR</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate leading-none mb-0.5" style={{ color: "hsl(var(--sidebar-fg))" }}>
                Hamidur Rashid
              </p>
              <p className="text-xs truncate" style={{ color: "hsl(var(--sidebar-muted))" }}>
                {isAdmin ? "Administrator" : "Viewer"}
              </p>
            </div>
            {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
          </div>
        </div>
      </aside>
    )
}