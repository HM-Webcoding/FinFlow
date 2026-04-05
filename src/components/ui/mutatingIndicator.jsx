import { Loader2 } from "lucide-react";

export default function MutatingDot() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Loader2 className="w-3 h-3 animate-spin" />
      <span className="hidden sm:inline">Saving…</span>
    </div>
  )
}