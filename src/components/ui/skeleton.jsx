
function PageSkeleton() {
  return (
    <div className="p-4 sm:p-6 space-y-4 animate-pulse">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-muted/60" />
        ))}
      </div>
      {/* Chart */}
      <div className="h-64 rounded-xl bg-muted/60" />
      {/* Two cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-48 rounded-xl bg-muted/60" />
        <div className="h-48 rounded-xl bg-muted/60" />
      </div>
    </div>
  )
}

export { PageSkeleton }
