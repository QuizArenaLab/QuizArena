import React, { ReactNode } from "react";

export interface UserProfileMenuProps {
  avatarUrl?: string;
  displayName?: string;
  role?: string;
  organization?: string;
  menuSections?: ReactNode; // A placeholder for passing menu items
  className?: string;
}
