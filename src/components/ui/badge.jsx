// Badge
import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:     "border-transparent bg-slate-900 text-white",
        secondary:   "border-transparent bg-slate-100 text-slate-700",
        outline:     "text-foreground border-slate-200",
        income:      "border-transparent bg-emerald-100 text-emerald-700",
        expense:     "border-transparent bg-rose-100 text-rose-700",
        info:        "border-transparent bg-blue-100 text-blue-700",
        warning:     "border-transparent bg-amber-100 text-amber-700",
        success:     "border-transparent bg-emerald-100 text-emerald-700",
        admin:       "border-transparent bg-amber-100 text-amber-700",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
export { badgeVariants }
