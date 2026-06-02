"use client";

import { Calendar, Users, Bell, Clock, ArrowRight, Shield } from "lucide-react";
import { useState } from "react";

export function UpcomingEvents() {
  const [notifiedEvents, setNotifiedEvents] = useState<Record<string, boolean>>({});

  const toggleNotification = (id: string) => {
    setNotifiedEvents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const upcomingEvents = [
    {
      id: "upcoming-1",
      title: "SSC Mega Sprint",
      startsIn: "23h",
      expectedParticipants: "2,000+",
      difficulty: "Intermediate",
      reward: "Leaderboard Badge",
    },
    {
      id: "upcoming-2",
      title: "Weekly Quant Championship",
      startsIn: "2d",
      expectedParticipants: "5,000+",
      difficulty: "Advanced",
      reward: "Cash Prize Pool",
    },
  ];

  return (
    <div className="space-y-4">
      {upcomingEvents.map((event) => (
        <div
          key={event.id}
          className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-gray-300 hover:shadow-sm transition-all"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded uppercase tracking-wider">
                Upcoming
              </span>
              <span className="text-xs font-mono font-bold text-gray-500">
                {event.difficulty}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">{event.title}</h3>
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500 mt-1">
              <div className="flex items-center gap-1.5 text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-md shadow-sm animate-pulse">
                <Clock className="w-3.5 h-3.5" /> Starts In: {event.startsIn}
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-gray-400" /> Expected: {event.expectedParticipants}
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-500" /> Reward: {event.reward}
              </div>
            </div>
          </div>

          <button
            onClick={() => toggleNotification(event.id)}
            className={`shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all w-full md:w-auto ${
              notifiedEvents[event.id]
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Bell className={`w-4 h-4 ${notifiedEvents[event.id] ? "fill-emerald-700 text-emerald-700" : ""}`} />
            {notifiedEvents[event.id] ? "Notification Set" : "Notify Me"}
          </button>
        </div>
      ))}
    </div>
  );
}
