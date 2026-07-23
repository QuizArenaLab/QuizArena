import React from "react";
import { prisma } from "@/lib/prisma";
import { Activity, ShieldAlert, CheckCircle2, Clock, XCircle, TerminalSquare } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BetaMonitoringDashboard() {
  // Fetch Beta Testers (Mock logic: users with "Beta" in name or specific emails)
  const betaTesters = await prisma.user.findMany({
    where: {
      email: { startsWith: "beta" },
    },
    include: {
      attempts: true,
      certificateSnapshots: true,
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "EVALUATED":
      case "WINNER":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "PENDING":
      case "STARTED":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <Activity className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Beta Monitoring</h1>
            <p className="text-gray-400 text-sm">
              Real-time health check of the beta cohort journey
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link href="/super-admin/operations">
            <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium border border-gray-700">
              Back to Operations
            </button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#121214] border border-gray-800 rounded-xl p-5 shadow-sm">
          <div className="text-gray-400 text-sm mb-1 font-medium">Total Beta Testers</div>
          <div className="text-3xl font-bold text-white">{betaTesters.length}</div>
        </div>
        <div className="bg-[#121214] border border-gray-800 rounded-xl p-5 shadow-sm">
          <div className="text-gray-400 text-sm mb-1 font-medium">Started Attempts</div>
          <div className="text-3xl font-bold text-indigo-400">
            {betaTesters.filter((t) => t.attempts.length > 0).length}
          </div>
        </div>
        <div className="bg-[#121214] border border-gray-800 rounded-xl p-5 shadow-sm">
          <div className="text-gray-400 text-sm mb-1 font-medium">Evaluated Attempts</div>
          <div className="text-3xl font-bold text-emerald-400">
            {
              betaTesters.filter((t) => t.attempts.some((a: any) => a.status === "EVALUATED"))
                .length
            }
          </div>
        </div>
        <div className="bg-[#121214] border border-gray-800 rounded-xl p-5 shadow-sm">
          <div className="text-gray-400 text-sm mb-1 font-medium">Certificates Issued</div>
          <div className="text-3xl font-bold text-yellow-400">
            {betaTesters.filter((t) => t.certificateSnapshots.length > 0).length}
          </div>
        </div>
      </div>

      {/* Beta Cohort Table */}
      <div className="bg-[#121214] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-800 bg-black/50 flex justify-between items-center">
          <h2 className="font-semibold text-gray-200">Beta Journey Pipeline</h2>
          <div className="flex items-center text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
            <ShieldAlert className="w-3 h-3 mr-1" /> Live Sync
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#0A0A0B] text-gray-400 border-b border-gray-800 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Beta Tester</th>
                <th className="px-6 py-4 font-medium">Attempt Status</th>
                <th className="px-6 py-4 font-medium">Score</th>
                <th className="px-6 py-4 font-medium">Certificate</th>
                <th className="px-6 py-4 font-medium text-right">Intervene</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {betaTesters.map((tester) => {
                const attempt = tester.attempts[0];
                const cert = tester.certificateSnapshots[0];

                return (
                  <tr key={tester.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-100">{tester.name}</div>
                      <div className="text-xs text-gray-500 font-mono mt-0.5">{tester.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(attempt?.status || "NONE")}
                        <span className="text-gray-400">{attempt?.status || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-indigo-300 font-medium">
                      {attempt?.score !== undefined ? attempt.score : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(cert ? "WINNER" : "NONE")}
                        <span className="text-gray-400">{cert ? "Issued" : "Pending"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-400 hover:text-indigo-300 p-2 rounded hover:bg-indigo-500/10 transition-colors flex items-center justify-end w-full">
                        <TerminalSquare className="w-4 h-4 mr-2" /> Fix
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
