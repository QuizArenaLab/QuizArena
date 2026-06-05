"use client";

import { useState } from "react";
import {
  X,
  User,
  Trophy,
  FileText,
  ShieldAlert,
  Clock,
  Shield,
  Ban,
  MessageSquare,
  AlertOctagon
} from "lucide-react";
import type { ReportData } from "@/types/reports";
import { REPORT_TYPE_LABELS, REPORT_PRIORITY_LABELS, REPORT_STATUS_LABELS } from "@/types/reports";

interface ReportInvestigationDrawerProps {
  report: ReportData;
  onClose: () => void;
  onActionComplete: () => void;
}

function getPriorityClasses(priority: string) {
  switch (priority) {
    case "CRITICAL":
      return "bg-red-50 text-red-700 border-red-200";
    case "HIGH":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "MEDIUM":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "LOW":
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ReportInvestigationDrawer({
  report,
  onClose,
  onActionComplete,
}: ReportInvestigationDrawerProps) {
  const [isActioning, setIsActioning] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  
  // Forms states
  const [activeForm, setActiveForm] = useState<"DISMISS" | "WARN" | "RESTRICT" | "SUSPEND" | null>(null);
  const [dismissReason, setDismissReason] = useState("");
  const [warningTemplate, setWarningTemplate] = useState("Spam Warning");
  const [restrictDuration, setRestrictDuration] = useState("7");
  const [restrictReason, setRestrictReason] = useState("");
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendConfirm, setSuspendConfirm] = useState(false);

  async function performAction(actionFn: () => Promise<{ success: boolean; message: string }>) {
    setIsActioning(true);
    setActionMessage("");
    try {
      const result = await actionFn();
      setActionMessage(result.message);
      if (result.success) {
        setTimeout(() => onActionComplete(), 1000);
      }
    } catch {
      setActionMessage("Action failed. Please try again.");
    } finally {
      setIsActioning(false);
    }
  }

  async function handleDismiss() {
    if (!dismissReason) return setActionMessage("Dismissal reason required.");
    const { resolveReport } = await import("@/features/admin/reports/services/reports.service");
    await performAction(() => resolveReport(report.id, "DISMISSED", dismissReason));
  }

  async function handleWarn() {
    if (!report.targetUser) return setActionMessage("No target user to warn.");
    const { warnUser } = await import("@/features/admin/reports/services/reports.service");
    await performAction(() => warnUser(report.targetUser!.id, report.id, warningTemplate));
  }

  async function handleRestrict() {
    if (!report.targetUser) return setActionMessage("No target user to restrict.");
    if (!restrictReason) return setActionMessage("Restriction reason required.");
    const { restrictUser } = await import("@/features/admin/reports/services/reports.service");
    await performAction(() => restrictUser(report.targetUser!.id, report.id, parseInt(restrictDuration), restrictReason));
  }

  async function handleSuspend() {
    if (!report.targetUser) return setActionMessage("No target user to suspend.");
    if (!suspendReason) return setActionMessage("Suspension reason required.");
    if (!suspendConfirm) return setActionMessage("Please confirm suspension.");
    const { suspendUser } = await import("@/features/admin/reports/services/reports.service");
    await performAction(() => suspendUser(report.targetUser!.id, report.id, suspendReason));
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 w-full max-w-[600px] bg-gray-50 z-50 shadow-2xl flex flex-col border-l border-gray-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold text-[#0A1C40]">Investigation: {report.id.slice(0, 8).toUpperCase()}</h2>
          </div>
          <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getPriorityClasses(report.priority)}`}>
            {REPORT_PRIORITY_LABELS[report.priority]} Priority
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Report Details */}
          <section className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Report Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[#0A1C40]">{REPORT_TYPE_LABELS[report.type]}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{REPORT_STATUS_LABELS[report.status]}</span>
              </div>
              <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed">
                {report.reason}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Created: {formatDate(report.createdAt)}</span>
              </div>
            </div>
          </section>

          {/* Reporter & Reported Entity */}
          <div className="grid grid-cols-2 gap-4">
            <section className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Reporter</h3>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                  {report.reportedBy.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#0A1C40] truncate">{report.reportedBy.name || "Anonymous"}</p>
                  <p className="text-[10px] text-gray-400 truncate">{report.reportedBy.email || "No email provided"}</p>
                </div>
              </div>
            </section>

            {report.targetUser && (
              <section className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Reported Entity (User)</h3>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0A1C40] truncate">{report.targetUser.name || "Unknown User"}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${report.targetUser.accountState === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {report.targetUser.accountState}
                    </span>
                  </div>
                </div>
              </section>
            )}
            
            {report.targetChallenge && (
              <section className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Reported Entity (Competition)</h3>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0A1C40] truncate">{report.targetChallenge.title}</p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Evidence / Notes */}
          {(report.description || report.notes.length > 0) && (
            <section className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Evidence & Logs
              </h3>
              <div className="space-y-3">
                {report.description && (
                  <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-xs text-blue-900 leading-relaxed">
                    <strong>User Provided Description:</strong><br/>
                    {report.description}
                  </div>
                )}
                {report.notes.map(note => (
                  <div key={note.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-700">{note.content}</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">By {note.author.name} • {formatDate(note.createdAt)}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Admin Actions */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-[#0A1C40] text-white flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider">Admin Actions</h3>
              <Shield className="w-4 h-4 text-blue-300" />
            </div>

            <div className="p-4 space-y-4 bg-gray-50/50">
              {actionMessage && (
                <div className={`p-3 rounded-lg text-xs font-semibold ${actionMessage.includes("failed") || actionMessage.includes("required") ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"}`}>
                  {actionMessage}
                </div>
              )}

              {/* Action Buttons Grid */}
              {!activeForm && (
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setActiveForm("DISMISS")} className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex flex-col items-center gap-2 shadow-sm">
                    <X className="w-5 h-5 text-gray-400" />
                    Dismiss Report
                  </button>
                  {report.targetUser && (
                    <>
                      <button onClick={() => setActiveForm("WARN")} className="px-4 py-3 bg-white border border-amber-200 rounded-xl text-sm font-semibold text-amber-700 hover:bg-amber-50 transition-colors flex flex-col items-center gap-2 shadow-sm">
                        <ShieldAlert className="w-5 h-5 text-amber-500" />
                        Warn User
                      </button>
                      <button onClick={() => setActiveForm("RESTRICT")} className="px-4 py-3 bg-white border border-orange-200 rounded-xl text-sm font-semibold text-orange-700 hover:bg-orange-50 transition-colors flex flex-col items-center gap-2 shadow-sm">
                        <Clock className="w-5 h-5 text-orange-500" />
                        Restrict User
                      </button>
                      <button onClick={() => setActiveForm("SUSPEND")} className="px-4 py-3 bg-white border border-red-200 rounded-xl text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors flex flex-col items-center gap-2 shadow-sm">
                        <Ban className="w-5 h-5 text-red-500" />
                        Suspend User
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Dismiss Form */}
              {activeForm === "DISMISS" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-700">Dismiss Report</h4>
                    <button onClick={() => setActiveForm(null)} className="text-xs text-blue-600 hover:underline">Cancel</button>
                  </div>
                  <select value={dismissReason} onChange={(e) => setDismissReason(e.target.value)} className="w-full text-sm p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0A1C40]">
                    <option value="">Select dismissal reason...</option>
                    <option value="No Violation">No Violation Detected</option>
                    <option value="Duplicate Report">Duplicate Report</option>
                    <option value="Insufficient Evidence">Insufficient Evidence</option>
                  </select>
                  <button onClick={handleDismiss} disabled={isActioning} className="w-full py-2.5 bg-gray-800 text-white text-sm font-semibold rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50">
                    Confirm Dismissal
                  </button>
                </div>
              )}

              {/* Warn Form */}
              {activeForm === "WARN" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-amber-700">Issue Warning to User</h4>
                    <button onClick={() => setActiveForm(null)} className="text-xs text-blue-600 hover:underline">Cancel</button>
                  </div>
                  <select value={warningTemplate} onChange={(e) => setWarningTemplate(e.target.value)} className="w-full text-sm p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500">
                    <option value="Spam Warning">Spam / Promotion Warning</option>
                    <option value="Conduct Warning">Conduct / Harassment Warning</option>
                    <option value="Competition Abuse Warning">Competition Abuse Warning</option>
                  </select>
                  <button onClick={handleWarn} disabled={isActioning} className="w-full py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50">
                    Send Warning
                  </button>
                </div>
              )}

              {/* Restrict Form */}
              {activeForm === "RESTRICT" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-orange-700">Restrict User Account</h4>
                    <button onClick={() => setActiveForm(null)} className="text-xs text-blue-600 hover:underline">Cancel</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Duration</label>
                      <select value={restrictDuration} onChange={(e) => setRestrictDuration(e.target.value)} className="w-full text-sm p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500">
                        <option value="1">24 Hours</option>
                        <option value="7">7 Days</option>
                        <option value="30">30 Days</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Reason</label>
                      <input type="text" value={restrictReason} onChange={(e) => setRestrictReason(e.target.value)} placeholder="E.g., Repeated cheating..." className="w-full text-sm p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                  </div>
                  <button onClick={handleRestrict} disabled={isActioning} className="w-full py-2.5 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50">
                    Apply Restriction
                  </button>
                </div>
              )}

              {/* Suspend Form */}
              {activeForm === "SUSPEND" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 border-l-4 border-red-500 pl-4 py-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-red-700 flex items-center gap-2">
                      <AlertOctagon className="w-4 h-4" />
                      Permanent Suspension
                    </h4>
                    <button onClick={() => setActiveForm(null)} className="text-xs text-blue-600 hover:underline">Cancel</button>
                  </div>
                  
                  <textarea 
                    value={suspendReason} 
                    onChange={(e) => setSuspendReason(e.target.value)} 
                    placeholder="Provide detailed admin notes for this suspension..."
                    rows={3}
                    className="w-full text-sm p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  />

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={suspendConfirm} 
                      onChange={(e) => setSuspendConfirm(e.target.checked)}
                      className="mt-1 accent-red-600"
                    />
                    <span className="text-xs text-gray-600 font-medium">
                      I understand this action permanently removes the user's access to QuizArena.
                    </span>
                  </label>

                  <button 
                    onClick={handleSuspend} 
                    disabled={isActioning || !suspendConfirm || !suspendReason} 
                    className="w-full py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Execute Suspension
                  </button>
                </div>
              )}

            </div>
          </section>

        </div>
      </div>
    </>
  );
}
