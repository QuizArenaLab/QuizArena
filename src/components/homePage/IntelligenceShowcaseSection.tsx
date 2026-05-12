import { Target, Activity, Trophy, Crosshair, TrendingUp, Clock, ArrowUpRight, ArrowRight } from "lucide-react";

export function IntelligenceShowcaseSection() {
  return (
    <section className="py-24 lg:py-32 bg-[#FAFBFF] relative overflow-hidden border-y border-gray-100">
      {/* Background Engineering Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
      
      {/* Ambient Background Glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-base relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 sm:gap-16 lg:gap-24">
          
          {/* Left Sticky Header */}
          <div className="w-full lg:w-5/12 relative">
            <div className="lg:sticky lg:top-32 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-primary mb-6 font-black text-[10px] sm:text-xs uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-full border border-primary/20 shadow-sm">
                <Activity className="w-4 h-4" /> The Optimization Loop
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-navy tracking-tight leading-[1.1]">
                The algorithmic engine <br className="hidden sm:block" />
                <span className="bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent">behind your rank.</span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-navy/60 font-medium leading-relaxed max-w-md mb-8 mx-auto lg:mx-0">
                Move beyond static mock tests. We replaced blind studying with a closed-loop system that tracks your execution, dissects granular weaknesses, and instantly generates the exact revision path needed to maximize your percentile.
              </p>
              
              <button className="hidden lg:inline-flex items-center gap-2 bg-navy text-white px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide hover:bg-navy/90 transition-all shadow-xl shadow-navy/20 group">
                Experience the Engine
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Scrolling Content (Typographic Stack) */}
          <div className="w-full lg:w-7/12 flex flex-col gap-12 sm:gap-16 lg:gap-28 lg:pt-4 lg:pb-16">
            
            {/* Step 1 */}
            <div className="relative group">
              <div className="flex items-center gap-4 mb-5">
                <div className="text-[10px] sm:text-xs font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded uppercase tracking-widest">
                  Step 01
                </div>
                <div className="h-px flex-1 bg-linear-to-r from-gray-200 to-transparent"></div>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy mb-4 tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                Challenge Execution
              </h3>
              <p className="text-base sm:text-lg lg:text-xl text-navy/60 font-medium leading-relaxed mb-6 sm:mb-8">
                You enter a timed, high-pressure arena. No pausing. No second-guessing. The system records your time-per-question and accuracy metrics instantly as you compete.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 text-[11px] sm:text-sm font-bold text-navy bg-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-gray-200 shadow-sm">
                  <Target className="w-4 h-4 text-navy/50" /> Q. 42 / 100
                </div>
                <div className="inline-flex items-center gap-2 text-[11px] sm:text-sm font-bold text-primary bg-primary/5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-primary/20 shadow-sm">
                  <Clock className="w-4 h-4" /> 00:45s avg.
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="flex items-center gap-4 mb-5">
                <div className="text-[10px] sm:text-xs font-black text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded uppercase tracking-widest">
                  Step 02
                </div>
                <div className="h-px flex-1 bg-linear-to-r from-gray-200 to-transparent"></div>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy mb-4 tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                Micro-Analysis
              </h3>
              <p className="text-base sm:text-lg lg:text-xl text-navy/60 font-medium leading-relaxed mb-6 sm:mb-8">
                The platform's intelligence engine dissects your performance, instantly identifying specific topics where your speed or accuracy falls below the competitive benchmark.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 text-[11px] sm:text-sm font-bold text-navy bg-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-gray-200 shadow-sm">
                  <Activity className="w-4 h-4 text-navy/50" /> 45% Accuracy
                </div>
                <div className="inline-flex items-center gap-2 text-[11px] sm:text-sm font-bold text-red-600 bg-red-50 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-red-100 shadow-sm">
                  <Crosshair className="w-4 h-4" /> Arithmetic Weakness
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="flex items-center gap-4 mb-5">
                <div className="text-[10px] sm:text-xs font-black text-secondary bg-secondary/10 border border-secondary/20 px-3 py-1.5 rounded uppercase tracking-widest">
                  Step 03
                </div>
                <div className="h-px flex-1 bg-linear-to-r from-gray-200 to-transparent"></div>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy mb-4 tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                Rank Recalculation
              </h3>
              <p className="text-base sm:text-lg lg:text-xl text-navy/60 font-medium leading-relaxed mb-6 sm:mb-8">
                Your national standing is updated in real-time. You immediately see how the challenge impacted your overall percentile against thousands of active competitors.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 text-[11px] sm:text-sm font-bold text-navy bg-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-gray-200 shadow-sm">
                  <Trophy className="w-4 h-4 text-navy/50" /> Rank #842
                </div>
                <div className="inline-flex items-center gap-2 text-[11px] sm:text-sm font-bold text-emerald-600 bg-emerald-50 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-emerald-100 shadow-sm">
                  <ArrowUpRight className="w-4 h-4" /> +14 Spots Movement
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative group">
              <div className="flex items-center gap-4 mb-5">
                <div className="text-[10px] sm:text-xs font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded uppercase tracking-widest">
                  Step 04
                </div>
                <div className="h-px flex-1 bg-linear-to-r from-gray-200 to-transparent"></div>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy mb-4 tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                Targeted Correction
              </h3>
              <p className="text-base sm:text-lg lg:text-xl text-navy/60 font-medium leading-relaxed mb-6 sm:mb-8">
                Instead of guessing what to study next, the system automatically generates a custom revision protocol focused entirely on the weaknesses exposed in the challenge.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 text-[11px] sm:text-sm font-bold text-navy bg-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-gray-200 shadow-sm">
                  <Target className="w-4 h-4 text-navy/50" /> Arithmetic Focus
                </div>
                <div className="inline-flex items-center gap-2 text-[11px] sm:text-sm font-bold text-emerald-600 bg-emerald-50 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-emerald-100 shadow-sm">
                  <TrendingUp className="w-4 h-4" /> 15 Questions Generated
                </div>
              </div>
            </div>

            {/* Mobile CTA (Shows only on mobile since left side un-sticks) */}
            <div className="lg:hidden mt-4 pt-8 border-t border-gray-200/60">
              <button className="w-full inline-flex justify-center items-center gap-2 bg-navy text-white px-6 py-4 rounded-xl font-bold text-sm tracking-wide hover:bg-navy/90 transition-all shadow-xl shadow-navy/20 group">
                Experience the Engine
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
