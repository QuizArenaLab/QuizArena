export default function SuperAdminMonitoringLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-gray-200 rounded-xl" />
        <div className="space-y-2">
          <div className="w-48 h-5 bg-gray-200 rounded" />
          <div className="w-32 h-3 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-1 flex gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 w-20 bg-gray-100 rounded-lg" />
        ))}
      </div>
      <div className="h-20 bg-gray-100 rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 bg-white rounded-xl border border-gray-100" />
        ))}
      </div>
    </div>
  );
}
