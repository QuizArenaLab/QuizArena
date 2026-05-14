"use client";

import { motion, Variants } from "framer-motion";
import { XCircle, Target, TrendingUp, CalendarX, Trophy, BookX, Zap } from "lucide-react";

export function ProblemSolutionSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const listVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const listItemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
      <div className="container-base">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-16 sm:mb-24"
        >
          <div className="inline-flex items-center gap-2 text-primary font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-4 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/20">
            <Zap className="w-4 h-4 fill-current" /> The Gap in Preparation
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-navy mb-6 tracking-tight leading-[1.1]">
            Standard mock tests are <br className="hidden sm:block" />
            <span className="text-primary">failing serious aspirants.</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-navy/60 font-medium leading-relaxed">
            Generic platforms focus on quantity, not quality. We identified the three critical
            friction points that stop talented candidates from making the final merit list.
          </p>
        </motion.div>

        {/* The Comparison Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 max-w-5xl mx-auto"
        >
          {/* The Problem */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-4xl p-6 sm:p-8 lg:p-10 shadow-sm border border-red-100 flex flex-col relative hover:shadow-lg transition-all duration-500"
          >
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-red-100">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-navy tracking-tight">
                  Unstructured Preparation
                </h3>
                <div className="text-[10px] sm:text-xs text-red-500 font-black uppercase tracking-widest mt-1">
                  The path to burnout
                </div>
              </div>
            </div>

            <motion.ul variants={listVariants} className="space-y-6 sm:space-y-8">
              <motion.li variants={listItemVariants} className="flex items-start gap-4 group/item">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5 border border-red-100 group-hover/item:scale-110 transition-transform">
                  <CalendarX className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <h4 className="font-bold text-navy mb-1.5 text-lg">Inconsistent Discipline</h4>
                  <p className="text-sm sm:text-base text-navy/60 font-medium leading-relaxed">
                    Studying 10 hours one day and 0 hours the next. No system to keep you
                    accountable.
                  </p>
                </div>
              </motion.li>
              <motion.li variants={listItemVariants} className="flex items-start gap-4 group/item">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5 border border-red-100 group-hover/item:scale-110 transition-transform">
                  <BookX className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <h4 className="font-bold text-navy mb-1.5 text-lg">Ignoring Weak Subjects</h4>
                  <p className="text-sm sm:text-base text-navy/60 font-medium leading-relaxed">
                    Only practicing what you are already good at, leaving critical weaknesses
                    exposed for exam day.
                  </p>
                </div>
              </motion.li>
              <motion.li variants={listItemVariants} className="flex items-start gap-4 group/item">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5 border border-red-100 group-hover/item:scale-110 transition-transform">
                  <Target className="w-4 h-4 text-red-500 opacity-50" />
                </div>
                <div>
                  <h4 className="font-bold text-navy mb-1.5 text-lg">Blind to the Competition</h4>
                  <p className="text-sm sm:text-base text-navy/60 font-medium leading-relaxed">
                    Taking isolated mock tests occasionally, but never knowing exactly where you
                    rank among others.
                  </p>
                </div>
              </motion.li>
            </motion.ul>
          </motion.div>

          {/* The Solution */}
          <motion.div
            variants={itemVariants}
            className="bg-navy rounded-4xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-primary/10 border border-primary/20 flex flex-col relative overflow-hidden group/card"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-transform group-hover/card:scale-110 duration-700" />

            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover/card:rotate-12 transition-transform duration-500">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  QuizArena Discipline
                </h3>
                <div className="text-[10px] sm:text-xs text-primary font-black uppercase tracking-widest mt-1">
                  The path to selection
                </div>
              </div>
            </div>

            <motion.ul variants={listVariants} className="space-y-6 sm:space-y-8 relative z-10">
              <motion.li variants={listItemVariants} className="flex items-start gap-4 group/item">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 border border-primary/20 group-hover/item:scale-110 transition-transform">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1.5 text-lg">Daily Competitive Loops</h4>
                  <p className="text-sm sm:text-base text-white/60 font-medium leading-relaxed">
                    Mandatory daily challenges that force you to show up, building an unbreakable
                    preparation streak.
                  </p>
                </div>
              </motion.li>
              <motion.li variants={listItemVariants} className="flex items-start gap-4 group/item">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 border border-primary/20 group-hover/item:scale-110 transition-transform">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1.5 text-lg">
                    Targeted Weakness Tracking
                  </h4>
                  <p className="text-sm sm:text-base text-white/60 font-medium leading-relaxed">
                    The platform identifies exactly where you are losing marks and forces you to
                    confront weak topics.
                  </p>
                </div>
              </motion.li>
              <motion.li variants={listItemVariants} className="flex items-start gap-4 group/item">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 border border-primary/20 group-hover/item:scale-110 transition-transform">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1.5 text-lg">
                    National Leaderboard Visibility
                  </h4>
                  <p className="text-sm sm:text-base text-white/60 font-medium leading-relaxed">
                    Real-time rank updates after every challenge so you know exactly how many
                    aspirants you need to beat.
                  </p>
                </div>
              </motion.li>
            </motion.ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
