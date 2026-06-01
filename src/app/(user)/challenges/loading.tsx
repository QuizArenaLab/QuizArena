export default function ChallengesLoading() {
  return (
    <div className="min-h-screen bg-gray-50 -m-6 sm:-m-8 p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-9 space-y-12 animate-pulse">
          
          {/* SECTION 1 - HERO SKELETON */}
          <section className="relative rounded-[24px] overflow-hidden bg-[#151828] flex flex-col justify-between border border-gray-800">
        <div className="relative z-10 w-full p-8 md:px-10 md:pt-10 md:pb-8 flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="flex-1 w-full space-y-6">
            <div>
               <div className="w-3/4 max-w-sm h-10 md:h-12 bg-gray-800/80 rounded-lg mb-4"></div>
               <div className="w-48 h-5 bg-gray-800/80 rounded-md"></div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="w-32 h-6 bg-gray-800/80 rounded-md"></div>
              <div>
                 <div className="w-2/3 max-w-md h-8 md:h-10 bg-gray-800/80 rounded-lg mb-4"></div>
                 <div className="flex flex-wrap gap-4">
                    <div className="w-16 h-6 bg-gray-800/80 rounded"></div>
                    <div className="w-20 h-6 bg-gray-800/80 rounded"></div>
                    <div className="w-24 h-6 bg-gray-800/80 rounded"></div>
                    <div className="w-24 h-6 bg-gray-800/80 rounded"></div>
                 </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <div className="w-48 h-12 bg-gray-800/80 rounded-xl"></div>
              <div className="w-32 h-12 bg-gray-800/80 rounded-xl"></div>
            </div>
          </div>
        </div>

        {/* Hero Footer Status Strip Skeleton */}
        <div className="relative z-10 w-full bg-black/30 border-t border-white/5 px-8 py-4">
           <div className="flex flex-wrap items-center justify-between gap-6 md:gap-8 max-w-4xl">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`flex items-center gap-3 ${i > 2 ? (i === 3 ? 'hidden sm:flex' : 'hidden lg:flex') : ''}`}>
                   <div className="w-8 h-8 rounded-full bg-gray-800/80"></div>
                   <div>
                     <div className="w-16 h-3 bg-gray-800/80 rounded mb-1.5"></div>
                     <div className="w-20 h-4 bg-gray-800/80 rounded"></div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>


          {/* RANKED COMPETITIONS SKELETON */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="w-48 h-6 bg-gray-200 rounded mb-2"></div>
                <div className="w-64 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-16 h-6 bg-amber-100 rounded-full"></div>
            </div>
            
            {/* Show just 3 cards (1 row) instead of 6 to prevent massive layout shifts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 h-[240px] flex flex-col justify-between shadow-sm">
                   <div>
                     <div className="flex justify-between items-start mb-4">
                        <div className="w-20 h-6 bg-gray-200 rounded-md"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                     </div>
                     <div className="w-full h-7 bg-gray-200 rounded-md mb-4"></div>
                     <div className="flex gap-4 mb-4">
                        <div className="w-16 h-4 bg-gray-200 rounded"></div>
                        <div className="w-16 h-4 bg-gray-200 rounded"></div>
                     </div>
                   </div>
                   <div className="w-full h-12 bg-gray-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          </section>

          {/* PREMIUM COMPETITIONS SKELETON */}
          <section className="space-y-6">
            <div>
              <div className="w-64 h-6 bg-amber-200/50 rounded mb-2"></div>
              <div className="w-80 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="bg-navy rounded-2xl border border-amber-500/20 p-6 md:p-8 h-[360px] flex flex-col relative overflow-hidden">
                   <div className="absolute top-0 right-6 w-12 h-6 bg-amber-500/80 rounded-b-lg"></div>
                   <div className="flex gap-3 mb-4">
                      <div className="w-20 h-6 bg-amber-500/20 rounded"></div>
                      <div className="w-16 h-6 bg-gray-700 rounded"></div>
                   </div>
                   <div className="w-3/4 h-8 bg-gray-700 rounded mb-8"></div>
                   
                   <div className="space-y-5 mb-8">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-amber-500/20 shrink-0"></div>
                         <div className="w-48 h-4 bg-gray-700 rounded"></div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-amber-500/20 shrink-0"></div>
                         <div className="w-40 h-4 bg-gray-700 rounded"></div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-gray-700 shrink-0"></div>
                         <div className="w-44 h-4 bg-gray-700 rounded"></div>
                      </div>
                   </div>
                   
                   <div className="mt-auto flex flex-col items-center gap-3">
                      <div className="w-40 h-3 bg-amber-500/50 rounded"></div>
                      <div className="w-full h-12 bg-amber-600/80 rounded-xl"></div>
                   </div>
                </div>
              ))}
            </div>
          </section>

          {/* UPCOMING EVENTS SKELETON */}
          <section className="space-y-6">
            <div>
              <div className="w-40 h-6 bg-gray-200 rounded mb-2"></div>
            </div>
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex gap-2">
                      <div className="w-20 h-5 bg-gray-200 rounded-md"></div>
                      <div className="w-24 h-5 bg-gray-200 rounded-md"></div>
                    </div>
                    <div className="w-64 h-6 bg-gray-200 rounded-md"></div>
                    <div className="flex flex-wrap gap-4 pt-1">
                      <div className="w-28 h-6 bg-gray-200 rounded-md"></div>
                      <div className="w-32 h-6 bg-gray-200 rounded-md"></div>
                      <div className="w-40 h-6 bg-gray-200 rounded-md"></div>
                    </div>
                  </div>
                  <div className="shrink-0 w-full md:w-40 h-12 bg-gray-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (SIDEBAR) SKELETON */}
        <div className="lg:col-span-3 space-y-10 animate-pulse">
          
          {/* HISTORY SKELETON */}
          <section className="space-y-4">
            <div className="w-48 h-4 bg-gray-200 rounded mb-2"></div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
               {[1, 2, 3].map(i => (
                 <div key={i} className="pl-6 relative">
                   <div className="absolute w-3 h-3 bg-gray-200 rounded-full left-[-7px] top-1.5 border-2 border-white"></div>
                   <div className="w-32 h-5 bg-gray-200 rounded mb-2"></div>
                   <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                   <div className="flex gap-2 mt-2">
                     <div className="w-16 h-3 bg-gray-200 rounded"></div>
                     <div className="w-20 h-3 bg-gray-200 rounded"></div>
                   </div>
                 </div>
               ))}
               <div className="flex justify-center pt-2">
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
               </div>
            </div>
          </section>

          {/* PERFORMANCE SKELETON */}
          <section className="space-y-4">
            <div className="w-56 h-4 bg-gray-200 rounded"></div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
               <div className="bg-navy p-6 flex flex-col items-center justify-center relative">
                  <div className="w-10 h-10 bg-gray-700 rounded-full mb-3"></div>
                  <div className="w-32 h-3 bg-amber-500/50 rounded mb-2"></div>
                  <div className="w-20 h-10 bg-gray-700 rounded"></div>
               </div>
               <div className="p-5 space-y-5">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`flex justify-between items-center ${i < 4 ? 'pb-3 border-b border-gray-100' : ''}`}>
                       <div className="w-32 h-4 bg-gray-200 rounded"></div>
                       <div className="w-12 h-5 bg-gray-200 rounded"></div>
                    </div>
                  ))}
               </div>
            </div>
          </section>

          {/* PRIVATE CHALLENGE SKELETON */}
          <section className="space-y-4">
            <div>
              <div className="w-48 h-4 bg-gray-200 rounded mb-2"></div>
              <div className="w-full max-w-[200px] h-8 bg-gray-200 rounded"></div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
               <div className="flex items-center gap-2">
                 <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                 <div className="w-40 h-5 bg-gray-200 rounded"></div>
               </div>
               <div className="flex gap-2">
                 <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
                 <div className="w-24 h-12 bg-gray-200 rounded-lg shrink-0"></div>
               </div>
               <div className="flex justify-center pt-2 border-t border-gray-100">
                 <div className="w-40 h-4 bg-gray-200 rounded mt-2"></div>
               </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
