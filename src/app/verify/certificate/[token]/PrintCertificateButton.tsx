"use client";

import { Printer } from "lucide-react";

export function PrintCertificateButton() {
  return (
    <button
      onClick={() => window.print()}
      className="mt-8 flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors mx-auto print:hidden"
    >
      <Printer className="w-5 h-5" />
      Print / Save as PDF
    </button>
  );
}
