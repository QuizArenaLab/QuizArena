import {
  FileText,
  Eye,
  CheckCircle2,
  XCircle,
  Archive,
  Flag,
  TrendingUp,
  BookOpen,
  AlertTriangle,
  Activity,
  ThumbsDown,
  Clock,
  HelpCircle,
  ShieldAlert,
} from "lucide-react";
import type { QuestionBankStats } from "@/features/admin/services/question-bank";

interface QuestionBankStatsProps {
  stats: QuestionBankStats & {
    difficultyDrift?: number;
    retirementCandidates?: number;
    insufficientData?: number;
    highReport?: number;
    healthy?: number;
    overused?: number;
    unused?: number;
  };
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
  {
    key: "duplicates" as const,
    label: "Duplicates Detected",
    icon: AlertTriangle,
    gradient: "from-amber-500 to-yellow-600",
    bgGlow: "bg-amber-50",
  },
  {
    key: "healthy" as const,
    label: "Healthy Questions",
    icon: Activity,
    gradient: "from-teal-500 to-emerald-600",
    bgGlow: "bg-teal-50",
  },
  {
    key: "difficultyDrift" as const,
    label: "Difficulty Drift",
    icon: TrendingUp,
    gradient: "from-orange-500 to-red-600",
    bgGlow: "bg-orange-50",
  },
  {
    key: "retirementCandidates" as const,
    label: "Retirement Candidates",
    icon: Archive,
    gradient: "from-stone-500 to-stone-700",
    bgGlow: "bg-stone-50",
  },
  {
    key: "insufficientData" as const,
    label: "Insufficient Data",
    icon: HelpCircle,
    gradient: "from-slate-300 to-slate-500",
    bgGlow: "bg-slate-50",
  },
  {
    key: "highReport" as const,
    label: "High Reports",
    icon: ShieldAlert,
    gradient: "from-red-500 to-rose-700",
    bgGlow: "bg-red-50",
  },
  {
    key: "overused" as const,
    label: "Overused",
    icon: Clock,
    gradient: "from-indigo-500 to-blue-600",
    bgGlow: "bg-indigo-50",
  },
];

export function QuestionBankStatsCards({ stats }: QuestionBankStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {STAT_CARDS.map((card) => {
        const Icon = card.icon;
        const value = (stats as any)[card.key] ?? 0;
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
