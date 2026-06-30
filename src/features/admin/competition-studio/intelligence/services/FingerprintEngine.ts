/**
 * Fingerprint Engine
 * 
 * Generates a deterministic SHA-256 hash for the current assessment composition.
 * Used to detect meaningful changes, avoid redundant analysis, and drive caching.
 */

import { CompositionGraph } from '../../composer/engine/CompositionEngine';

export class FingerprintEngineService {
  
  /**
   * Generates a deterministic SHA-256 fingerprint from a CompositionGraph.
   */
  async generateFingerprint(graph: CompositionGraph): Promise<string> {
    const payload = this.serializeGraph(graph);
    
    // Use Web Crypto API for SHA-256 (Browser & Node 15+ compatible)
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    
    // Convert bytes to hex string
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  /**
   * Serializes only the meaningful fields that affect assessment behavior.
   */
  private serializeGraph(graph: CompositionGraph): string {
    const canonical = {
      c: graph.competitionId,
      s: graph.sections.map(sec => ({
        id: sec.id,
        q: sec.questions.map(q => ({
          id: q.questionId, // Use the actual question snapshot ID
          m: q.marks,
          n: q.negativeMarks
        }))
      }))
    };
    
    return JSON.stringify(canonical);
  }
}

export const FingerprintEngine = new FingerprintEngineService();
