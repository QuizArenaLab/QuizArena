"use client";

import React, { useEffect, useState } from "react";
import { Trophy, Search, CheckCircle2, Clock, MoreVertical, ShieldAlert } from "lucide-react";
import { CompetitionDTO } from "@/features/competitions/types/dto";

export default function SuperAdminCompetitionsPage() {
  const [competitions, setCompetitions] = useState<CompetitionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/competitions")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch global competitions");
        return res.json();
      })
      .then((data) => {
        setCompetitions(data.data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (state: string) => {
    switch (state.toLowerCase()) {
      case "published":
      case "active":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-900/50 text-emerald-400 border border-emerald-800">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Published
          </span>
        );
      case "draft":
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700">
            <Clock className="w-3 h-3 mr-1" /> Draft
          </span>
        );
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <Trophy className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Global Competitions</h1>
            <p className="text-gray-400 text-sm">
              Platform-wide overview of all tournaments and challenges
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#121214] border border-gray-800 rounded-xl mb-6 p-4 flex justify-between items-center">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by ID, slug, or title..."
            className="w-full bg-black border border-gray-800 rounded-lg py-2 pl-9 pr-4 text-sm text-gray-300 focus:outline-none focus:border-indigo-500/50"
          />
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400 bg-black px-3 py-1.5 rounded-lg border border-gray-800">
          <ShieldAlert className="w-4 h-4 text-yellow-500" />
          <span>Super Admin Access</span>
        </div>
      </div>

      <div className="bg-[#121214] border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-500">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            Loading platform competitions...
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-400">
            <p>Error loading competitions: {error}</p>
          </div>
        ) : competitions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No competitions found on the platform.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#0A0A0B] text-gray-400 border-b border-gray-800 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Competition</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Duration</th>
                  <th className="px-6 py-4 font-medium text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {competitions.map((comp) => (
                  <tr key={comp.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-100">{comp.title}</div>
                      <div className="text-xs text-gray-500 font-mono mt-0.5">{comp.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 bg-gray-800/50 px-2 py-1 rounded text-xs">
                        {comp.competitionType}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(comp.status)}</td>
                    <td className="px-6 py-4 text-gray-400">{comp.durationMinutes} min</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-500 hover:text-white p-1.5 rounded bg-transparent hover:bg-gray-800 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
