export function FiltersRegion() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Filters</h3>
      <p className="text-sm text-slate-400 mb-6">Explore historical and dimension leaderboards.</p>
      
      <div className="space-y-3">
        <button className="w-full text-left px-4 py-2 rounded-lg bg-blue-600 text-white font-medium">
          Global Leaderboard
        </button>
        <button className="w-full text-left px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
          Weekly Leaderboard
        </button>
        <button className="w-full text-left px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
          Monthly Leaderboard
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-800">
        <input 
          type="text" 
          placeholder="Search user..." 
          className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
    </div>
  );
}
