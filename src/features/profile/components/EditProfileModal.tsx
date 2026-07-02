"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import { notify } from '@/shared/feedback/notify';
import { updateProfileAction, updateAvatarAction } from "@/features/user/services/account";
import { AvatarIdentity } from '@/shared/ui/AvatarIdentity';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string | null;
    username: string | null;
    image: string | null;
    examCategory: string | null;
  };
  isGoogleUser: boolean;
}

export function EditProfileModal({ isOpen, onClose, user, isGoogleUser }: EditProfileModalProps) {
  const router = useRouter();
  const { update } = useSession();
  const [name, setName] = useState(user.name || "");
  const [username, setUsername] = useState(user.username || "");
  const [avatarMode, setAvatarMode] = useState<"google" | "monogram">(
    user.image?.endsWith("#monogram") ? "monogram" : user.image ? "google" : "monogram"
  );
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = notify.loading("Updating Profile...");
    try {
      // 1. Update Name and Username
      const profileResult = await updateProfileAction({
        name,
        username,
      });

      if (!profileResult.success) {
        notify.error(profileResult.error || "Failed to update profile", { id: toastId });
        setIsSaving(false);
        return;
      }

      let newImage = user.image;

      // 2. Handle Avatar Preference
      if (isGoogleUser && user.image) {
        if (avatarMode === "monogram" && !user.image.endsWith("#monogram")) {
          newImage = `${user.image}#monogram`;
          await updateAvatarAction(newImage);
        } else if (avatarMode === "google" && user.image.endsWith("#monogram")) {
          newImage = user.image.replace("#monogram", "");
          await updateAvatarAction(newImage);
        }
      }

      // 3. Force NextAuth session update to reflect instantly in the Sidebar/UI
      await update({
        name,
        username,
        image: newImage,
      });

      notify.success("Profile Saved", {
        id: toastId,
        description: "Your profile changes are now live.",
      });
      onClose();
    } catch (error: any) {
      notify.error("Update Failed", {
        id: toastId,
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-navy">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Live Preview */}
          <div className="flex flex-col items-center justify-center p-6 bg-primary/5 rounded-xl border border-primary/10">
            <AvatarIdentity
              name={name || "Aspirant"}
              username={username || "aspirant"}
              image={
                avatarMode === "google" && user.image
                  ? user.image.replace("#monogram", "")
                  : undefined
              }
              examCategory={user.examCategory}
              rankTier="BRONZE"
              size={80}
            />
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-navy">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-navy">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                placeholder="Choose a unique username"
              />
            </div>

            {isGoogleUser && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-navy">Avatar Preference</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setAvatarMode("google")}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      avatarMode === "google"
                        ? "bg-primary/5 border-primary text-primary"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {avatarMode === "google" && <Check className="w-4 h-4" />}
                    Google Photo
                  </button>
                  <button
                    onClick={() => setAvatarMode("monogram")}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      avatarMode === "monogram"
                        ? "bg-primary/5 border-primary text-primary"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {avatarMode === "monogram" && <Check className="w-4 h-4" />}
                    Monogram
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
