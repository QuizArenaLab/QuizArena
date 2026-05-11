import { 
  Activity,
  ChevronRight, 
  LayoutDashboard,
  Target, 
  TrendingUp,
  Users,
  Zap
} from "lucide-react";

export default function PremiumDashboardShowcase() {
  return (
    <main className="min-h-screen bg-(--color-background) pb-24 font-sans text-navy">
      {/* Top Nav */}
      <header className="border-b border-accent/40 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container-base h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-black text-lg shadow-sm">
              Q
            </div>
            <span className="font-black text-xl tracking-tight text-navy">QuizArena</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#" className="text-sm font-bold text-primary transition-colors flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" /> Overview
            </a>
            <a href="#" className="text-sm font-semibold text-navy/60 hover:text-navy transition-colors">Assessments</a>
            <a href="#" className="text-sm font-semibold text-navy/60 hover:text-navy transition-colors">Leaderboard</a>
            <a href="#" className="text-sm font-semibold text-navy/60 hover:text-navy transition-colors">Analytics</a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-accent/50 border border-accent flex items-center justify-center font-bold text-sm text-secondary">
              JD
            </div>
          </div>
        </div>
      </header>

      <div className="container-base mt-10 grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* Left Column: The "Why" / Hero */}
        <div className="xl:col-span-1 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/30 text-secondary text-xs font-bold mb-6">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              Design System Locked
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-navy tracking-tighter leading-[1.05] mb-6">
              The anatomy of a <span className="text-primary">premium</span> SaaS.
            </h1>
            <p className="text-base text-navy/70 leading-relaxed mb-8">
              We have locked <strong>Hanken Grotesk</strong> as the global font. Notice how its sharp, geometric structure instantly elevates the platform. It commands authority in headers while maintaining crystal clarity in dense data tables.
            </p>
          </div>

          <div className="card p-6 border-l-4 border-l-secondary bg-slate-50/50">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2 tracking-tight">
              <Zap className="w-5 h-5 text-secondary fill-secondary/20" /> Why this works for UX
            </h3>
            <ul className="space-y-5 mt-5">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-accent/50 flex items-center justify-center shrink-0 text-xs font-bold text-secondary">1</div>
                <p className="text-sm text-navy/80 leading-relaxed">
                  <strong className="text-navy">Color Psychology:</strong> Primary Orange (#E6701E) triggers action and energy, perfect for CTAs and streaks. Secondary Blue (#2471E7) establishes trust and analytical focus.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-accent/50 flex items-center justify-center shrink-0 text-xs font-bold text-secondary">2</div>
                <p className="text-sm text-navy/80 leading-relaxed">
                  <strong className="text-navy">Numeric Legibility:</strong> Hanken Grotesk renders numbers beautifully. In a dashboard driven by scores, accuracy metrics, and ranks, numbers must look strictly professional.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-accent/50 flex items-center justify-center shrink-0 text-xs font-bold text-secondary">3</div>
                <p className="text-sm text-navy/80 leading-relaxed">
                  <strong className="text-navy">Reduced Cognitive Load:</strong> The soft accent background (#D5DBFD) combined with pure white cards creates depth without harsh contrast, allowing aspirants to study for hours without eye strain.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: The Dashboard Execution */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black tracking-tight">Performance Overview</h2>
            <button className="btn btn-outline btn-sm font-bold">Export Report</button>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="card p-6 group hover:-translate-y-1 transition-transform duration-300 border-accent/40 hover:border-secondary/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-navy/50">National Rank</span>
                <Target className="w-5 h-5 text-secondary" />
              </div>
              <div className="text-4xl font-black tracking-tighter mb-2">#4,291</div>
              <div className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 bg-emerald-50 w-fit px-2 py-0.5 rounded-sm">
                <TrendingUp className="w-3 h-3" /> Top 8% of Aspirants
              </div>
            </div>

            <div className="card p-6 group hover:-translate-y-1 transition-transform duration-300 border-accent/40 hover:border-primary/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Activity className="w-32 h-32 text-primary" />
              </div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-xs font-bold uppercase tracking-widest text-navy/50">Avg. Accuracy</span>
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div className="text-4xl font-black tracking-tighter mb-2 text-primary relative z-10">84.2%</div>
              <div className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 bg-emerald-50 w-fit px-2 py-0.5 rounded-sm relative z-10">
                <TrendingUp className="w-3 h-3" /> +2.4% this week
              </div>
            </div>

            <div className="card p-6 group hover:-translate-y-1 transition-transform duration-300 border-accent/40">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-navy/50">Active Competitors</span>
                <Users className="w-5 h-5 text-navy/40" />
              </div>
              <div className="text-4xl font-black tracking-tighter mb-2">12,490</div>
              <div className="text-xs font-bold text-navy/50 flex items-center gap-1.5 bg-slate-100 w-fit px-2 py-0.5 rounded-sm">
                In your current tier
              </div>
            </div>
          </div>

          {/* Detailed Analytics Panel */}
          <div className="card p-8 mt-6 border-accent/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-xl tracking-tight">Subject Proficiency Matrix</h3>
              <div className="flex gap-4">
                <span className="inline-flex items-center gap-2 text-xs font-bold text-navy">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" /> You
                </span>
                <span className="inline-flex items-center gap-2 text-xs font-bold text-navy/50">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent" /> Peer Avg
                </span>
              </div>
            </div>

            <div className="space-y-8">
              {/* Bar 1 */}
              <div>
                <div className="flex justify-between text-sm font-bold mb-3 tracking-tight">
                  <span>Quantitative Aptitude</span>
                  <span className="text-primary text-base">92%</span>
                </div>
                <div className="w-full bg-accent/20 rounded-full h-3 relative">
                  <div className="absolute top-0 left-0 h-3 bg-accent/80 rounded-full w-[70%]" />
                  <div className="absolute top-0 left-0 h-3 bg-primary rounded-full w-[92%] shadow-[0_0_15px_rgba(230,112,30,0.3)]" />
                </div>
              </div>
              
              {/* Bar 2 */}
              <div>
                <div className="flex justify-between text-sm font-bold mb-3 tracking-tight">
                  <span>Logical Reasoning</span>
                  <span className="text-secondary text-base">88%</span>
                </div>
                <div className="w-full bg-accent/20 rounded-full h-3 relative">
                  <div className="absolute top-0 left-0 h-3 bg-accent/80 rounded-full w-[65%]" />
                  <div className="absolute top-0 left-0 h-3 bg-secondary rounded-full w-[88%] shadow-[0_0_15px_rgba(36,113,231,0.3)]" />
                </div>
              </div>

              {/* Bar 3 */}
              <div>
                <div className="flex justify-between text-sm font-bold mb-3 tracking-tight">
                  <span>General Awareness</span>
                  <span className="text-navy text-base">64%</span>
                </div>
                <div className="w-full bg-accent/20 rounded-full h-3 relative">
                  <div className="absolute top-0 left-0 h-3 bg-accent/80 rounded-full w-[75%]" />
                  <div className="absolute top-0 left-0 h-3 bg-navy rounded-full w-[64%]" />
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-accent/40 flex items-center justify-between">
              <p className="text-sm text-navy/60 font-semibold">Your reasoning score is in the top 5% nationally.</p>
              <button className="btn btn-primary px-6 group font-bold tracking-wide">
                Take Mock Test
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
