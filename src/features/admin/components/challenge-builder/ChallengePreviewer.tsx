"use client";

import { useState } from "react";
import { Clock, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { Button } from '@/shared/ui/button';

export default function ChallengePreviewer({ challenge }: { challenge: any }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  if (challenge.questions.length === 0) {
    return (
      <div className="p-8 text-center border rounded-lg bg-card text-muted-foreground">
        No questions to preview.
      </div>
    );
  }

  const questions = challenge.questions;
  const currentQ = questions[currentIdx].question;
  const total = questions.length;

  return (
    <div className="flex flex-col border rounded-xl overflow-hidden bg-background shadow-lg h-full max-h-[600px]">
      {/* Simulation Header */}
      <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{challenge.title}</h3>
          <p className="text-xs opacity-80">Simulation Mode</p>
        </div>
        <div className="flex items-center space-x-2 bg-black/20 px-3 py-1.5 rounded-md">
          <Clock className="w-4 h-4" />
          <span className="font-mono text-sm">{challenge.durationInMinutes}:00</span>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <div className="flex justify-between items-center text-sm font-medium text-muted-foreground border-b pb-4">
          <span>
            Question {currentIdx + 1} of {total}
          </span>
          <span className="bg-muted px-2 py-1 rounded">{currentQ.marks || 1} Marks</span>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg font-medium leading-relaxed">{currentQ.question}</p>
        </div>

        {/* Options placeholder (Simulation) */}
        <div className="space-y-3 pt-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center space-x-3 border p-4 rounded-lg cursor-not-allowed opacity-60"
            >
              <div className="w-5 h-5 rounded-full border-2" />
              <span className="text-sm">Option {i} (Preview)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="border-t p-4 flex justify-between bg-card">
        <Button
          variant="outline"
          onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Previous
        </Button>

        {currentIdx === total - 1 ? (
          <Button variant="default">Submit Simulation</Button>
        ) : (
          <Button
            variant="default"
            onClick={() => setCurrentIdx((prev) => Math.min(total - 1, prev + 1))}
          >
            Next <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
