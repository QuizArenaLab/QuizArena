/**
 * QuizArena — Feature Rollout Core Engine
 *
 * Server-authoritative feature evaluation logic.
 * Middleware-safe, no React context dependencies.
 */

import { prisma } from "@/lib/prisma";
import type {
  RolloutEvaluationContext,
  RolloutEvaluationResult,
  RolloutEnvironments,
  EnvironmentType,
} from "@/types/super-admin-rollouts";
import { RolloutType } from "@/generated/prisma";
import crypto from "crypto";

// Simple MD5 hash to determine percentage bucket (0-99) for a given userId and feature key
// This ensures a user consistently falls into the same bucket for the same feature.
function getRolloutBucket(userId: string, featureKey: string): number {
  const hash = crypto.createHash("md5").update(`${userId}:${featureKey}`).digest("hex");
  return parseInt(hash.substring(0, 8), 16) % 100;
}

function getCurrentEnvironment(): EnvironmentType {
  const env = process.env.NODE_ENV || "development";
  if (env === "production") return "production";
  if (env === "test") return "staging"; // Map test to staging for simplicity, or add staging
  return "development";
}

/**
 * Core evaluation engine for feature flags.
 * Operates strictly on server to guarantee rollout sovereignty.
 */
export async function evaluateRollout(
  featureKey: string,
  context?: RolloutEvaluationContext
): Promise<RolloutEvaluationResult> {
  try {
    const flag = await prisma.featureFlag.findUnique({
      where: { key: featureKey },
    });

    if (!flag || !flag.enabled) {
      return { enabled: false, reason: "GLOBALLY_DISABLED" };
    }

    // 1. Environment Check
    const environments = flag.environments as unknown as RolloutEnvironments | null;
    const currentEnv = context?.environment || getCurrentEnvironment();

    if (environments) {
      const isEnvEnabled = environments[currentEnv];
      if (!isEnvEnabled) {
        return { enabled: false, reason: "ENV_DISABLED" };
      }
    }

    // 2. Type-based Evaluation
    switch (flag.rolloutType) {
      case RolloutType.GLOBAL:
        return { enabled: true, reason: "GLOBAL" };

      case RolloutType.PERCENTAGE:
        if (!context?.userId) {
          // If no user context, fail closed for percentage rollouts
          return { enabled: false, reason: "PERCENTAGE_MISS" };
        }
        const percentage = flag.rolloutValue || 0;
        const bucket = getRolloutBucket(context.userId, featureKey);
        if (bucket < percentage) {
          return { enabled: true, reason: "PERCENTAGE_HIT" };
        }
        return { enabled: false, reason: "PERCENTAGE_MISS" };

      case RolloutType.ROLE_BASED:
        // Assume rolloutValue acts as a binary mask or we parse environments for roles?
        // Since schema has rolloutValue as Int, maybe role levels?
        // For QuizArena, let's say rolloutValue is minimum role level? Or we keep it simpler:
        // If Role is SUPER_ADMIN -> always bypasses check or if it matches a specific role map.
        // For now, if role is passed, we check against a simple mechanism.
        // To be safe, fail closed if not matching exact criteria.
        if (context?.role === "SUPER_ADMIN") {
          return { enabled: true, reason: "ROLE_MATCH" };
        }
        return { enabled: false, reason: "ROLE_MISMATCH" };

      case RolloutType.USER_BASED:
        // Assume environments or a separate table tracks specific users.
        // For MVP, if not SUPER_ADMIN, fail closed.
        if (context?.userId) {
          // You could check against a targeted users table.
        }
        return { enabled: false, reason: "USER_MISMATCH" };

      case RolloutType.ENVIRONMENT:
        // Already checked env above. If type is purely env, we consider it enabled if env passed.
        return { enabled: true, reason: "GLOBAL" };

      default:
        return { enabled: false, reason: "GLOBALLY_DISABLED" };
    }
  } catch (error) {
    console.error(`[FEATURE_ROLLOUT] Failed to evaluate flag ${featureKey}:`, error);
    return { enabled: false, reason: "GLOBALLY_DISABLED" }; // Fail closed
  }
}

/**
 * Simple boolean wrapper for easy condition checks.
 */
export async function isFeatureEnabled(
  featureKey: string,
  context?: RolloutEvaluationContext
): Promise<boolean> {
  const result = await evaluateRollout(featureKey, context);
  return result.enabled;
}
