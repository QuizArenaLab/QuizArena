/**
 * Rule Graph
 * 
 * Organizes rules into a directed dependency graph.
 * Supports incremental execution of rules (e.g. Metadata -> Composition -> Intelligence -> Publishing).
 */

import { CompositionGraph } from '../../composer/engine/CompositionEngine';
import { RuleResultObject } from './RuleResultObject'; // To be defined

export type RuleDomain = 
  | 'Metadata' 
  | 'Configuration' 
  | 'Composition' 
  | 'Coverage' 
  | 'Difficulty'
  | 'Security'
  | 'Publishing'
  | 'Runtime';

export interface IReadinessRule {
  id: string;
  domain: RuleDomain;
  dependsOn: string[]; // IDs of rules that must execute first
  evaluate(graph: CompositionGraph): Promise<RuleResultObject>;
}

class RuleGraphService {
  private rules: Map<string, IReadinessRule> = new Map();

  register(rule: IReadinessRule) {
    this.rules.set(rule.id, rule);
  }

  getExecutionPlan(): IReadinessRule[] {
    // In production, performs topological sort based on `dependsOn`
    // For now, return ordered array representing the graph traversal
    const orderedDomains: RuleDomain[] = [
      'Metadata',
      'Configuration',
      'Composition',
      'Coverage',
      'Difficulty',
      'Publishing',
      'Runtime'
    ];

    const allRules = Array.from(this.rules.values());
    
    // Sort rules by domain execution order
    return allRules.sort((a, b) => 
      orderedDomains.indexOf(a.domain) - orderedDomains.indexOf(b.domain)
    );
  }
}

export const RuleGraph = new RuleGraphService();
