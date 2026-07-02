"use client";

import { useState } from "react";
import { AvatarIdentity } from '@/shared/ui/AvatarIdentity';
import { Shield, LogIn, Calendar, Target, Share2, Flame } from "lucide-react";
import { EditProfileModal } from "./EditProfileModal";

interface ProfileHeroProps {
  user: {
    name: string | null;
    username: string | null;
    image: string | null;
    role: string;
    examCategory: string | null;
    createdAt: Date;
  };
  isGoogleUser: boolean;
}

export function ProfileHero({ user, isGoogleUser }: ProfileHeroProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Format joined date
  const joinedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(user.createdAt));

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden relative">
        {/* Background Graphic */}
        <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-r from-primary/10 via-blue-50/50 to-transparent"></div>
        <div className="relative px-6 py-8 sm:px-10 pt-16">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
            <div className="relative">
              <AvatarIdentity
                name={user.name || "Aspirant"}
                username={user.username || "aspirant"}
                image={user.image}
                examCategory={user.examCategory}
                rankTier="UNRANKED"
                size={120}
              />
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-3xl font-bold text-navy mb-1 tracking-tight">
                  {user.name || "Anonymous Aspirant"}
                </h1>
                <p className="text-gray-500 font-medium">@{user.username || "aspirant"}</p>
              </div>

              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {user.examCategory && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary uppercase tracking-wider">
                    <Target className="w-3.5 h-3.5" />
                    {user.examCategory}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5" />
                  {user.role === "ADMIN" ? "Admin" : "Aspirant"}
                </span>
                {isGoogleUser && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 uppercase tracking-wider">
                    <LogIn className="w-3.5 h-3.5" />
                    Google
                  </span>
                )}
              </div>

              {/* Metadata Row */}
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-2 mt-4 text-xs font-medium text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {joinedDate}
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></div>
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  Level: Beginner
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-6 sm:mt-0">
              <button
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-xs"
                onClick={() => {}}
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-bold text-white bg-navy hover:bg-navy/90 transition-all shadow-md hover:shadow-lg"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        isGoogleUser={isGoogleUser}
      />
    </>
  );
}
