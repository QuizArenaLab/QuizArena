import { Hash } from "lucide-react";

interface QuestionCodeBadgeProps {
  code: string | null;
  compact?: boolean;
}

export function QuestionCodeBadge({ code, compact = false }: QuestionCodeBadgeProps) {
  if (!code) {
    return <span className="text-xs text-gray-400 italic">No code</span>;
  }

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
        {code}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-center w-5 h-5 rounded bg-linear-to-r from-indigo-50 to-violet-50 border border-indigo-100">
        <Hash className="w-3 h-3 text-indigo-500" />
      </div>
      <span className="font-mono text-xs font-bold text-gray-700">{code}</span>
    </div>
  );
}
