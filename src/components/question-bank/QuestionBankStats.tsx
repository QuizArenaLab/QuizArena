import {
  FileText,
  Eye,
  CheckCircle2,
  XCircle,
  Archive,
  Flag,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import type { QuestionBankStats } from "@/actions/question-bank";

interface QuestionBankStatsProps {
  stats: QuestionBankStats;
}

const STAT_CARDS = [
  {
    key: "total" as const,
    label: "Total Questions",
    icon: BookOpen,
    gradient: "from-slate-500 to-slate-700",
    bgGlow: "bg-slate-50",
  },
  {
    key: "draft" as const,
    label: "Drafts",
    icon: FileText,
    gradient: "from-gray-400 to-gray-600",
    bgGlow: "bg-gray-50",
  },
  {
    key: "review" as const,
    label: "Pending Review",
    icon: Eye,
    gradient: "from-violet-500 to-purple-600",
    bgGlow: "bg-violet-50",
  },
  {
    key: "approved" as const,
    label: "Approved",
    icon: CheckCircle2,
    gradient: "from-emerald-500 to-green-600",
    bgGlow: "bg-emerald-50",
  },
  {
    key: "rejected" as const,
    label: "Rejected",
    icon: XCircle,
    gradient: "from-red-500 to-rose-600",
    bgGlow: "bg-red-50",
  },
  {
    key: "flagged" as const,
    label: "Flagged",
    icon: Flag,
    gradient: "from-orange-500 to-amber-600",
    bgGlow: "bg-orange-50",
  },
  {
    key: "archived" as const,
    label: "Archived",
    icon: Archive,
    gradient: "from-slate-400 to-zinc-500",
    bgGlow: "bg-slate-50",
  },
  {
    key: "totalActive" as const,
    label: "Active Pool",
    icon: TrendingUp,
    gradient: "from-blue-500 to-cyan-600",
    bgGlow: "bg-blue-50",
  },
];

export function QuestionBankStatsCards({ stats }: QuestionBankStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {STAT_CARDS.map((card) => {
        const Icon = card.icon;
        const value = stats[card.key];
        const isHighlight = card.key === "review" && value > 0;

        return (
          <div
            key={card.key}
            className={`relative overflow-hidden rounded-xl border bg-white p-4 transition-all duration-200 hover:shadow-md ${
              isHighlight ? "border-violet-300 ring-2 ring-violet-100" : "border-gray-200"
            }`}
          >
            {/* Glow indicator for pending reviews */}
            {isHighlight && (
              <div className="absolute top-0 right-0 w-2 h-2 bg-violet-500 rounded-full m-2 animate-pulse" />
            )}

            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-lg bg-linear-to-br ${card.gradient} flex items-center justify-center shadow-sm`}
              >
                <Icon className="w-4.5 h-4.5 text-white" />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900 tracking-tight">
                {value.toLocaleString()}
              </p>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {card.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
