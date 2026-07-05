"use client";

import { useWizardStore } from "../context/useWizardStore";
import { Award, CheckCircle } from "lucide-react";

export function CompetitionCertificatesStep() {
  const { draftData, updateCertificates, setStep } = useWizardStore();
  const certData = draftData.certificates || {};

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold text-navy flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-600" />
          Certificates
        </h2>
        <p className="text-gray-500 mt-2">
          Configure automated certificates for your competition participants.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 space-y-6">
          <label className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={certData.enableCertificates || false}
              onChange={(e) => updateCertificates({ enableCertificates: e.target.checked })}
              className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <div>
              <span className="font-bold text-navy block">Issue Certificates</span>
              <span className="text-sm text-gray-500">
                Automatically generate and distribute certificates to candidates based on their performance.
              </span>
            </div>
          </label>

          {certData.enableCertificates && (
            <div className="pl-9 space-y-6 animate-in fade-in duration-300">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Passing Threshold (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={certData.passingThreshold || 0}
                  onChange={(e) => updateCertificates({ passingThreshold: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g. 70"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum score required to earn a certificate.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Certificate Template
                </label>
                <select
                  value={certData.certificateTemplateId || ""}
                  onChange={(e) => updateCertificates({ certificateTemplateId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select a template...</option>
                  <option value="template-default">Standard Modern Theme</option>
                  <option value="template-classic">Classic Academic Theme</option>
                  <option value="template-dark">Dark Mode Elite Theme</option>
                </select>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                <CheckCircle className="w-5 h-5 text-yellow-600 shrink-0" />
                <p className="text-sm text-yellow-800">
                  Certificates are securely generated and signed via the QuizArena Certificate Engine upon completion of a successful run.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setStep(4)}
          className="px-6 py-2 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep(6)}
          className="px-6 py-2 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-colors"
        >
          Next: Review
        </button>
      </div>
    </div>
  );
}
