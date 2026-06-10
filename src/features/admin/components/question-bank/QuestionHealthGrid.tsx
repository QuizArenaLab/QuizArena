import { BookOpen, AlertTriangle, HelpCircle, Eye, Activity, CheckCircle } from "lucide-react";
import type { QuestionBankHealth } from "@/features/admin/services/question-bank-dashboard";

interface QuestionHealthGridProps {
  health: QuestionBankHealth;
}

const examColors: Record<string, string> = {
  SSC: "bg-blue-100 text-blue-800",
  Banking: "bg-emerald-100 text-emerald-800",
  Railways: "bg-amber-100 text-amber-800",
  "State PSC": "bg-violet-100 text-violet-800",
};

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-yellow-100 text-yellow-800",
  Advanced: "bg-red-100 text-red-800",
};

export function QuestionHealthGrid({ health }: QuestionHealthGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Questions By Exam */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-500" />
          Questions By Exam
        </h3>
        {health.byExam.length > 0 ? (
          <div className="space-y-3">
            {health.byExam.map((item) => {
              const total = health.byExam.reduce((sum, i) => sum + i.count, 0);
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
              const color = examColors[item.exam] || "bg-gray-100 text-gray-800";
              return (
                <div key={item.exam} className="flex items-center gap-3">
                  <span
                    className={`${color} text-xs font-bold px-2.5 py-1 rounded-lg min-w-[80px] text-center`}
                  >
                    {item.exam}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 tabular-nums min-w-[50px] text-right">
                    {item.count.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No exam data available</p>
        )}
      </div>

      {/* Questions By Difficulty */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-500" />
          Questions By Difficulty
        </h3>
        {health.byDifficulty.length > 0 ? (
          <div className="space-y-3">
            {health.byDifficulty.map((item) => {
              const total = health.byDifficulty.reduce((sum, i) => sum + i.count, 0);
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
              const color = difficultyColors[item.difficulty] || "bg-gray-100 text-gray-800";
              return (
                <div key={item.difficulty} className="flex items-center gap-3">
                  <span
                    className={`${color} text-xs font-bold px-2.5 py-1 rounded-lg min-w-[100px] text-center`}
                  >
                    {item.difficulty}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 tabular-nums min-w-[50px] text-right">
                    {item.count.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No difficulty data available</p>
        )}
      </div>

      {/* Health Metrics & Alerts */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
          Health Metrics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex items-center gap-4">
            <div className="bg-indigo-100 p-2.5 rounded-xl">
              <Activity className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-700 tabular-nums">
                {health.averageHealthScore} / 100
              </p>
              <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">
                Avg Health Score
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-center gap-4">
            <div className="bg-emerald-100 p-2.5 rounded-xl">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-700 tabular-nums">
                {health.excellentQuestions.toLocaleString()}
              </p>
              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">
                Excellent Questions
              </p>
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 flex items-center gap-4">
            <div className="bg-rose-100 p-2.5 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-rose-700 tabular-nums">
                {health.lowHealthQuestions.toLocaleString()}
              </p>
              <p className="text-xs font-medium text-rose-600 uppercase tracking-wider">
                Low Health Score
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 mt-6 flex items-center gap-2">
          Operational Alerts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-center gap-4">
            <div className="bg-amber-100 p-2.5 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-700 tabular-nums">
                {health.missingExplanation.toLocaleString()}
              </p>
              <p className="text-xs font-medium text-amber-600 uppercase tracking-wider">
                Missing Explanation
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4">
            <div className="bg-slate-100 p-2.5 rounded-xl">
              <HelpCircle className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-700 tabular-nums">
                {health.unusedQuestions.toLocaleString()}
              </p>
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wider">
                Unused Questions
              </p>
            </div>
          </div>

          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5 flex items-center gap-4">
            <div className="bg-violet-100 p-2.5 rounded-xl">
              <Eye className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-violet-700 tabular-nums">
                {health.pendingReview.toLocaleString()}
              </p>
              <p className="text-xs font-medium text-violet-600 uppercase tracking-wider">
                Pending Review
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
