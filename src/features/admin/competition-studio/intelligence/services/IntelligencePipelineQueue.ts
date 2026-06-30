/**
 * Intelligence Pipeline Queue
 * 
 * Throttles rapid composition events and dispatches them to the Decision Pipeline
 * based on deterministic SHA-256 fingerprint evaluation.
 */

import { CompositionGraph } from '../../composer/engine/CompositionEngine';
import { FingerprintEngine } from './FingerprintEngine';
import { DecisionPipeline } from './DecisionPipeline';

class IntelligencePipelineQueueService {
  private queueTimeout: NodeJS.Timeout | null = null;
  private currentFingerprint: string | null = null;
  private readonly THROTTLE_MS = 1500;

  async queueAnalysis(graph: CompositionGraph) {
    if (this.queueTimeout) {
      clearTimeout(this.queueTimeout);
    }

    this.queueTimeout = setTimeout(async () => {
      try {
        const nextFingerprint = await FingerprintEngine.generateFingerprint(graph);
        
        if (nextFingerprint === this.currentFingerprint) {
          console.log('[Intelligence] Fingerprint identical, skipping analysis.');
          return; // No meaningful change
        }

        this.currentFingerprint = nextFingerprint;
        console.log(`[Intelligence] New Fingerprint generated: ${nextFingerprint}. Triggering Decision Pipeline.`);
        
        // Trigger the Decision Pipeline
        await DecisionPipeline.execute(graph, nextFingerprint);
        
      } catch (error) {
        console.error('[Intelligence] Pipeline execution failed:', error);
      }
    }, this.THROTTLE_MS);
  }
}

export const IntelligencePipelineQueue = new IntelligencePipelineQueueService();
