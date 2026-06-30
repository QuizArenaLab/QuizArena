/**
 * Blocking Tree Engine
 * 
 * Transforms flat rule failures into a hierarchical blocking tree 
 * (Domain -> Subdomain -> Specific Object -> Error).
 */

import { RuleResultObject } from './RuleResultObject';

class BlockingTreeEngineService {
  buildTree(failures: RuleResultObject[]): any {
    const tree: any = {};
    
    // Convert flat rule failures into a tree grouped by affected objects
    failures.filter(f => f.isBlocking).forEach(failure => {
      // In production, we parse `failure.ruleId` or `domain` to build the hierarchy path
      const domainPath = failure.ruleId.split('_')[0] || 'General';
      
      if (!tree[domainPath]) tree[domainPath] = [];
      tree[domainPath].push({
        issue: failure.evidence,
        affected: failure.affectedObjects,
        recommendation: failure.recommendation
      });
    });

    return tree;
  }
}

export const BlockingTreeEngine = new BlockingTreeEngineService();
