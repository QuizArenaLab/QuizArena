"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, AtSign, Save, X } from "lucide-react";
import type { User as PrismaUser } from "@/generated/prisma";
import { notify } from '@/shared/feedback/notify';
import { updateProfileAction } from "@/features/user/services/account";
import { AvatarIdentity } from '@/shared/ui/AvatarIdentity';

interface ProfileWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: PrismaUser;
}

export function ProfileWorkspaceModal({ isOpen, onClose, user }: ProfileWorkspaceModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user.name || "",
    username: user.username || "",
    email: user.email || "",
  });

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
      onClose();
    }
  }, [isPending, pendingToast, onClose]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = notify.loading("Updating profile...");
    startTransition(async () => {
      try {
        const result = await updateProfileAction(formData);
        if (result.success) {
          router.refresh();
          setPendingToast({
            id: toastId,
            title: "Profile Updated",
            desc: "Your profile has been saved successfully.",
          });
        } else {
          notify.error(result.error || "Failed to update profile", { id: toastId });
        }
      } catch (error) {
        notify.error("Failed to update profile", { id: toastId });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <User className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-navy">Edit Profile</h3>
              <p className="text-sm text-gray-500">Update your personal information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Avatar Identity */}
            <div className="flex flex-col items-center justify-center mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center">
              <AvatarIdentity
                name={user.name}
                username={user.username}
                image={user.image}
                examCategory={user.examCategory}
                rankTier="BRONZE" // We can default to Bronze in settings
                size={72}
                className="mb-4"
              />
              <h4 className="text-sm font-bold text-navy mb-1">Avatar Identity</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <AtSign className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Choose a username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-bold text-gray-700">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-8 py-3 bg-navy text-white font-bold rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
              >
                <Save className="w-4 h-4" />
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
