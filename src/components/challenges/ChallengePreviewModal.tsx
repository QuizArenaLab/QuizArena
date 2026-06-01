"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Target, Clock, Trophy, Zap, X, ShieldAlert, FileText, Users, Award, Info, Lock } from "lucide-react";
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
    participantsCount?: number;
    isFeatured?: boolean;
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
            className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-gray-50 shrink-0">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {challenge.isFeatured && (
                       <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase tracking-wider flex items-center gap-1">
                         <Award className="w-3 h-3" /> Featured
                       </span>
                    )}
                    <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-wider">
                      {challenge.category
                        ? EXAM_CATEGORY_LABELS[
                            challenge.category as keyof typeof EXAM_CATEGORY_LABELS
                          ] || challenge.category
                        : "Competition"}
                    </span>
                    <span className="px-2.5 py-1 bg-gray-200 text-gray-700 text-[10px] font-bold rounded uppercase tracking-wider">
                      {challenge.difficulty}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-navy leading-tight">{challenge.title}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 -mt-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Target className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Questions</span>
                    </div>
                    <div className="text-lg font-black text-navy">{challenge.totalQuestions}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Duration</span>
                    </div>
                    <div className="text-lg font-black text-navy">{challenge.durationInMinutes}m</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Players</span>
                    </div>
                    <div className="text-lg font-black text-navy">
                       {challenge.participantsCount ||
                        (challenge.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
                          400) +
                          100}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Lock className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Entry</span>
                    </div>
                    <div className="text-lg font-black text-emerald-600">Free</div>
                  </div>
                </div>

                {/* Competition Details */}
                <div className="space-y-6">
                   <div>
                     <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-500" /> Ranking & Rewards
                     </h3>
                     <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-gray-600 font-medium">Ranking Rules</span>
                           <span className="font-bold text-navy">National Percentile Base</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-gray-600 font-medium">Scoring Method</span>
                           <span className="font-bold text-navy">+1 Correct, 0 Incorrect</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-gray-600 font-medium">Reward Information</span>
                           <span className="font-bold text-amber-700">Leaderboard Points & Badge</span>
                        </div>
                     </div>
                   </div>

                   <div>
                     <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-500" /> Competition Rules
                     </h3>
                     <ul className="space-y-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <li className="flex items-start gap-2">
                           <span className="text-primary font-bold mt-0.5">•</span>
                           <span>You only have <strong>one attempt</strong> for this competition.</span>
                        </li>
                        <li className="flex items-start gap-2">
                           <span className="text-primary font-bold mt-0.5">•</span>
                           <span>The timer cannot be paused once started.</span>
                        </li>
                        <li className="flex items-start gap-2">
                           <span className="text-primary font-bold mt-0.5">•</span>
                           <span>Tab switching or minimizing may lead to disqualification.</span>
                        </li>
                     </ul>
                   </div>
                </div>
              </div>

              {/* Footer CTAs */}
              <div className="p-6 border-t border-gray-100 bg-white shrink-0 flex flex-col sm:flex-row gap-3">
                 <button
                   onClick={onClose}
                   className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors order-2 sm:order-1"
                 >
                   Cancel
                 </button>
                 <Link
                   href={`/dashboard/challenges/${challenge.slug}`}
                   className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3.5 px-6 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 order-1 sm:order-2"
                 >
                   Start Challenge <Zap className="w-5 h-5 fill-current/20" />
                 </Link>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
