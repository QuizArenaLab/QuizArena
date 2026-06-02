"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * QuizArena — Page Transition Wrapper
 *
 * Provides smooth exit/enter animations between pages:
 * - Exit:  opacity 1→0, translateY 0→-8px,  120ms ease-out
 * - Enter: opacity 0→1, translateY 12px→0,  200ms ease-out
 *
 * Used in (user)/template.tsx to wrap all authenticated page content.
 * The sidebar remains persistent — only the content area transitions.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.2, ease: "easeOut" },
        }}
        exit={{
          opacity: 0,
          y: -8,
          transition: { duration: 0.12, ease: "easeOut" },
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
