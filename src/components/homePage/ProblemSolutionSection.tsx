import { XCircle, Target, TrendingUp, CalendarX, Trophy, BookX, Zap } from "lucide-react";

export function ProblemSolutionSection() {
  return (
    <section className="py-24 lg:py-32 bg-gray-50 border-y border-accent/40 relative overflow-hidden">
      <div className="container-base">
        
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24 px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 text-navy tracking-tight leading-tight">
            Why do serious aspirants fail despite studying hard?
          </h2>
          <p className="text-navy/70 text-base sm:text-lg lg:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            Hard work isn't enough. If your preparation lacks daily discipline and competitive visibility, you are preparing blindly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 max-w-5xl mx-auto">
          
          {/* The Problem */}
          <div className="bg-white rounded-4xl p-6 sm:p-8 lg:p-10 shadow-sm border border-red-100 flex flex-col relative hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-red-100">
               <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                 <XCircle className="w-6 h-6 text-red-500" />
               </div>
               <div>
                  <h3 className="text-xl sm:text-2xl font-black text-navy tracking-tight">Unstructured Preparation</h3>
                  <div className="text-[10px] sm:text-xs text-red-500 font-black uppercase tracking-widest mt-1">The path to burnout</div>
               </div>
            </div>
            
            <ul className="space-y-6 sm:space-y-8">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5 border border-red-100">
                   <CalendarX className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <h4 className="font-bold text-navy mb-1.5 text-lg">Inconsistent Discipline</h4>
                  <p className="text-sm sm:text-base text-navy/60 font-medium leading-relaxed">Studying 10 hours one day and 0 hours the next. No system to keep you accountable.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5 border border-red-100">
                  <BookX className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <h4 className="font-bold text-navy mb-1.5 text-lg">Ignoring Weak Subjects</h4>
                  <p className="text-sm sm:text-base text-navy/60 font-medium leading-relaxed">Only practicing what you are already good at, leaving critical weaknesses exposed for exam day.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5 border border-red-100">
                  <Target className="w-4 h-4 text-red-500 opacity-50" />
                </div>
                <div>
                  <h4 className="font-bold text-navy mb-1.5 text-lg">Blind to the Competition</h4>
                  <p className="text-sm sm:text-base text-navy/60 font-medium leading-relaxed">Taking isolated mock tests occasionally, but never knowing exactly where you rank among others.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* The Solution */}
          <div className="bg-navy rounded-4xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-primary/10 border border-primary/20 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-transform group-hover:scale-110 duration-700" />
            
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10 relative z-10">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                 <Trophy className="w-6 h-6 text-primary" />
               </div>
               <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">QuizArena Discipline</h3>
                  <div className="text-[10px] sm:text-xs text-primary font-black uppercase tracking-widest mt-1">The path to selection</div>
               </div>
            </div>
            
            <ul className="space-y-6 sm:space-y-8 relative z-10">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 border border-primary/20">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1.5 text-lg">Daily Competitive Loops</h4>
                  <p className="text-sm sm:text-base text-white/60 font-medium leading-relaxed">Mandatory daily challenges that force you to show up, building an unbreakable preparation streak.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 border border-primary/20">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1.5 text-lg">Targeted Weakness Tracking</h4>
                  <p className="text-sm sm:text-base text-white/60 font-medium leading-relaxed">The platform identifies exactly where you are losing marks and forces you to confront weak topics.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 border border-primary/20">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1.5 text-lg">National Leaderboard Visibility</h4>
                  <p className="text-sm sm:text-base text-white/60 font-medium leading-relaxed">Real-time rank updates after every challenge so you know exactly how many aspirants you need to beat.</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
