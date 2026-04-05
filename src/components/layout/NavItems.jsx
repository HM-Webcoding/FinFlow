import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export default function NavItems({ NAV_ITEMS, currentTab, onChange, setSidebarOpen }) {
  return (
    <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-2">
          {NAV_ITEMS.map(({ id, label, icon: Icon, description }) => {
            const active = currentTab === id
            return (
              <button
                key={id}
                onClick={() => { onChange(id); setSidebarOpen(false) }}
                className={cn("sidebar-link w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left", active && "active")}
              >
                <div className="sidebar-icon w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                  <Icon
                    className="w-4 h-4"
                    style={{ color: active ? "hsl(var(--sidebar-active-fg))" : "hsl(var(--sidebar-fg))" }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-none mb-0.5"
                    style={{ color: active ? "hsl(var(--sidebar-active-fg))" : "hsl(var(--sidebar-fg))" }}>
                    {label}
                  </p>
                  <p className="text-xs truncate"
                    style={{ color: active ? "hsl(var(--sidebar-active-fg) / 0.65)" : "hsl(var(--sidebar-muted))" }}>
                    {description}
                  </p>
                </div>
                {active && (
                  <ChevronRight className="w-3.5 h-3.5 shrink-0"
                    style={{ color: "hsl(var(--sidebar-active-fg) / 0.6)" }} />
                )}
              </button>
            )
          })}
    </nav>
  )
}

