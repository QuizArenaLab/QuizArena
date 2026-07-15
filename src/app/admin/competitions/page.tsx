"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CompetitionDTO } from "@/features/competitions/types/dto";
import { Plus, Search, Trophy, MoreVertical, Edit2, Play, CheckCircle2, Clock } from "lucide-react";

export default function CompetitionsList() {
  const [competitions, setCompetitions] = useState<CompetitionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/competitions")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch competitions");
        return res.json();
      })
      .then((data) => {
        setCompetitions(data.data || []);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (state: string) => {
    switch (state.toLowerCase()) {
      case "published":
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Published
          </span>
        );
      case "draft":
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
            <Clock className="w-3 h-3 mr-1" /> Draft
          </span>
        );
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Competitions</h1>
          <p className="text-gray-400 mt-1">Manage and create your tournaments and challenges.</p>
        </div>
        <Link href="/admin/competitions/new">
          <button className="inline-flex items-center justify-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] active:scale-95">
            <Plus className="w-5 h-5 mr-2" />
            Create Competition
          </button>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#121214] border border-gray-800/60 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search competitions..."
            className="w-full bg-[#0A0A0B] border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      {/* Data Table / List */}
      <div className="bg-[#121214] border border-gray-800/60 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-gray-400 space-y-4">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p>Loading competitions...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-4">
              <span className="text-red-400 text-xl font-bold">!</span>
            </div>
            <h3 className="text-lg font-medium text-white">Failed to load</h3>
            <p className="text-gray-400 mt-1">{error}</p>
          </div>
        ) : competitions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No competitions yet</h3>
            <p className="text-gray-400 max-w-sm mb-6">
              You haven&apos;t created any competitions. Click the button above to get started.
            </p>
            <Link href="/admin/competitions/new">
              <button className="inline-flex items-center text-sm px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-gray-700 hover:border-gray-600">
                Create your first competition
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#0A0A0B] text-gray-400 border-b border-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Competition
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    State
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {competitions.map((comp) => (
                  <tr key={comp.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mr-4 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                          <Trophy className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-100">{comp.title}</div>
                          <div className="text-xs text-gray-500">{comp.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="capitalize text-gray-400">{comp.competitionType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(comp.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="p-2 text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                          title="Publish/Start"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
                          title="More"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
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
