export default function PracticeArenaLoading() {
  return (
    <div className="min-h-screen bg-gray-50 -m-6 sm:-m-8 p-6 sm:p-8 space-y-8">
      
      {/* SECTION 1 - PRACTICE SESSION HERO SKELETON */}
      <section className="relative rounded-2xl overflow-hidden bg-gray-900 shadow-lg flex flex-col justify-center py-8 md:py-12 px-8 md:px-12 border border-gray-800 animate-pulse">
        <div className="relative z-10 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="w-32 h-6 bg-gray-800 rounded-md mb-6"></div>
            <div className="w-3/4 max-w-md h-10 bg-gray-800 rounded-lg mb-4"></div>
            <div className="w-5/6 max-w-md h-6 bg-gray-800 rounded-md mb-8"></div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 mb-8">
              <div className="flex gap-4 mb-3">
                <div className="w-24 h-6 bg-gray-700 rounded-md"></div>
                <div className="w-20 h-6 bg-gray-700 rounded-md"></div>
              </div>
              <div className="w-3/4 h-8 bg-gray-700 rounded-lg mb-4"></div>
              <div className="flex gap-5">
                <div className="w-24 h-5 bg-gray-700 rounded-md"></div>
                <div className="w-24 h-5 bg-gray-700 rounded-md"></div>
                <div className="w-24 h-5 bg-gray-700 rounded-md"></div>
              </div>
            </div>

            <div className="w-48 h-12 bg-gray-800 rounded-xl"></div>
          </div>
          
          <div className="hidden lg:flex flex-col justify-center items-end">
             <div className="w-64 h-64 border-16 border-gray-800 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* TWO COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SECTION 2 - PERFORMANCE COMPASS SKELETON */}
          <section className="animate-pulse">
            <div className="w-48 h-5 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="w-32 h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="w-16 h-8 bg-gray-200 rounded mt-1"></div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 3 - TODAY'S TRAINING PLAN SKELETON */}
          <section className="animate-pulse">
            <div className="w-48 h-5 bg-gray-200 rounded mb-4"></div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100"></div>
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="relative flex items-center gap-6">
                    <div className="w-8 h-8 rounded-full bg-gray-200 relative z-10 shrink-0"></div>
                    <div className="flex-1 bg-gray-50 border border-gray-100 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <div className="w-24 h-3 bg-gray-200 rounded mb-2"></div>
                        <div className="w-32 h-5 bg-gray-200 rounded"></div>
                      </div>
                      <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 5 - RECENT TRAINING SESSIONS SKELETON */}
          <section className="animate-pulse">
            <div className="w-40 h-5 bg-gray-200 rounded mb-4"></div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-4">
                    <div className="flex-1">
                      <div className="w-48 h-5 bg-gray-200 rounded mb-2"></div>
                      <div className="flex gap-4">
                        <div className="w-20 h-4 bg-gray-200 rounded"></div>
                        <div className="w-24 h-4 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="w-20 h-6 bg-gray-200 rounded-md hidden sm:block"></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* SECTION 6 - PREPARATION COACH SKELETON */}
          <section className="animate-pulse">
            <div className="w-48 h-5 bg-gray-200 rounded mb-4"></div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-48">
               <div className="w-24 h-4 bg-gray-200 rounded mb-3"></div>
               <div className="w-3/4 h-6 bg-gray-200 rounded mb-4"></div>
               <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
               <div className="w-5/6 h-4 bg-gray-200 rounded mb-6"></div>
               <div className="w-32 h-8 bg-gray-200 rounded-lg"></div>
            </div>
          </section>

          {/* SECTION 4 - SESSION PROGRESS SKELETON */}
          <section className="animate-pulse">
            <div className="w-40 h-5 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
                   <div className="w-20 h-3 bg-gray-200 rounded mx-auto mb-3"></div>
                   <div className="w-12 h-8 bg-gray-200 rounded mx-auto"></div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div>
                     <div className="w-20 h-3 bg-gray-200 rounded mb-1"></div>
                     <div className="w-16 h-5 bg-gray-200 rounded"></div>
                  </div>
               </div>
               <div className="text-right">
                  <div className="w-16 h-3 bg-gray-200 rounded ml-auto mb-1"></div>
                  <div className="w-16 h-5 bg-gray-200 rounded ml-auto"></div>
               </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
