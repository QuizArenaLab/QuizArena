"use client";

import { useState, useTransition } from "react";
import { Bell } from "lucide-react";
import type { User as PrismaUser } from "@/generated/prisma";
import toast from "react-hot-toast";
import { updateNotificationPrefsAction } from "@/features/user/services/account";

interface NotificationsRemindersProps {
  user: PrismaUser;
}

export function NotificationsReminders({ user }: NotificationsRemindersProps) {
  const [isPending, startTransition] = useTransition();

  const currentPrefs = typeof (user as any).notificationPrefs === 'object' && (user as any).notificationPrefs !== null
    ? (user as any).notificationPrefs
    : {
        dailyReminder: true,
        challengeAlerts: true,
        rankUpdates: true,
        competitionAnnouncements: true,
        streakProtectionAlert: true,
      };

  const [prefs, setPrefs] = useState(currentPrefs);

  const handleToggle = (key: string, value: boolean) => {
    const updatedPrefs = { ...prefs, [key]: value };
    setPrefs(updatedPrefs);
    
    startTransition(async () => {
      try {
        const result = await updateNotificationPrefsAction({ [key]: value });
        if (result.success) {
          toast.success("Preference saved", { duration: 2000, position: "top-right" });
        } else {
          setPrefs(prefs); // revert on error
          toast.error("Failed to save preference");
        }
      } catch (error) {
        setPrefs(prefs);
        toast.error("Failed to save preference");
      }
    });
  };

  const notificationOptions = [
    { key: "dailyReminder", label: "Daily Reminder" },
    { key: "challengeAlerts", label: "Challenge Alerts" },
    { key: "rankUpdates", label: "Rank Updates" },
    { key: "competitionAnnouncements", label: "Competition Announcements" },
    { key: "streakProtectionAlert", label: "Streak Protection Alert" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
            <Bell className="w-6 h-6 text-navy" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-navy tracking-tight">Notifications & Reminders</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Choose when QuizArena should notify you.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {notificationOptions.map((option) => (
          <div key={option.key} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
            <span className="text-sm font-bold text-gray-700">{option.label}</span>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleToggle(option.key, !prefs[option.key])}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-150 ease-in-out ${
                prefs[option.key] ? 'bg-green-500' : 'bg-gray-200'
              } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-150 ease-in-out ${
                  prefs[option.key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
