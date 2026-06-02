// Force IDE refresh
"use client";

import { User, Calendar, Shield, Target } from "lucide-react";
import type { User as PrismaUser } from "@/generated/prisma";
import { format } from "date-fns";
import { useState } from "react";
import { ProfileWorkspaceModal } from "./ProfileWorkspaceModal";
import { AvatarIdentity } from "@/shared/components/AvatarIdentity";

interface AccountHeroProps {
  user: PrismaUser;
  subscriptionPlan?: string;
}

export function AccountHero({ user, subscriptionPlan = "Free Plan" }: AccountHeroProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getDifficultyLabel = (level: string | null) => {
    switch (level) {
      case "BEGINNER":
        return "Beginner";
      case "INTERMEDIATE":
        return "Medium";
      case "ADVANCED":
        return "Hardcore";
      default:
        return "Not Set";
    }
  };

  const getExamLabel = (exam: string | null) => {
    switch (exam) {
      case "SSC":
        return "SSC";
      case "BANKING":
        return "Banking";
      case "RAILWAYS":
        return "Railways";
      case "STATE_PSC":
        return "State PSC";
      default:
        return "Not Set";
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-center flex flex-col items-center transition-all hover:shadow-md duration-300">
        {/* Avatar */}
        <div className="mb-4 flex items-center justify-center">
          <AvatarIdentity
            name={user.name}
            username={user.username}
            image={user.image}
            examCategory={user.examCategory}
            rankTier="BRONZE"
            size={80}
          />
        </div>

        {/* Info */}
        <h2 className="text-xl font-bold text-navy mb-1">{user.name ?? "Unknown User"}</h2>
        <p className="text-sm font-medium text-gray-500 mb-4">@{user.username ?? "user"}</p>

        <div className="flex flex-wrap justify-center items-center gap-2 mb-5">
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-navy">{subscriptionPlan}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-xl">
            <Target className="w-4 h-4 text-green-500" />
            <span className="text-xs font-bold text-green-700">
              {getExamLabel(user.examCategory)} • {getDifficultyLabel(user.preparationLevel)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-500">
              Joined {format(new Date(user.createdAt), "MMM yyyy")}
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-navy text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 shadow-md"
        >
          Edit Profile
        </button>
      </div>

      <ProfileWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
      />
    </>
  );
}
