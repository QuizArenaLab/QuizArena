import { prisma } from "@/lib/prisma";
import { cache } from "react";

export class ProfileService {
  /**
   * Retrieves a cached minimal user profile for application shell/layouts.
   * Cached for the duration of the request.
   */
  static getShellProfile = cache(async (userId: string) => {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { examCategory: true, name: true, image: true, username: true },
    });
  });

  /**
   * Retrieves a cached full user profile.
   * Cached for the duration of the request.
   */
  static getFullProfile = cache(async (userId: string) => {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        categoryPerformance: true,
      },
    });
  });

  /**
   * Retrieves cached notification preferences.
   * Cached for the duration of the request.
   */
  static getNotificationPrefs = cache(async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { notificationPrefs: true },
    });
    return user?.notificationPrefs;
  });

  /**
   * Retrieves a cached settings profile.
   * Cached for the duration of the request.
   */
  static getSettingsProfile = cache(async (userId: string) => {
    return prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true, sessions: true },
    });
  });
}
