export default function ApiErrorBanner({ message, onDismiss }) {
  return (
    <div className="mx-4 sm:mx-6 mt-4 flex items-start gap-3 px-4 py-3 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      <p className="text-sm flex-1 font-medium">{message}</p>
      <button
        onClick={onDismiss}
        className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-200 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}