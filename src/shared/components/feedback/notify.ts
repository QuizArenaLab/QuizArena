import { create } from "zustand";
import {
  NotificationType,
  NotificationPayload,
  ActiveNotification,
  NotificationAction,
} from "@/shared/types/feedback";

interface NotificationState {
  activeNotifications: ActiveNotification[];
  queue: ActiveNotification[];
  addNotification: (payload: NotificationPayload) => string;
  dismissNotification: (id: string) => void;
  processQueue: () => void;
}

const MAX_VISIBLE = 3;

const DURATION_MAP: Record<NotificationType, number> = {
  SUCCESS: 4000,
  INFORMATION: 5000,
  WARNING: 6000,
  ERROR: 8000,
  LOADING: 0, // 0 signifies infinite duration
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  activeNotifications: [],
  queue: [],

  addNotification: (payload) => {
    const id = payload.id || Math.random().toString(36).substring(2, 9);
    const duration = DURATION_MAP[payload.type];

    const newNotification: ActiveNotification = {
      ...payload,
      id,
      duration,
    };

    set((state) => {
      // Check if it already exists in active queue
      const existingIndex = state.activeNotifications.findIndex((n) => n.id === id);
      if (existingIndex >= 0) {
        const updated = [...state.activeNotifications];
        updated[existingIndex] = newNotification;
        return { activeNotifications: updated };
      }

      // Check if it already exists in pending queue
      const queueIndex = state.queue.findIndex((n) => n.id === id);
      if (queueIndex >= 0) {
        const updated = [...state.queue];
        updated[queueIndex] = newNotification;
        return { queue: updated };
      }

      if (state.activeNotifications.length < MAX_VISIBLE) {
        return {
          activeNotifications: [...state.activeNotifications, newNotification],
        };
      } else {
        return {
          queue: [...state.queue, newNotification],
        };
      }
    });

    return id;
  },

  dismissNotification: (id) => {
    set((state) => ({
      activeNotifications: state.activeNotifications.filter((n) => n.id !== id),
    }));
    // Process queue after a slight delay to allow exit animation to finish
    setTimeout(() => {
      get().processQueue();
    }, 200);
  },

  processQueue: () => {
    set((state) => {
      if (state.activeNotifications.length < MAX_VISIBLE && state.queue.length > 0) {
        const next = state.queue[0];
        return {
          activeNotifications: [...state.activeNotifications, next],
          queue: state.queue.slice(1),
        };
      }
      return state;
    });
  },
}));

type NotifyOptions = {
  description?: string;
  action?: NotificationAction;
  id?: string;
};

export const notify = {
  success: (title: string, options?: NotifyOptions) => {
    return useNotificationStore.getState().addNotification({
      type: "SUCCESS",
      title,
      ...options,
    });
  },
  error: (title: string, options?: NotifyOptions) => {
    return useNotificationStore.getState().addNotification({
      type: "ERROR",
      title,
      ...options,
    });
  },
  info: (title: string, options?: NotifyOptions) => {
    return useNotificationStore.getState().addNotification({
      type: "INFORMATION",
      title,
      ...options,
    });
  },
  warning: (title: string, options?: NotifyOptions) => {
    return useNotificationStore.getState().addNotification({
      type: "WARNING",
      title,
      ...options,
    });
  },
  loading: (title: string, options?: NotifyOptions) => {
    return useNotificationStore.getState().addNotification({
      type: "LOADING",
      title,
      ...options,
    });
  },
};
