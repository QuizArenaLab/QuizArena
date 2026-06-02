"use client";

/**
 * QuizArena — Confirmation Modal for Dangerous Settings
 *
 * Requires explicit confirmation and a reason before
 * modifying critical platform settings.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, ShieldAlert } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  settingKey: string;
  settingDescription: string | null;
  currentValue: string;
  newValue: string;
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  settingKey,
  settingDescription,
  currentValue,
  newValue,
  isLoading = false,
}: ConfirmationModalProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason.trim());
    setReason("");
  };

  const handleClose = () => {
    if (isLoading) return;
    setReason("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#0A1C40]/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <ShieldAlert className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0A1C40]">Confirm Setting Change</h3>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-5 space-y-4">
                {/* Warning */}
                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">
                      This is a critical platform setting
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Changing this setting may affect platform operations. A reason is required.
                    </p>
                  </div>
                </div>

                {/* Setting Details */}
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Setting
                    </p>
                    <p className="text-sm font-semibold text-[#0A1C40] mt-0.5 font-mono">
                      {settingKey}
                    </p>
                    {settingDescription && (
                      <p className="text-xs text-gray-500 mt-1">{settingDescription}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                      <p className="text-xs font-medium text-red-600 uppercase tracking-wider">
                        Current
                      </p>
                      <p className="text-sm font-bold text-red-800 mt-1 break-all">
                        {currentValue}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                      <p className="text-xs font-medium text-green-600 uppercase tracking-wider">
                        New Value
                      </p>
                      <p className="text-sm font-bold text-green-800 mt-1 break-all">{newValue}</p>
                    </div>
                  </div>
                </div>

                {/* Reason Input */}
                <div>
                  <label
                    htmlFor="setting-change-reason"
                    className="text-xs font-medium text-gray-600 uppercase tracking-wider"
                  >
                    Reason for change <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="setting-change-reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Explain why this setting is being changed..."
                    rows={3}
                    disabled={isLoading}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#0A1C40] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E6701E] focus:border-transparent disabled:opacity-50 resize-none transition-all"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#0A1C40] hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!reason.trim() || isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#E6701E] hover:bg-[#d25d15] rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading && (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  Confirm Change
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
