import { cn } from "@/lib/utils"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"

export default function SortButton({ field, label, sortBy, sortDir, onClick }) {
  const active = sortBy === field
  const Icon   = !active ? ArrowUpDown : sortDir === "desc" ? ArrowDown : ArrowUp
  return (
    <button
      onClick={() => onClick(field)}
      className={cn(
        "flex items-center gap-1 text-xs font-semibold uppercase tracking-wider select-none transition-colors",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
      <Icon className={cn("w-3 h-3", active ? "opacity-100" : "opacity-40")} />
    </button>
  )
}