import React, { useEffect } from "react";
import { ComponentRegistry } from "@/registry";

export interface UserAvatarProps {
  src?: string;
  initials?: string;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ src, initials, className }) => {
  useEffect(() => {
    ComponentRegistry.register({
      id: "user-avatar",
      name: "UserAvatar",
      category: "identity",
      subtype: "identity-profile",
      version: "1.0.0",
      status: "stable",
      owner: "QuizArena",
    });
  }, []);

  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center bg-muted text-muted-foreground ${className || "w-10 h-10"}`}
    >
      {src ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={src} alt="User Avatar" className="w-full h-full object-cover rounded-full" />
      ) : (
        <span className="font-medium text-sm">{initials || "?"}</span>
      )}
    </div>
  );
};
