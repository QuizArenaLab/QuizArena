import { ArrowRight, Target, Clock, Activity, Flag, Crosshair, Users } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 sm:pb-24 lg:pt-36 lg:pb-40 overflow-hidden bg-white">
      <div className="container-base relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">

          {/* Left Column: Copy */}
          <div className="max-w-2xl relative z-20 text-center lg:text-left mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 text-secondary text-[10px] sm:text-xs font-black tracking-[0.2em] mb-6 sm:mb-8 border border-accent/40 uppercase shadow-sm">
              <Flag className="w-3.5 h-3.5 fill-current" />
              <span>SSC • Banking • Railways • PSC</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 text-navy tracking-tight leading-[1.05] font-black">
              Train under pressure. <br className="hidden sm:block" />
              <span className="text-primary">Compete for your rank.</span>
            </h1>

            <p className="text-navy/70 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-xl font-medium leading-relaxed mx-auto lg:mx-0">
              The ultimate competitive arena for serious government exam aspirants. Face daily timed challenges, simulate real exam pressure, and climb the national leaderboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10 sm:mb-12">
              <button className="w-full sm:w-auto btn bg-navy text-white hover:bg-navy/90 btn-lg shadow-xl shadow-navy/20 group rounded-xl font-bold text-sm sm:text-base tracking-wide py-4 sm:py-3.5">
                Enter Today's Challenge
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto btn btn-outline btn-lg rounded-xl font-bold text-sm sm:text-base tracking-wide bg-gray-50 border-gray-200 py-4 sm:py-3.5">
                Explore Rankings
              </button>
            </div>

            {/* Micro-trust indicators */}
            <div className="flex items-center justify-center lg:justify-start gap-8 sm:gap-12 border-t border-accent/40 pt-8 sm:pt-10">
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black text-navy">120+</span>
                <span className="text-[10px] sm:text-[11px] font-bold text-navy/50 uppercase tracking-[0.2em]">Daily Mocks</span>
              </div>
              <div className="w-px h-10 bg-accent/40" />
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black text-navy text-left sm:text-center">Real-time</span>
                <span className="text-[10px] sm:text-[11px] font-bold text-navy/50 uppercase tracking-[0.2em]">Percentile Rank</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Challenge Ecosystem */}
          <div className="relative w-full flex items-center justify-center lg:justify-end mt-12 lg:mt-0">
            {/* Immersive background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            {/* The Live Arena Board */}
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-[480px] relative z-20">

              {/* Floating Alert (Top Left) */}
              <div className="absolute -top-4 -left-2 sm:-top-8 sm:-left-12 bg-white rounded-xl shadow-xl border border-accent/50 p-2.5 sm:p-3.5 flex items-center gap-3 z-30 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-navy/50">Rank Movement</div>
                  <div className="text-xs sm:text-sm font-bold text-navy">Bharath S. moved up <span className="text-emerald-500">+14</span></div>
                </div>
              </div>

              {/* Main Arena Container */}
              <div className="bg-white rounded-4xl sm:rounded-[2.5rem] border border-accent/40 shadow-2xl p-2 sm:p-3 relative">
                <div className="bg-[#FAFBFF] rounded-3xl sm:rounded-4xl border border-accent/20 p-5 sm:p-8">

                  {/* Arena Header */}
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 bg-red-50 px-2.5 py-1.5 rounded-full border border-red-100 shrink-0">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-black text-red-600 uppercase tracking-widest">Live Arena</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-navy/50 uppercase tracking-widest bg-white px-2.5 py-1.5 rounded-full shadow-sm border border-accent/30 shrink-0">
                      <Users className="w-3 h-3" />
                      14k+ Active
                    </div>
                  </div>

                  {/* Active High-Stakes Challenge */}
                  <div className="bg-white rounded-2xl border-2 border-primary shadow-xl p-4 sm:p-6 relative overflow-hidden group transition-all duration-300 cursor-pointer">
                    <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 relative z-10">
                      <div>
                        <span className="bg-primary/10 text-primary text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">SSC CGL Tier 1</span>
                        <h3 className="text-xl sm:text-2xl font-black text-navy mt-2.5 tracking-tight leading-tight">Quantitative <br className="hidden sm:block" />Speed Sprint</h3>
                      </div>
                      <div className="w-full sm:w-auto text-center sm:text-right bg-red-50 border border-red-100 px-3 py-2 rounded-xl">
                        <div className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1 flex items-center justify-center sm:justify-end gap-1"><Clock className="w-2.5 h-2.5" /> Ends In</div>
                        <div className="text-lg sm:text-xl font-mono font-black text-red-600 tracking-tighter">02:14:59</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 sm:mt-8 relative z-10">
                      <div className="flex -space-x-2">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-accent/40 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-navy/70 shadow-sm">
                            A{i + 1}
                          </div>
                        ))}
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-navy/60 shadow-sm">
                          +12k
                        </div>
                      </div>
                      <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                        Join Now <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Upcoming Queue */}
                  <div className="mt-6 sm:mt-8">
                    <div className="text-[9px] sm:text-[10px] font-black text-navy/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <div className="w-4 h-px bg-navy/20" /> Upcoming Queue
                    </div>

                    <div className="space-y-3">
                      {/* Queue Item 1 */}
                      <div className="bg-white rounded-xl border border-accent/40 p-3 sm:p-4 flex items-center justify-between hover:border-accent/80 transition-colors shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20 shrink-0">
                            <Crosshair className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-navy leading-tight">Banking PO: Reasoning</h4>
                            <p className="text-[8px] sm:text-[9px] font-bold text-navy/50 uppercase tracking-widest mt-0.5">Starts in 4 Hours</p>
                          </div>
                        </div>
                        <button className="text-[9px] sm:text-[10px] font-bold text-secondary bg-secondary/10 px-2.5 py-1.5 rounded-lg hover:bg-secondary/20 transition-colors shrink-0">
                          Notify
                        </button>
                      </div>

                      {/* Queue Item 2 */}
                      <div className="bg-white rounded-xl border border-accent/40 p-3 sm:p-4 flex items-center justify-between hover:border-accent/80 transition-colors shadow-sm opacity-60">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-100 flex items-center justify-center text-navy/50 border border-gray-200 shrink-0">
                            <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-navy leading-tight">Railways Full Mock</h4>
                            <p className="text-[8px] sm:text-[9px] font-bold text-navy/40 uppercase tracking-widest mt-0.5">Tomorrow, 10 AM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Floating Alert (Bottom Right) */}
              <div className="absolute -bottom-4 -right-2 sm:-bottom-5 sm:-right-8 bg-navy rounded-xl shadow-2xl border border-white/10 p-3 sm:p-4 flex items-center gap-3 z-30 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(230,112,30,0.8)] shrink-0" />
                <div className="text-[10px] sm:text-xs font-bold text-white tracking-wide">Preparation Underway</div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
