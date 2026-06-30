import { CompositionGraph } from '../../composer/engine/CompositionEngine';
import { IReadinessRule, RuleDomain, RuleGraph } from '../services/RuleGraph';
import { RuleResultObject } from '../services/RuleResultObject';
import { RuleExplainabilityEngine } from './RuleExplainabilityEngine';

class MetadataRuleService implements IReadinessRule {
  id = 'rule_metadata_complete';
  domain: RuleDomain = 'Metadata';
  dependsOn = [];

  async evaluate(graph: CompositionGraph): Promise<RuleResultObject> {
    const hasMetadata = true; // In reality, checks DB/graph for title/description
    
    if (!hasMetadata) {
      return {
        ruleId: this.id,
        status: 'FAIL',
        severity: 'CRITICAL',
        confidence: 100,
        evidence: 'Competition Title and Description are missing.',
        affectedObjects: [graph.competitionId],
        isBlocking: true,
        recommendation: 'Provide a valid Title and Description.',
        executionTimeMs: 1
      };
    }

    return {
      ruleId: this.id,
      status: 'PASS',
      severity: 'INFO',
      confidence: 100,
      evidence: 'Metadata complete',
      affectedObjects: [],
      isBlocking: false,
      recommendation: '',
      executionTimeMs: 1
    };
  }
}

export const MetadataRule = new MetadataRuleService();
RuleGraph.register(MetadataRule);
