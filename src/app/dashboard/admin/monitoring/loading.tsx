export default function AdminMonitoringLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-gray-200 rounded-xl" />
        <div className="space-y-2">
          <div className="w-48 h-5 bg-gray-200 rounded" />
          <div className="w-32 h-3 bg-gray-100 rounded" />
        </div>
      </div>

      {/* Tab Bar Skeleton */}
      <div className="bg-white rounded-xl border border-gray-100 p-1 flex gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 w-20 bg-gray-100 rounded-lg" />
        ))}
      </div>

      {/* Status Banner Skeleton */}
      <div className="h-20 bg-gray-100 rounded-xl" />

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg" />
              <div className="w-12 h-6 bg-gray-100 rounded" />
            </div>
            <div className="w-24 h-4 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Bottom Section Skeleton */}
      <div className="h-32 bg-white rounded-xl border border-gray-100" />
    </div>
  );
}
