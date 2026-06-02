"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Session } from "next-auth";

import { usePathname } from "next/navigation";

export function Navbar({ session }: { session?: Session | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isOnboarding = pathname?.startsWith("/onboarding");
  const isAuthPage =
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/signup");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isOnboarding || isAuthPage) return null;

  const navItems = ["Challenges", "Rankings", "Intelligence", "Pricing"];

  return (
    <header className="fixed top-0 inset-x-0 z-40 pointer-events-none">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          delay: 0.1,
        }}
        className={`w-full pointer-events-auto transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-gray-200/60 shadow-sm py-0"
            : "bg-transparent py-2"
        }`}
      >
        <div className="container-base flex items-center justify-between">
          {/* Left: Brand Identity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <Link
              href="/"
              onClick={(e) => {
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="flex items-center group z-50 cursor-pointer"
            >
              <Image
                src="/logo-header.png"
                alt="QuizArena"
                width={180}
                height={100}
                className="h-16 sm:h-22 md:h-28 w-auto object-contain transition-all duration-500 group-hover:scale-105 drop-shadow-sm"
              />
            </Link>
          </motion.div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {!isAuthPage &&
              navItems.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
                >
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className="text-sm font-bold text-navy/70 hover:text-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
          </nav>

          {/* Right: Actions */}
          <div className="hidden md:flex items-center gap-5">
            {session && !isAuthPage ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, type: "spring" }}
              >
                <Link
                  href="/dashboard"
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                >
                  Dashboard
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Link
                    href={pathname?.startsWith("/login") ? "/register" : "/login"}
                    className="text-sm font-bold text-navy/70 hover:text-navy transition-colors"
                  >
                    {pathname?.startsWith("/login") ? "Register" : "Login"}
                  </Link>
                </motion.div>
                {!isAuthPage && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9, type: "spring" }}
                  >
                    <Link
                      href="/signup"
                      className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                    >
                      Start Free
                    </Link>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          {!isAuthPage && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="md:hidden relative z-40 p-2.5 text-navy bg-white hover:bg-gray-50 active:scale-90 transition-all duration-300 rounded-full shadow-sm border border-gray-200/60 focus:outline-none group pointer-events-auto"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <div className="flex flex-col justify-center items-end gap-[5px] w-5 h-4">
                <span className="block h-[2px] w-full bg-navy rounded-full group-active:translate-x-1 transition-all duration-300" />
                <span className="block h-[2px] w-[70%] bg-navy rounded-full group-hover:w-full transition-all duration-300" />
                <span className="block h-[2px] w-[40%] bg-navy rounded-full group-hover:w-full transition-all duration-300" />
              </div>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Mobile Drawer (Uses AnimatePresence for entry/exit) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-50 pointer-events-auto md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[85vw] max-w-[360px] bg-white z-50 shadow-2xl flex flex-col pointer-events-auto md:hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <Image
                    src="/logo.png"
                    alt="QuizArena Icon"
                    width={64}
                    height={64}
                    className="h-16 w-auto object-contain drop-shadow-sm scale-110 origin-left"
                  />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 -mr-2 text-navy bg-gray-50 hover:bg-gray-100 active:scale-90 hover:rotate-90 transition-all duration-500 rounded-full focus:outline-none"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 stroke-2" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col">
                {!isAuthPage && (
                  <>
                    <div className="text-[10px] font-black uppercase tracking-widest text-navy/40 mb-6">
                      Navigation
                    </div>
                    <nav className="flex flex-col gap-6">
                      {navItems.map((item, i) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                        >
                          <Link
                            href={`#${item.toLowerCase()}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="group flex items-center justify-between text-[28px] leading-none font-black text-navy transition-all duration-500 hover:text-primary hover:translate-x-2"
                          >
                            <span>{item}</span>
                            <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                              <ArrowRight className="w-4 h-4 text-primary" />
                            </span>
                          </Link>
                        </motion.div>
                      ))}
                    </nav>
                  </>
                )}
              </div>

              <div className="p-6 bg-gray-50/80 backdrop-blur-sm border-t border-gray-200 flex flex-col gap-3 mt-auto shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="group w-full py-4 rounded-xl bg-primary hover:bg-primary/90 text-white text-center font-bold text-lg shadow-lg shadow-primary/30 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Start Free Trial{" "}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-4 rounded-xl bg-white hover:bg-gray-100 text-navy text-center font-bold text-lg active:bg-gray-200 transition-colors duration-300 border border-gray-200"
                >
                  Log In
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
