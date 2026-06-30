/**
 * Analyzer Registry
 * 
 * Self-registration interface for all analyzers.
 * Ensures the Decision Pipeline doesn't hardcode dependencies.
 */

import { CompositionGraph } from '../../composer/engine/CompositionEngine';

export type AnalyzerPriority = 
  | 'HIGH' // e.g. Coverage, Difficulty
  | 'MEDIUM' // e.g. Section, Time
  | 'LOW'; // e.g. Recommendations

export interface AnalyzerResult {
  analyzerId: string;
  data: any;
  recommendations?: any[];
  risks?: any[];
  healthScore?: number;
}

export interface IAnalyzer {
  id: string;
  priority: AnalyzerPriority;
  dependsOn: string[]; // e.g. ['sections', 'questions', 'marks']
  analyze(graph: CompositionGraph, previousState?: any): Promise<AnalyzerResult>;
}

class AnalyzerRegistryService {
  private analyzers: Map<string, IAnalyzer> = new Map();

  register(analyzer: IAnalyzer) {
    if (this.analyzers.has(analyzer.id)) {
      console.warn(`[Intelligence] Analyzer ${analyzer.id} is already registered. Overwriting.`);
    }
    this.analyzers.set(analyzer.id, analyzer);
    console.log(`[Intelligence] Registered analyzer: ${analyzer.id}`);
  }

  getAnalyzers(): IAnalyzer[] {
    // Sort by priority (HIGH -> MEDIUM -> LOW)
    const priorityWeight = { 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
    return Array.from(this.analyzers.values()).sort((a, b) => 
      priorityWeight[a.priority] - priorityWeight[b.priority]
    );
  }
}

export const AnalyzerRegistry = new AnalyzerRegistryService();
