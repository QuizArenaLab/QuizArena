/**
 * QuizArena — Sovereign Feature Rollouts
 *
 * Barrel export for feature governance utilities.
 */

export { evaluateRollout, isFeatureEnabled } from "./core";
export { createFeatureRollout, enableFeature, rollbackFeature, updateRollout } from "./governance";

import { rollbackFeature } from "./governance";
export const disableFeature = rollbackFeature;
export { getFeatureRolloutsData } from "./analytics";
