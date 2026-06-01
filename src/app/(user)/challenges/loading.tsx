export default function ChallengesLoading() {
  return (
    <div className="min-h-screen bg-gray-50 -m-6 sm:-m-8 p-6 sm:p-8 space-y-12">
      
      {/* SECTION 1 - COMPETITIVE ARENA HERO SKELETON */}
      <section className="relative rounded-2xl overflow-hidden bg-gray-900 shadow-xl flex flex-col justify-center py-10 md:py-16 px-8 md:px-12 border border-gray-800 animate-pulse">
        <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center">
          <div className="w-48 h-6 bg-gray-800 rounded-md mb-6"></div>
          
          <div className="w-3/4 max-w-2xl h-12 bg-gray-800 rounded-lg mb-6"></div>
          <div className="w-2/3 max-w-lg h-6 bg-gray-800 rounded-md mb-10"></div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-10">
            <div className="w-32 h-5 bg-gray-800 rounded-md"></div>
            <div className="w-32 h-5 bg-gray-800 rounded-md"></div>
            <div className="w-32 h-5 bg-gray-800 rounded-md"></div>
            <div className="w-32 h-5 bg-gray-800 rounded-md"></div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
             <div className="w-40 h-12 bg-gray-800 rounded-xl"></div>
             <div className="w-40 h-12 bg-gray-800 rounded-xl"></div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - FEATURED CHALLENGE SKELETON */}
      <section className="animate-pulse">
         <div className="w-40 h-5 bg-gray-200 rounded mb-4"></div>
         <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row h-64">
            <div className="p-8 md:p-10 flex-1 flex flex-col justify-center">
               <div className="flex gap-3 mb-4">
                  <div className="w-24 h-6 bg-gray-200 rounded"></div>
                  <div className="w-32 h-6 bg-gray-200 rounded"></div>
               </div>
               <div className="w-2/3 h-8 bg-gray-200 rounded mb-6"></div>
               <div className="flex gap-6 mb-8">
                  <div className="w-24 h-5 bg-gray-200 rounded"></div>
                  <div className="w-24 h-5 bg-gray-200 rounded"></div>
                  <div className="w-24 h-5 bg-gray-200 rounded"></div>
               </div>
               <div className="w-48 h-12 bg-gray-200 rounded-xl"></div>
            </div>
            
            <div className="bg-gray-50 border-l border-gray-100 p-8 md:p-10 flex flex-col justify-center items-center w-full md:w-64">
               <div className="w-12 h-12 bg-gray-200 rounded-full mb-3"></div>
               <div className="w-20 h-4 bg-gray-200 rounded mb-2"></div>
               <div className="w-24 h-8 bg-gray-200 rounded mb-2"></div>
               <div className="w-32 h-4 bg-gray-200 rounded"></div>
            </div>
         </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* SECTION 3 - LIVE CHALLENGES SKELETON */}
        <section className="lg:col-span-8 space-y-6 animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <div className="w-48 h-6 bg-gray-200 rounded mb-2"></div>
              <div className="w-64 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 h-48 flex flex-col justify-between">
                 <div className="flex justify-between">
                    <div className="w-20 h-5 bg-gray-200 rounded"></div>
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                 </div>
                 <div className="w-full h-6 bg-gray-200 rounded"></div>
                 <div className="flex gap-4">
                    <div className="w-12 h-4 bg-gray-200 rounded"></div>
                    <div className="w-12 h-4 bg-gray-200 rounded"></div>
                 </div>
                 <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Sidebar SKELETON */}
        <div className="lg:col-span-4 space-y-10 animate-pulse">
          
          {/* SECTION 5 - RANKING PREVIEW SKELETON */}
          <section className="space-y-4">
            <div className="w-48 h-4 bg-gray-200 rounded"></div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-72">
               <div className="bg-gray-100 p-5 h-28 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mb-2"></div>
                  <div className="w-24 h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="w-16 h-8 bg-gray-200 rounded"></div>
               </div>
               <div className="p-5 space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex justify-between items-center pb-3 border-b border-gray-100">
                       <div className="w-24 h-4 bg-gray-200 rounded"></div>
                       <div className="w-12 h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
               </div>
            </div>
          </section>

          {/* SECTION 4 - PRIVATE CHALLENGES SKELETON */}
          <section className="space-y-4">
            <div>
              <div className="w-40 h-4 bg-gray-200 rounded mb-2"></div>
              <div className="w-56 h-3 bg-gray-200 rounded"></div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 h-32 flex flex-col justify-center gap-3">
               <div className="w-32 h-4 bg-gray-200 rounded"></div>
               <div className="flex gap-2">
                 <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
                 <div className="w-20 h-10 bg-gray-200 rounded-lg"></div>
               </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
