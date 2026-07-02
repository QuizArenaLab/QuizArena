"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import type { User as PrismaUser } from "@/generated/prisma";
import { notify } from '@/shared/feedback/notify';
import { updateNotificationPrefsAction } from "@/features/user/services/account";

interface NotificationsRemindersProps {
  user: PrismaUser;
}

export function NotificationsReminders({ user }: NotificationsRemindersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentPrefs =
    typeof (user as any).notificationPrefs === "object" && (user as any).notificationPrefs !== null
      ? (user as any).notificationPrefs
      : {
          dailyReminder: true,
          challengeAlerts: true,
          rankUpdates: true,
          competitionAnnouncements: true,
          streakProtectionAlert: true,
          appUpdates: (user as any).notificationAppUpdates ?? true,
        };

  const [prefs, setPrefs] = useState(currentPrefs);
  const [pendingToast, setPendingToast] = useState<{
    id: string;
    title: string;
    desc?: string;
  } | null>(null);

  useEffect(() => {
    if (!isPending && pendingToast) {
      notify.success(pendingToast.title, {
        id: pendingToast.id,
        description: pendingToast.desc,
      });
      setTimeout(() => setPendingToast(null), 0);
    }
  }, [isPending, pendingToast]);

  const handleToggle = (key: string, value: boolean) => {
    const updatedPrefs = { ...prefs, [key]: value };
    setPrefs(updatedPrefs);

    const toastId = notify.loading("Saving Preference...");
    startTransition(async () => {
      try {
        const result = await updateNotificationPrefsAction({ [key]: value });
        if (result.success) {
          router.refresh();
          setPendingToast({
            id: toastId,
            title: "Preference Saved",
            desc: "Your notification settings have been updated.",
          });
        } else {
          setPrefs(prefs); // revert on error
          notify.error("Failed to save preference", { id: toastId });
        }
      } catch (error) {
        setPrefs(prefs);
        notify.error("Failed to save preference", { id: toastId });
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
            <h3 className="text-xl font-bold text-navy tracking-tight">
              Notifications & Reminders
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">Choose when QuizArena should notify you.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {notificationOptions.map((option) => (
          <div
            key={option.key}
            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-bold text-gray-700">{option.label}</span>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleToggle(option.key, !prefs[option.key])}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-150 ease-in-out ${
                prefs[option.key] ? "bg-green-500" : "bg-gray-200"
              } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-150 ease-in-out ${
                  prefs[option.key] ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
