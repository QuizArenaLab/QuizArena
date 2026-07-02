"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { NotificationCard } from "./NotificationCard";
import { useNotificationStore } from "./notify";

export function NotificationCenter() {
  const { activeNotifications, dismissNotification } = useNotificationStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed z-100 top-4 inset-x-0 mx-auto w-[90%] max-w-[320px] sm:inset-auto sm:top-6 sm:right-6 sm:mx-0 sm:w-auto sm:max-w-none flex flex-col gap-3 pointer-events-none items-center sm:items-end"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {activeNotifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onDismiss={dismissNotification}
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
