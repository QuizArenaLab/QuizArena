/**
 * Difference Engine
 * 
 * Compares two snapshots to find regressions and improvements.
 */

import { ReadinessSnapshot } from '../types/readiness.types';
import { EventBus } from '../../studio/bus/EventBus';

class DifferenceEngineService {
  compare(oldSnap: ReadinessSnapshot, newSnap: ReadinessSnapshot) {
    if (newSnap.overallScore > oldSnap.overallScore) {
      EventBus.publish('ReadinessImproved', {
        delta: newSnap.overallScore - oldSnap.overallScore,
        oldScore: oldSnap.overallScore,
        newScore: newSnap.overallScore
      });
    } else if (newSnap.overallScore < oldSnap.overallScore) {
      EventBus.publish('ReadinessRegressed', {
        delta: oldSnap.overallScore - newSnap.overallScore,
        oldScore: oldSnap.overallScore,
        newScore: newSnap.overallScore
      });
    }
  }
}

export const DifferenceEngine = new DifferenceEngineService();
