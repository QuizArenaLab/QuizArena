"use server";

import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ExamCategory, PreparationLevel } from "@/generated/prisma";
import { hash } from "bcryptjs";

/**
 * Update user's name
 */
export async function updateNameAction(name: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name },
  });

  revalidatePath("/settings");
  return { success: true };
}

/**
 * Update user's username
 */
export async function updateUsernameAction(username: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Check if username is taken
  const existing = await prisma.user.findUnique({
    where: { username },
  });

  if (existing && existing.id !== session.user.id) {
    return { success: false, error: "Username is already taken" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { username },
  });

  revalidatePath("/settings");
  return { success: true };
}

/**
 * Update user's avatar (placeholder logic)
 */
export async function updateAvatarAction(imageUrl: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: imageUrl },
  });

  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Update user's password (placeholder logic)
 */
export async function updatePasswordAction(newPassword: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (!newPassword || newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const hashedPassword = await hash(newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  });

  return { success: true };
}

/**
 * Delete User Account
 */
export async function deleteAccountAction(confirmText: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Validate confirmation text matches "{username}/delete"
  const expectedText = `${session.user.username}/delete`;
  if (confirmText !== expectedText) {
    return { success: false, error: "Confirmation text does not match" };
  }

  // Save the latest event (audit log)
  try {
    const { logSecurityEvent } = await import("@/features/super-admin/services/audit/index");
    await logSecurityEvent("ACCOUNT_DELETED", "CRITICAL", session.user.id);
  } catch (e) {
    // Ignore if audit log fails
  }

  await prisma.user.delete({
    where: { id: session.user.id },
  });

  return { success: true };
}

/**
 * Log Out Action (Saves the event before client signs out)
 */
export async function logOutAction() {
  const session = await auth();
  if (!session?.user?.id) return { success: true }; // Already logged out

  // Save the latest event
  try {
    const { logSecurityEvent } = await import("@/features/super-admin/services/audit/index");
    await logSecurityEvent("USER_LOGOUT", "LOW", session.user.id);
  } catch (e) {
    // Ignore
  }

  return { success: true };
}

/**
 * Update full profile (name, username, email, image)
 */
export async function updateProfileAction(data: {
  name?: string;
  username?: string;
  email?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Prevent empty strings for required fields
  if (data.name !== undefined && data.name.trim() === "") {
    return { success: false, error: "Name cannot be empty" };
  }
  if (data.username !== undefined && data.username.trim() === "") {
    return { success: false, error: "Username cannot be empty" };
  }
  if (data.email !== undefined && data.email.trim() === "") {
    return { success: false, error: "Email cannot be empty" };
  }

  // If changing username, check if it's taken
  if (data.username) {
    const existing = await prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existing && existing.id !== session.user.id) {
      return { success: false, error: "Username is already taken" };
    }
  }

  // If changing email, check if it's taken
  if (data.email) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing && existing.id !== session.user.id) {
      return { success: false, error: "Email is already in use" };
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data,
  });

  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Update Preparation Preferences
 */
export async function updatePreferencesAction(data: {
  examCategory?: ExamCategory;
  preparationLevel?: PreparationLevel;
  dailyPracticeGoal?: number;
  recommendationEngine?: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      examCategory: data.examCategory,
      preparationLevel: data.preparationLevel,
      dailyPracticeGoal: data.dailyPracticeGoal,
      recommendationEngine: data.recommendationEngine,
    },
  });

  revalidatePath("/settings");
  return { success: true };
}

/**
 * Update Notification Preferences
 */
export async function updateNotificationPrefsAction(prefs: Record<string, boolean>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { notificationPrefs: true }
  });

  const currentPrefs = typeof user?.notificationPrefs === 'object' && user?.notificationPrefs !== null
    ? user.notificationPrefs as Record<string, boolean>
    : {
        dailyReminder: true,
        challengeAlerts: true,
        rankUpdates: true,
        competitionAnnouncements: true,
        streakProtectionAlert: true,
      };

  const updatedPrefs = { ...currentPrefs, ...prefs };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { notificationPrefs: updatedPrefs },
  });

  return { success: true };
}

/**
 * Sign Out Other Devices
 */
export async function signOutOtherDevicesAction() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("authjs.session-token")?.value || cookieStore.get("__Secure-authjs.session-token")?.value;
  
  if (sessionToken) {
    await prisma.session.deleteMany({
      where: {
        userId: session.user.id,
        sessionToken: {
          not: sessionToken
        }
      }
    });
  } else {
    await prisma.session.deleteMany({
      where: {
        userId: session.user.id
      }
    });
  }
  
  return { success: true };
}
