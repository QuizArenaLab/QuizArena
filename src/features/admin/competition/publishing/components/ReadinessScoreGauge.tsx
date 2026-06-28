"use client";

import { motion } from "framer-motion";
import { ReadinessScore } from "../validation/types/validation.types";

export function ReadinessScoreGauge({ score }: { score: ReadinessScore }) {
  const percentage = score.score;

  let color = "text-emerald-500";
  let bg = "text-emerald-100";

  if (score.level === "NEEDS_ATTENTION") {
    color = "text-orange-500";
    bg = "text-orange-100";
  } else if (score.level === "NEARLY_READY") {
    color = "text-amber-500";
    bg = "text-amber-100";
  } else if (score.level === "BLOCKED") {
    color = "text-red-500";
    bg = "text-red-100";
  }

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative w-32 h-32 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          className={`${bg} fill-none`}
          strokeWidth="8"
          stroke="currentColor"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          className={`${color} fill-none drop-shadow-md`}
          strokeWidth="8"
          strokeLinecap="round"
          stroke="currentColor"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-2xl font-black ${color}`}>{percentage}</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Score</span>
      </div>
    </div>
  );
}
