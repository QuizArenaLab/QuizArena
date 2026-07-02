"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, PanInfo } from "framer-motion";
import { X } from "lucide-react";
import { ActiveNotification } from "@/shared/types/feedback";
import { NotificationIcon } from "./NotificationIcon";
import { NotificationActions } from "./NotificationActions";
import { NotificationProgress } from "./NotificationProgress";
import { cn } from "@/lib/utils";

interface NotificationCardProps {
  notification: ActiveNotification;
  onDismiss: (id: string) => void;
}

export function NotificationCard({ notification, onDismiss }: NotificationCardProps) {
  const [isPaused, setIsPaused] = useState(false);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const remainingTimeRef = useRef<number>(notification.duration);

  const startTimer = (duration: number) => {
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    startTimeRef.current = Date.now();
    dismissTimerRef.current = setTimeout(() => {
      onDismiss(notification.id);
    }, duration);
  };

  const pauseTimer = () => {
    setIsPaused(true);
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    }
  };

  const resumeTimer = () => {
    setIsPaused(false);
    if (remainingTimeRef.current > 0) {
      startTimer(remainingTimeRef.current);
    }
  };

  useEffect(() => {
    // Reset timer state when notification identity or type changes
    if (notification.duration > 0) {
      setTimeout(() => setIsPaused(false), 0);
      remainingTimeRef.current = notification.duration;
      startTimer(notification.duration);
    } else {
      // For infinite duration (e.g. LOADING), clear the timer
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    }

    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification.duration, notification.type, notification.id]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Swipe to dismiss logic
    if (Math.abs(info.offset.x) > 100 || Math.abs(info.offset.y) > 50) {
      onDismiss(notification.id);
    }
  };

  const getAccentColor = () => {
    switch (notification.type) {
      case "SUCCESS":
        return "bg-green-500";
      case "INFORMATION":
        return "bg-blue-500";
      case "WARNING":
        return "bg-amber-500";
      case "ERROR":
        return "bg-red-500";
      case "LOADING":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
      transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      className={cn(
        "relative w-full sm:w-[340px] bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden pointer-events-auto"
      )}
      role="alert"
      aria-live="assertive"
    >
      {/* Accent Strip */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", getAccentColor())} />

      <div className="flex p-3.5 pl-4 gap-3">
        <NotificationIcon type={notification.type} />

        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-gray-900 leading-5">{notification.title}</h3>
            <button
              onClick={() => onDismiss(notification.id)}
              className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 rounded"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {notification.description && (
            <p className="mt-1 text-sm text-gray-500 leading-relaxed">{notification.description}</p>
          )}

          {notification.action && (
            <NotificationActions
              action={notification.action}
              onDismiss={() => onDismiss(notification.id)}
            />
          )}
        </div>
      </div>

      {notification.duration > 0 && (
        <NotificationProgress
          duration={notification.duration}
          type={notification.type}
          isPaused={isPaused}
        />
      )}
    </motion.div>
  );
}
