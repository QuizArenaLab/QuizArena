/**
 * Readiness Pipeline
 * 
 * Guards the Publish Gate Engine. Ensures that evaluations only occur 
 * when the fingerprint actually changes, saving unnecessary computation.
 */

import { CompositionGraph } from '../../composer/engine/CompositionEngine';
import { FingerprintEngine } from '../../intelligence/services/FingerprintEngine';
import { PublishGateEngine } from './PublishGateEngine';
import { ReadinessHistoryRepository } from '../repositories/ReadinessHistoryRepository';
import { DifferenceEngine } from './DifferenceEngine';

class ReadinessPipelineService {
  
  async evaluate(graph: CompositionGraph) {
    const fingerprint = await FingerprintEngine.generateFingerprint(graph);
    const lastSnapshot = ReadinessHistoryRepository.getLatestSnapshot();

    if (lastSnapshot && lastSnapshot.fingerprint === fingerprint) {
      console.log('[Readiness] Fingerprint matches last snapshot. Skipping full re-evaluation.');
      return lastSnapshot;
    }

    // Fingerprint changed, execute full evaluation
    const newSnapshot = await PublishGateEngine.evaluateReadiness(graph, fingerprint);
    
    if (lastSnapshot) {
      DifferenceEngine.compare(lastSnapshot, newSnapshot);
    }
    
    ReadinessHistoryRepository.saveSnapshot(newSnapshot);
    return newSnapshot;
  }
}

export const ReadinessPipeline = new ReadinessPipelineService();
