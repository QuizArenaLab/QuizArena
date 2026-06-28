"use client";

import { useState, useEffect } from "react";
import { CheckSquare, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface MandatoryInstructionsProps {
  competitionId: string;
  version: number;
}

export function MandatoryInstructions({ competitionId, version }: MandatoryInstructionsProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [hasPreviouslyAccepted, setHasPreviouslyAccepted] = useState(false);

  const storageKey = `qa_instructions_accepted_${competitionId}_v${version}`;

  useEffect(() => {
    const isAccepted = localStorage.getItem(storageKey);
    if (isAccepted === "true") {
      setAcknowledged(true);
      setHasPreviouslyAccepted(true);
    }
  }, [storageKey]);

  const handleToggle = () => {
    if (hasPreviouslyAccepted) return; // don't let them un-check if previously accepted
    
    const newState = !acknowledged;
    setAcknowledged(newState);
    if (newState) {
      localStorage.setItem(storageKey, "true");
    } else {
      localStorage.removeItem(storageKey);
    }
  };

  const instructions = [
    "Read every question carefully.",
    "Do not refresh repeatedly.",
    "Timer cannot be paused.",
    "Answers are auto-saved.",
    "Do not copy content."
  ];

  if (hasPreviouslyAccepted) {
    return (
      <section className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Instructions Acknowledged</h2>
          <p className="text-sm text-slate-400 mt-1">You have already accepted the instructions for this version.</p>
        </div>
        <CheckSquare className="w-6 h-6 text-green-500" />
      </section>
    );
  }

  return (
    <section className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6">Mandatory Instructions</h2>
      <ul className="space-y-3 mb-6">
        {instructions.map((inst, idx) => (
          <li key={idx} className="flex items-start gap-2 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
            <span className="text-sm leading-relaxed">{inst}</span>
          </li>
        ))}
      </ul>

      <button 
        onClick={handleToggle}
        className={cn(
          "w-full flex items-center justify-center gap-3 p-4 rounded-xl border transition-all",
          acknowledged 
            ? "bg-green-500/10 border-green-500/30 text-green-400" 
            : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300"
        )}
      >
        {acknowledged ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
        <span className="font-semibold">I acknowledge and accept these instructions</span>
      </button>
    </section>
  );
}
