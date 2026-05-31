"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Target, Clock, Trophy, Zap, X, ShieldAlert, FileText } from "lucide-react";
import Link from "next/link";
import { EXAM_CATEGORY_LABELS } from "@/lib/onboarding";

interface ChallengePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: {
    id: string;
    title: string;
    slug: string;
    totalQuestions: number;
    durationInMinutes: number;
    difficulty: string;
    category: string | null;
  } | null;
}

export function ChallengePreviewModal({ isOpen, onClose, challenge }: ChallengePreviewModalProps) {
  if (!challenge) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-gray-50/50">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded">
                      {challenge.category
                        ? EXAM_CATEGORY_LABELS[
                            challenge.category as keyof typeof EXAM_CATEGORY_LABELS
                          ] || challenge.category
                        : "General Practice"}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs font-bold rounded">
                      {challenge.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-navy">{challenge.title}</h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 -mt-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Target className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wider">
                        Questions
                      </span>
                    </div>
                    <div className="text-lg font-bold text-navy">{challenge.totalQuestions}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wider">Duration</span>
                    </div>
                    <div className="text-lg font-bold text-navy">
                      {challenge.durationInMinutes} Minutes
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <ShieldAlert className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wider">Attempts</span>
                    </div>
                    <div className="text-lg font-bold text-navy">1</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Zap className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wider">
                        Evaluation
                      </span>
                    </div>
                    <div className="text-lg font-bold text-navy">Instant</div>
                  </div>
                  <div className="col-span-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <Trophy className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wider">Ranking</span>
                    </div>
                    <div className="text-sm font-bold text-navy">National Ranking Enabled</div>
                  </div>
                </div>

                <Link
                  href={`/dashboard/challenges/${challenge.slug}`}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 hover:shadow-primary/30"
                >
                  <FileText className="w-5 h-5 fill-current/20" />
                  Enter Challenge
                </Link>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
