/**
 * Decision Pipeline
 * 
 * Orchestrates the analyzers based on defined dependencies.
 * Executes incrementally, producing the final Intelligence Snapshot.
 */

import { CompositionGraph } from '../../composer/engine/CompositionEngine';
import { AnalyzerRegistry } from './AnalyzerRegistry';
import { EventBus } from '../../studio/bus/EventBus';

export interface IntelligenceSnapshot {
  fingerprint: string;
  timestamp: number;
  healthScore: number;
  recommendations: any[];
  risks: any[];
  metrics: Record<string, any>;
}

class DecisionPipelineService {
  private lastSnapshot: IntelligenceSnapshot | null = null;

  async execute(graph: CompositionGraph, fingerprint: string) {
    console.log(`[Intelligence] Starting Decision Pipeline for ${fingerprint}`);
    EventBus.publish('AnalysisStarted', { fingerprint });

    const analyzers = AnalyzerRegistry.getAnalyzers();
    const metrics: Record<string, any> = {};
    const recommendations: any[] = [];
    const risks: any[] = [];
    let overallHealthScore = 100;

    // Incremental execution logic: In production, we evaluate `analyzer.dependsOn`
    // against the delta of the graph. For now, we execute all sequentially sorted by priority.

    for (const analyzer of analyzers) {
      try {
        const result = await analyzer.analyze(graph, this.lastSnapshot?.metrics[analyzer.id]);
        
        metrics[analyzer.id] = result.data;
        if (result.recommendations) recommendations.push(...result.recommendations);
        if (result.risks) risks.push(...result.risks);
        if (result.healthScore !== undefined) {
          // Weighted aggregation would happen here based on the Engine
          overallHealthScore = Math.min(overallHealthScore, result.healthScore);
        }
      } catch (error) {
        console.error(`[Intelligence] Analyzer ${analyzer.id} failed:`, error);
      }
    }

    const snapshot: IntelligenceSnapshot = {
      fingerprint,
      timestamp: Date.now(),
      healthScore: overallHealthScore,
      recommendations,
      risks,
      metrics
    };

    this.lastSnapshot = snapshot;
    console.log(`[Intelligence] Decision Pipeline completed. Health: ${snapshot.healthScore}`);
    
    EventBus.publish('AnalysisCompleted', snapshot);
    EventBus.publish('SnapshotCreated', snapshot);
    EventBus.publish('HealthChanged', { score: snapshot.healthScore });
  }

  getLastSnapshot(): IntelligenceSnapshot | null {
    return this.lastSnapshot;
  }
}

export const DecisionPipeline = new DecisionPipelineService();
