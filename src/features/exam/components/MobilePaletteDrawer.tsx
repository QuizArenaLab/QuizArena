"use client";

/**
 * QuizArena — Mobile Palette Drawer
 *
 * Bottom sheet drawer for question palette on mobile.
 * Slides up with backdrop overlay.
 * Auto-closes on question selection.
 */

import { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { QuestionPalette } from "./QuestionPalette";
import type { PaletteState } from "@/types/exam";

interface MobilePaletteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  totalQuestions: number;
  getPaletteState: (index: number) => PaletteState;
  onSelectQuestion: (index: number) => void;
  answeredCount: number;
  unansweredCount: number;
  notVisitedCount: number;
}

export function MobilePaletteDrawer({
  isOpen,
  onClose,
  totalQuestions,
  getPaletteState,
  onSelectQuestion,
  answeredCount,
  unansweredCount,
  notVisitedCount,
}: MobilePaletteDrawerProps) {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  const handleSelectQuestion = (index: number) => {
    onSelectQuestion(index);
    onClose(); // Auto-close on selection
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm exam-drawer-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="absolute bottom-0 left-0 right-0 exam-drawer-slide">
        <div className="bg-slate-900 border-t border-slate-700 rounded-t-2xl max-h-[75vh] overflow-y-auto">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-slate-700" />
          </div>

          {/* Close button */}
          <div className="flex items-center justify-between px-5 py-2">
            <span className="text-sm font-semibold text-slate-300">Question Palette</span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
              aria-label="Close palette"
            >
              <X size={18} />
            </button>
          </div>

          {/* Palette Content */}
          <QuestionPalette
            totalQuestions={totalQuestions}
            getPaletteState={getPaletteState}
            onSelectQuestion={handleSelectQuestion}
            answeredCount={answeredCount}
            unansweredCount={unansweredCount}
            notVisitedCount={notVisitedCount}
            compact
            className="border-0 rounded-none bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
