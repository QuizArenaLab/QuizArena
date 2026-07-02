"use client";

import React, { useEffect, useState } from "react";
import { NotificationType } from "@/shared/types/feedback";

interface NotificationProgressProps {
  duration: number;
  type: NotificationType;
  isPaused: boolean;
}

export function NotificationProgress({ duration, type, isPaused }: NotificationProgressProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isPaused || duration === 0) return;

    const intervalTime = 10;
    const decreaseAmount = (100 / duration) * intervalTime;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - decreaseAmount;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [duration, isPaused]);

  const getColor = () => {
    switch (type) {
      case "SUCCESS":
        return "bg-green-500/30";
      case "INFORMATION":
        return "bg-blue-500/30";
      case "WARNING":
        return "bg-amber-500/30";
      case "ERROR":
        return "bg-red-500/30";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div className="absolute bottom-0 left-0 h-[3px] w-full bg-gray-50 overflow-hidden rounded-b-2xl">
      <div
        className={`h-full ${getColor()} transition-all duration-100 ease-linear`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
