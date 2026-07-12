import React, { ReactNode } from "react";
import { DashboardSectionPriority } from "../../../dashboard/DashboardTypes";

export interface DashboardSectionProps {
  priority?: DashboardSectionPriority;
  children: ReactNode;
  className?: string;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  priority = DashboardSectionPriority.PRIMARY,
  children,
  className = "",
}) => {
  return (
    <section
      className={`qa-dashboard-section flex flex-col w-full ${className}`}
      data-priority={priority}
    >
      {children}
    </section>
  );
};
