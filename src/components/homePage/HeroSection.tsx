"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Sparkles, BrainCircuit, Trophy, CheckCircle2 } from "lucide-react";

/**
 * QuizArena — Hero Section
 *
 * High-end entrance with staggered animations, reduced motion support,
 * and semantic HTML for accessibility.
 */
export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  return (
    <section
      className="relative overflow-hidden bg-white pt-16 pb-24 sm:pt-24 sm:pb-32"
      aria-labelledby="hero-heading"
    >
      {/* Background Decorative Elements */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute left-[max(45%,25rem)] top-0 h-256 w-512 -translate-x-1/2 stroke-gray-200 mask-[radial-gradient(64rem_64rem_at_top,white,transparent)]">
          <svg className="h-full w-full" aria-hidden="true">
            <defs>
              <pattern
                id="hero-grid"
                width={200}
                height={200}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth={0} fill="url(#hero-grid)" />
          </svg>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-semibold mb-6"
          >
            <Sparkles className="w-3 h-3" />
            <span>AI-Powered Exam Preparation</span>
          </motion.div>

          <motion.h1
            id="hero-heading"
            variants={itemVariants}
            className="text-4xl font-extrabold tracking-tight text-navy sm:text-6xl"
          >
            Master Any Exam with <span className="text-primary">Confidence</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="mt-6 text-lg leading-8 text-gray-600">
            QuizArena uses intelligent adaptive learning to help you crush your certifications. Join
            thousands of successful students today.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <a
              href="/register"
              className="rounded-xl bg-primary px-8 py-4 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started for Free
            </a>
            <a
              href="#features"
              className="text-sm font-semibold leading-6 text-navy hover:text-primary transition-colors flex items-center gap-1"
            >
              See how it works <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            variants={itemVariants}
            className="mt-16 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
                >
                  <div className="w-full h-full bg-linear-to-br from-gray-300 to-gray-400" />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              <span className="font-bold text-navy">4.9/5</span> from over 10,000+ happy students
            </p>
          </motion.div>
        </motion.div>

        {/* Feature Cards / Visuals */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            {
              icon: BrainCircuit,
              title: "Adaptive Learning",
              desc: "Our AI adjusts to your weak areas automatically.",
            },
            {
              icon: Trophy,
              title: "Proven Results",
              desc: "94% of our users pass their exams on the first try.",
            },
            {
              icon: CheckCircle2,
              title: "Verified Questions",
              desc: "Expert-reviewed question bank for 500+ certifications.",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-6">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
