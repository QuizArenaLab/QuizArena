"use client";

import { motion, Variants, useScroll, useTransform } from "framer-motion";
import {
  Target,
  Activity,
  Trophy,
  Crosshair,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { useRef } from "react";

export function IntelligenceShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const glowX = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const glowY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  const stepVariants: Variants = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        mass: 1,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      style={{ position: "relative" }}
      className="py-24 lg:py-32 bg-[#FAFBFF] relative overflow-hidden border-y border-gray-100"
    >
      {/* Background Engineering Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

      {/* Ambient Background Glows with subtle movement */}
      <motion.div
        style={{ x: glowX, y: glowY }}
        className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        style={{ x: glowY, y: glowX }}
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="container-base relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 sm:gap-16 lg:gap-24">
          {/* Left Sticky Header */}
          <div className="w-full lg:w-5/12 relative">
            <motion.div
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
              className="lg:sticky lg:top-32 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 text-primary mb-6 font-black text-[10px] sm:text-xs uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-full border border-primary/20 shadow-sm">
                <Activity className="w-4 h-4" /> The Optimization Loop
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-navy tracking-tight leading-[1.1]">
                The algorithmic engine <br className="hidden sm:block" />
                <span className="bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                  behind your rank.
                </span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-navy/60 font-medium leading-relaxed max-w-md mb-8 mx-auto lg:mx-0">
                Move beyond static mock tests. We replaced blind studying with a closed-loop system
                that tracks your execution, dissects granular weaknesses, and instantly generates
                the exact revision path needed to maximize your percentile.
              </p>

              <motion.button
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hidden lg:inline-flex items-center gap-2 bg-navy text-white px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide hover:bg-navy/90 transition-all shadow-xl shadow-navy/20 group cursor-pointer"
              >
                Experience the Engine
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          </div>

          {/* Right Scrolling Content (Typographic Stack) */}
          <div className="w-full lg:w-7/12 flex flex-col gap-12 sm:gap-16 lg:gap-28 lg:pt-4 lg:pb-16">
            {/* Step 1 */}
            <motion.div
              variants={stepVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="relative group"
            >
              <div className="flex items-center gap-4 mb-5">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-[10px] sm:text-xs font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-colors duration-500 cursor-default"
                >
                  Step 01
                </motion.div>
                <motion.div
                  initial={{ scaleX: 0, originX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "circOut" }}
                  className="h-px flex-1 bg-linear-to-r from-gray-200 to-transparent"
                ></motion.div>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy mb-4 tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                Challenge Execution
              </h3>
              <p className="text-base sm:text-lg lg:text-xl text-navy/60 font-medium leading-relaxed mb-6 sm:mb-8">
                You enter a timed, high-pressure arena. No pausing. No second-guessing. The system
                records your time-per-question and accuracy metrics instantly as you compete.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="inline-flex items-center gap-2 text-[11px] sm:text-sm font-bold text-navy bg-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-gray-200 shadow-sm cursor-default"
                >
                  <Target className="w-4 h-4 text-navy/50" /> Q. 42 / 100
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="inline-flex items-center gap-2 text-[11px] sm:text-sm font-bold text-primary bg-primary/5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-primary/20 shadow-sm cursor-default"
                >
                  <Clock className="w-4 h-4" /> 00:45s avg.
                </motion.div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              variants={stepVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="relative group"
            >
              <div className="flex items-center gap-4 mb-5">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-[10px] sm:text-xs font-black text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded uppercase tracking-widest group-hover:bg-red-500 group-hover:text-white transition-colors duration-500 cursor-default"
                >
                  Step 02
                </motion.div>
                <motion.div
                  initial={{ scaleX: 0, originX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "circOut" }}
                  className="h-px flex-1 bg-linear-to-r from-gray-200 to-transparent"
                ></motion.div>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy mb-4 tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                Micro-Analysis
              </h3>
              <p className="text-base sm:text-lg lg:text-xl text-navy/60 font-medium leading-relaxed mb-6 sm:mb-8">
                The platform's intelligence engine dissects your performance, instantly identifying
                specific topics where your speed or accuracy falls below the competitive benchmark.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="inline-flex items-center gap-2 text-[11px] sm:text-sm font-bold text-navy bg-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-gray-200 shadow-sm cursor-default"
                >
                  <Activity className="w-4 h-4 text-navy/50" /> 45% Accuracy
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="inline-flex items-center gap-2 text-[11px] sm:text-sm font-bold text-red-600 bg-red-50 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-red-100 shadow-sm cursor-default"
                >
                  <Crosshair className="w-4 h-4" /> Arithmetic Weakness
                </motion.div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              variants={stepVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="relative group"
            >
              <div className="flex items-center gap-4 mb-5">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-[10px] sm:text-xs font-black text-secondary bg-secondary/10 border border-secondary/20 px-3 py-1.5 rounded uppercase tracking-widest group-hover:bg-secondary group-hover:text-white transition-colors duration-500 cursor-default"
                >
                  Step 03
                </motion.div>
                <motion.div
                  initial={{ scaleX: 0, originX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "circOut" }}
                  className="h-px flex-1 bg-linear-to-r from-gray-200 to-transparent"
                ></motion.div>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy mb-4 tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                Rank Recalculation
              </h3>
              <p className="text-base sm:text-lg lg:text-xl text-navy/60 font-medium leading-relaxed mb-6 sm:mb-8">
                Your national standing is updated in real-time. You immediately see how the
                challenge impacted your overall percentile against thousands of active competitors.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="inline-flex items-center gap-2 text-[11px] sm:text-sm font-bold text-navy bg-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-gray-200 shadow-sm cursor-default"
                >
                  <Trophy className="w-4 h-4 text-navy/50" /> Rank #842
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="inline-flex items-center gap-2 text-[11px] sm:text-sm font-bold text-emerald-600 bg-emerald-50 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-emerald-100 shadow-sm cursor-default"
                >
                  <ArrowUpRight className="w-4 h-4" /> +14 Spots Movement
                </motion.div>
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              variants={stepVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="relative group"
            >
              <div className="flex items-center gap-4 mb-5">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-[10px] sm:text-xs font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded uppercase tracking-widest group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500 cursor-default"
                >
                  Step 04
                </motion.div>
                <motion.div
                  initial={{ scaleX: 0, originX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "circOut" }}
                  className="h-px flex-1 bg-linear-to-r from-gray-200 to-transparent"
                ></motion.div>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy mb-4 tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                Targeted Correction
              </h3>
              <p className="text-base sm:text-lg lg:text-xl text-navy/60 font-medium leading-relaxed mb-6 sm:mb-8">
                Instead of guessing what to study next, the system automatically generates a custom
                revision protocol focused entirely on the weaknesses exposed in the challenge.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="inline-flex items-center gap-2 text-[11px] sm:text-sm font-bold text-navy bg-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-gray-200 shadow-sm cursor-default"
                >
                  <Target className="w-4 h-4 text-navy/50" /> Arithmetic Focus
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="inline-flex items-center gap-2 text-[11px] sm:text-sm font-bold text-emerald-600 bg-emerald-50 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-emerald-100 shadow-sm cursor-default"
                >
                  <TrendingUp className="w-4 h-4" /> 15 Questions Generated
                </motion.div>
              </div>
            </motion.div>

            {/* Mobile CTA (Shows only on mobile since left side un-sticks) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:hidden mt-4 pt-8 border-t border-gray-200/60"
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full inline-flex justify-center items-center gap-2 bg-navy text-white px-6 py-4 rounded-xl font-bold text-sm tracking-wide hover:bg-navy/90 transition-all shadow-xl shadow-navy/20 group cursor-pointer"
              >
                Experience the Engine
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
