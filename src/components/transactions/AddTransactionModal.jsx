"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useApp } from "@/context/AppContext"
import { CATEGORIES } from "@/data/transactions"
import { cn } from "@/lib/utils"
import { useState } from "react"

const EMPTY_FORM = {
  date: new Date().toISOString().slice(0, 10),
  description: "",
  category: "FOOD",
  type: "expense",
  amount: "",
  note: "",
}

export default function AddTransactionModal({ open, onClose }) {
  const { addTransaction } = useApp()
  const [form, setForm]     = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }))
    setErrors((e) => ({ ...e, [key]: "" }))
  }

  const validate = () => {
    const e = {}
    if (!form.description.trim())          e.description = "Description is required"
    if (!form.amount || +form.amount <= 0) e.amount      = "Enter a valid positive amount"
    if (!form.date)                        e.date        = "Date is required"
    const d = new Date(form.date)
    if (isNaN(d.getTime()))                e.date        = "Invalid date"
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    setTimeout(() => {
      addTransaction({ ...form, amount: Number(form.amount) })
      setForm(EMPTY_FORM)
      setErrors({})
      setLoading(false)
      onClose()
    }, 200)
  }

  const handleClose = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    onClose()
  }

  // Auto-set category type when type changes
  const handleTypeChange = (newType) => {
    set("type", newType)
    const defaultCat = newType === "income" ? "SALARY" : "FOOD"
    set("category", defaultCat)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>Record a new income or expense entry.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2">
            {["expense", "income"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTypeChange(t)}
                className={cn(
                  "py-2.5 rounded-xl text-sm font-semibold transition-all border-2",
                  form.type === t
                    ? t === "income"
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                      : "bg-rose-500 text-white border-rose-500 shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                {t === "income" ? "＋ Income" : "－ Expense"}
              </button>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="tx-desc">
              Description <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="tx-desc"
              placeholder="e.g. Grocery shopping at Shwapno"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className={errors.description ? "border-rose-300 focus-visible:ring-rose-300" : ""}
            />
            {errors.description && (
              <p className="text-xs text-rose-500">{errors.description}</p>
            )}
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tx-amount">
                Amount (৳) <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="tx-amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="0"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                className={cn("tabular-nums", errors.amount ? "border-rose-300 focus-visible:ring-rose-300" : "")}
              />
              {errors.amount && <p className="text-xs text-rose-500">{errors.amount}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tx-date">
                Date <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="tx-date"
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className={errors.date ? "border-rose-300 focus-visible:ring-rose-300" : ""}
              />
              {errors.date && <p className="text-xs text-rose-500">{errors.date}</p>}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => set("category", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORIES)
                  .filter(([, cat]) => cat.type === form.type)
                  .map(([key, cat]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span> {cat.label}
                      </span>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <Label htmlFor="tx-note">
              Note{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </Label>
            <Input
              id="tx-note"
              placeholder="Add a short note…"
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className={cn("flex-1", form.type === "income" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-900 hover:bg-slate-800")}
          >
            {loading ? "Adding…" : "Add Transaction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
