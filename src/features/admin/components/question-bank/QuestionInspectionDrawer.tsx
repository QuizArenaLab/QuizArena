import React, { useEffect } from "react";
import { UsageIntelligencePanel } from "./UsageIntelligencePanel";
import { GovernancePanel } from "./GovernancePanel";
import type { QuestionIntelligence } from "@/features/admin/services/question-bank/usage-intelligence";
import { Archive, Ban, History, Flag, X, Shield, Activity } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: any;
  intelligence: QuestionIntelligence | null;
  onDismissRecommendation?: (type: string) => void;
}

export function QuestionInspectionDrawer({
  open,
  onOpenChange,
  question,
  intelligence,
  onDismissRecommendation,
}: Props) {
  const [activeTab, setActiveTab] = React.useState<"USAGE" | "GOVERNANCE">("USAGE");

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open || !question) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />

      {/* Drawer */}
      <div className="relative z-50 w-full sm:w-[600px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Question Inspection</h2>
            <p className="text-sm text-gray-500 mt-1">
              {question.questionCode || "Unknown Code"} • Operational insights and actions
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <Archive className="w-4 h-4 mr-2" /> Archive
            </button>
            <button className="flex items-center justify-center px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors shadow-sm">
              <Ban className="w-4 h-4 mr-2" /> Deactivate
            </button>
            <button className="flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <Flag className="w-4 h-4 mr-2" /> Reports
            </button>
            <button className="flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <History className="w-4 h-4 mr-2" /> History
            </button>
          </div>

          <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Question Content
            </h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {question.question}
            </p>
          </div>

          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("USAGE")}
              className={`flex-1 py-3 text-sm font-bold flex justify-center items-center gap-2 border-b-2 transition-colors ${
                activeTab === "USAGE"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Activity className="w-4 h-4" /> Usage Intelligence
            </button>
            <button
              onClick={() => setActiveTab("GOVERNANCE")}
              className={`flex-1 py-3 text-sm font-bold flex justify-center items-center gap-2 border-b-2 transition-colors ${
                activeTab === "GOVERNANCE"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Shield className="w-4 h-4" /> Governance Lifecycle
            </button>
          </div>

          <div className="pt-2">
            {activeTab === "USAGE" &&
              (intelligence ? (
                <UsageIntelligencePanel
                  intelligence={intelligence}
                  configuredDifficulty={question.difficulty || "UNKNOWN"}
                  onDismissRecommendation={onDismissRecommendation}
                />
              ) : (
                <div className="flex justify-center items-center p-12 border border-gray-200 border-dashed rounded-xl bg-white">
                  <div className="animate-pulse flex items-center text-sm font-medium text-gray-500">
                    <div className="h-4 w-4 bg-gray-400 rounded-full mr-3 animate-bounce"></div>
                    Loading intelligence data...
                  </div>
                </div>
              ))}

            {activeTab === "GOVERNANCE" && <GovernancePanel question={question} />}
          </div>
        </div>
      </div>
    </div>
  );
}
