import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navy pt-20 pb-10 text-white border-t border-navy">
      <div className="container-base">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16 sm:mb-20">
          
          {/* Column 1: Brand Identity */}
          <div className="sm:col-span-2 lg:col-span-6">
            <Link href="/" className="flex items-center mb-6 group w-fit">
              <img 
                src="/logo-header.png" 
                alt="QuizArena" 
                className="h-14 sm:h-16 w-auto brightness-0 invert" 
              />
            </Link>
            <p className="text-white/60 text-base sm:text-sm font-medium leading-relaxed max-w-sm">
              Competitive preparation for serious aspirants. Train under pressure, track your weaknesses, and climb the national leaderboard.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="lg:col-span-3">
            <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-6">Navigation</h4>
            <ul className="flex flex-col gap-4">
              {["Challenges", "Rankings", "Intelligence", "Pricing"].map((item) => (
                <li key={item}>
                  <Link 
                    href={`#${item.toLowerCase()}`}
                    className="text-sm font-bold text-white/70 hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="lg:col-span-3">
            <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-6">Resources</h4>
            <ul className="flex flex-col gap-4">
              {["FAQ", "Contact", "Terms of Service", "Privacy Policy"].map((item) => (
                <li key={item}>
                  <Link 
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm font-bold text-white/70 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer Bottom Strip */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[10px] sm:text-xs font-bold text-white/40 text-center sm:text-left">
            © {new Date().getFullYear()} QuizArena. All rights reserved.
          </p>
          
          <div className="flex items-center gap-5">
            <a href="#" className="text-white/40 hover:text-primary transition-colors" aria-label="Twitter">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="#" className="text-white/40 hover:text-primary transition-colors" aria-label="LinkedIn">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="#" className="text-white/40 hover:text-primary transition-colors" aria-label="Instagram">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
