/**
 * Publish Gate Engine
 * 
 * The ultimate authority for publishing. Replaces generic DecisionEngine.
 * Determines if the competition may proceed to version freeze.
 */

import { CompositionGraph } from '../../composer/engine/CompositionEngine';
import { ReadinessSnapshot, ReadinessDecision } from '../types/readiness.types';
import { RuleGraph } from './RuleGraph';
import { DomainScoreEngine } from './DomainScoreEngine';
import { BlockingTreeEngine } from './BlockingTreeEngine';
import { EventBus } from '../../studio/bus/EventBus';

class PublishGateEngineService {
  
  async evaluateReadiness(graph: CompositionGraph, fingerprint: string): Promise<ReadinessSnapshot> {
    EventBus.publish('ReadinessEvaluationStarted', { fingerprint });

    const executionPlan = RuleGraph.getExecutionPlan();
    const results = [];

    // Incrementally evaluate rule graph
    for (const rule of executionPlan) {
      const result = await rule.evaluate(graph);
      results.push(result);
    }

    const domainScores = DomainScoreEngine.calculateScores(results);
    const overallScore = DomainScoreEngine.calculateOverallScore(domainScores);
    const blockingTree = BlockingTreeEngine.buildTree(results);
    
    const blockingFailures = results.filter(r => r.isBlocking && r.status === 'FAIL');
    const warningFailures = results.filter(r => !r.isBlocking && r.status === 'FAIL');

    let decision: ReadinessDecision = 'READY';
    if (blockingFailures.length > 0) {
      decision = 'BLOCKED';
    } else if (warningFailures.length > 0) {
      decision = 'READY_WITH_WARNINGS';
    }

    const snapshot: ReadinessSnapshot = {
      fingerprint,
      overallScore,
      decision,
      domainScores,
      blockingIssues: blockingFailures,
      warnings: warningFailures,
      timestamp: Date.now()
    };

    if (decision === 'BLOCKED') {
      EventBus.publish('PublishGateBlocked', snapshot);
    } else {
      EventBus.publish('PublishGatePassed', snapshot);
    }

    EventBus.publish('SnapshotCreated', snapshot);
    EventBus.publish('ReadinessEvaluationCompleted', snapshot);

    return snapshot;
  }
}

export const PublishGateEngine = new PublishGateEngineService();
