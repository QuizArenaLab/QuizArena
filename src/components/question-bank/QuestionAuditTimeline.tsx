import { Clock, User, ArrowRight } from "lucide-react";

interface AuditEntry {
  id: string;
  questionId: string;
  action: string;
  previousStatus?: string | null;
  nextStatus?: string | null;
  previousVersion?: number | null;
  nextVersion?: number | null;
  actorId: string;
  reason: string | null;
  createdAt: Date;
}

interface QuestionAuditTimelineProps {
  audits: AuditEntry[];
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

const ACTION_STYLES: Record<string, { color: string; bg: string }> = {
  CREATED: { color: "#4F46E5", bg: "#EEF2FF" },
  UPDATED: { color: "#2563EB", bg: "#EFF6FF" },
  SUBMITTED_FOR_REVIEW: { color: "#7C3AED", bg: "#F5F3FF" },
  APPROVED: { color: "#059669", bg: "#ECFDF5" },
  REJECTED: { color: "#DC2626", bg: "#FEF2F2" },
  ARCHIVED: { color: "#64748B", bg: "#F8FAFC" },
  FLAGGED: { color: "#EA580C", bg: "#FFF7ED" },
};

export function QuestionAuditTimeline({ audits }: QuestionAuditTimelineProps) {
  if (audits.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-400">No audit history</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">Audit Trail</h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />

        <div className="space-y-4">
          {audits.map((audit, index) => {
            const style = ACTION_STYLES[audit.action] || {
              color: "#6B7280",
              bg: "#F3F4F6",
            };

            return (
              <div key={audit.id} className="relative flex items-start gap-4 pl-10">
                {/* Timeline dot */}
                <div
                  className="absolute left-2.5 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: style.color, top: "6px" }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="px-2 py-0.5 text-[11px] font-bold rounded-md"
                      style={{
                        backgroundColor: style.bg,
                        color: style.color,
                      }}
                    >
                      {audit.action.replace(/_/g, " ")}
                    </span>
                    {index === 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium bg-indigo-100 text-indigo-600 rounded">
                        Latest
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {audit.actorId.substring(0, 8)}…
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(audit.createdAt)}
                    </span>
                  </div>

                  {audit.reason && (
                    <div className="mt-2 flex items-start gap-1.5">
                      <ArrowRight className="w-3 h-3 text-gray-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-gray-600 italic">{audit.reason}</p>
                    </div>
                  )}

                  {(audit.previousStatus !== audit.nextStatus ||
                    audit.previousVersion !== audit.nextVersion) && (
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                      {audit.previousStatus &&
                        audit.nextStatus &&
                        audit.previousStatus !== audit.nextStatus && (
                          <div className="flex items-center gap-1">
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                              {audit.previousStatus}
                            </span>
                            <ArrowRight className="w-3 h-3" />
                            <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">
                              {audit.nextStatus}
                            </span>
                          </div>
                        )}
                      {audit.previousVersion !== undefined &&
                        audit.nextVersion !== undefined &&
                        audit.previousVersion !== audit.nextVersion && (
                          <div className="flex items-center gap-1 border-l border-gray-200 pl-2 ml-1">
                            <span className="text-gray-400">v{audit.previousVersion}</span>
                            <ArrowRight className="w-3 h-3" />
                            <span className="text-gray-700">v{audit.nextVersion}</span>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
