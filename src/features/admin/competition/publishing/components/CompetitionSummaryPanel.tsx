"use client";

import { CompetitionWithRelations } from "../../types";
import { ReadinessScoreGauge } from "./ReadinessScoreGauge";
import { ReadinessScore } from "../validation/types/validation.types";
import { formatDistanceToNow } from "date-fns";

interface CompetitionSummaryPanelProps {
  competition: CompetitionWithRelations;
  readinessScore: ReadinessScore;
}

export function CompetitionSummaryPanel({
  competition,
  readinessScore,
}: CompetitionSummaryPanelProps) {
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-6 border-b border-gray-100 shrink-0">
        <h2 className="text-xl font-bold text-navy mb-1">{competition.title}</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 font-medium">
            {competition.competitionType}
          </span>
          <span>•</span>
          <span>v{competition.version}</span>
        </div>

        <ReadinessScoreGauge score={readinessScore} />

        <div className="mt-4 text-center">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            ${
              readinessScore.level === "READY"
                ? "bg-emerald-100 text-emerald-800"
                : readinessScore.level === "NEARLY_READY"
                  ? "bg-amber-100 text-amber-800"
                  : readinessScore.level === "NEEDS_ATTENTION"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-red-100 text-red-800"
            }`}
          >
            {readinessScore.level.replace("_", " ")}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Content
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Questions</div>
                <div className="font-bold text-navy">
                  {competition.questions.length} / {competition.totalQuestions}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Sections</div>
                <div className="font-bold text-navy">{competition.sections.length}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Duration</div>
                <div className="font-bold text-navy">{competition.durationMinutes}m</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Max Marks</div>
                <div className="font-bold text-navy">{competition.maximumMarks}</div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Business
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm py-1 border-b border-gray-50">
                <span className="text-gray-500">Visibility</span>
                <span className="font-medium text-navy">{competition.visibility}</span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b border-gray-50">
                <span className="text-gray-500">Entry Fee</span>
                <span className="font-medium text-emerald-600">
                  {competition.economics?.entryFee
                    ? `${competition.economics.entryFee} ${competition.economics.currency}`
                    : "Free"}
                </span>
              </div>
              <div className="flex justify-between text-sm py-1 border-b border-gray-50">
                <span className="text-gray-500">Reward Pool</span>
                <span className="font-medium text-amber-600">
                  {competition.economics?.rewardPool
                    ? `${competition.economics.rewardPool} ${competition.economics.currency}`
                    : "None"}
                </span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Metadata
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Created</span>
                <span className="text-gray-900">
                  {formatDistanceToNow(new Date(competition.createdAt), { addSuffix: true })}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Last Updated</span>
                <span className="text-gray-900">
                  {formatDistanceToNow(new Date(competition.updatedAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
