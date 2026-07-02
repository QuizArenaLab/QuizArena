"use client";

import React from "react";
import { CheckCircle2, Info, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { NotificationType } from "@/shared/types/feedback";

interface NotificationIconProps {
  type: NotificationType;
}

export function NotificationIcon({ type }: NotificationIconProps) {
  switch (type) {
    case "SUCCESS":
      return (
        <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10 text-green-500">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      );
    case "INFORMATION":
      return (
        <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 text-blue-500">
          <Info className="w-5 h-5" />
        </div>
      );
    case "WARNING":
      return (
        <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/10 text-amber-500">
          <AlertTriangle className="w-5 h-5" />
        </div>
      );
    case "ERROR":
      return (
        <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 text-red-500">
          <XCircle className="w-5 h-5" />
        </div>
      );
    case "LOADING":
      return (
        <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-gray-500/10 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      );
    default:
      return null;
  }
}
