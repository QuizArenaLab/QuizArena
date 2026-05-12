"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container-base flex items-center justify-between">
        
        {/* Left: Brand Identity */}
        <Link href="/" className="flex items-center group z-50">
          <img 
            src="/logo-header.png" 
            alt="QuizArena" 
            className="h-14 sm:h-16 md:h-20 w-auto object-contain"
          />
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {["Challenges", "Rankings", "Intelligence", "Pricing"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-bold text-navy/70 hover:text-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/login"
            className="text-sm font-bold text-navy/70 hover:text-navy transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
          >
            Start Free
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden relative z-40 p-2.5 text-navy bg-white hover:bg-gray-50 active:scale-90 transition-all duration-300 rounded-full shadow-sm border border-gray-200/60 focus:outline-none group"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <div className="flex flex-col justify-center items-end gap-[5px] w-5 h-4">
            <span className="block h-[2px] w-full bg-navy rounded-full group-active:translate-x-1 transition-all duration-300" />
            <span className="block h-[2px] w-[70%] bg-navy rounded-full group-hover:w-full transition-all duration-300" />
            <span className="block h-[2px] w-[40%] bg-navy rounded-full group-hover:w-full transition-all duration-300" />
          </div>
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      <div 
        className={`fixed inset-0 bg-navy/40 backdrop-blur-sm z-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Side Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-[85vw] max-w-[360px] bg-white z-50 shadow-2xl flex flex-col transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden ${
          mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-[110%] opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <img src="/logo.png" alt="QuizArena Icon" className="h-16 w-auto object-contain drop-shadow-sm scale-110 origin-left" />
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-2.5 -mr-2 text-navy bg-gray-50 hover:bg-gray-100 active:scale-90 hover:rotate-90 transition-all duration-500 rounded-full focus:outline-none"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 stroke-2" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col relative z-0">
          <div className="text-[10px] font-black uppercase tracking-widest text-navy/40 mb-6">Navigation</div>
          <nav className="flex flex-col gap-6">
            {["Challenges", "Rankings", "Intelligence", "Pricing"].map((item, i) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`group flex items-center justify-between text-[28px] leading-none font-black text-navy transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-primary hover:translate-x-2 ${
                  mobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                }`}
                style={{ transitionDelay: `${150 + i * 50}ms` }}
              >
                <span>{item}</span>
                <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                   <ArrowRight className="w-4 h-4 text-primary" />
                </span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-6 bg-gray-50/80 backdrop-blur-sm border-t border-gray-200 flex flex-col gap-3 mt-auto shadow-[0_-10px_40px_rgba(0,0,0,0.04)] relative z-10">
          <Link
            href="/signup"
            onClick={() => setMobileMenuOpen(false)}
            className="group w-full py-4 rounded-xl bg-primary hover:bg-primary/90 text-white text-center font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
          >
            Start Free Trial <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full py-4 rounded-xl bg-white hover:bg-gray-100 text-navy text-center font-bold text-lg active:bg-gray-200 transition-colors duration-300 border border-gray-200 hover:border-gray-300"
          >
            Log In
          </Link>
        </div>
      </div>
    </header>
  );
}
