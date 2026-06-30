/**
 * Composition Engine
 * 
 * The absolute source of truth for the Assessment Composer.
 * Maintains the Composition Graph and routes operations through Transactions.
 */

import { CompositionHistoryEngine } from './CompositionHistoryEngine';
import { CompositionBatchEngine } from './CompositionBatchEngine';
import { EventBus } from '../../studio/bus/EventBus';

export interface QuestionNode {
  id: string;
  questionId: string;
  order: number;
  marks: number;
  negativeMarks: number;
}

export interface SectionNode {
  id: string;
  title: string;
  order: number;
  questions: QuestionNode[];
}

export interface CompositionGraph {
  competitionId: string;
  sections: SectionNode[];
}

class CompositionEngineService {
  private graph: CompositionGraph | null = null;

  initialize(competitionId: string, initialSections: SectionNode[]) {
    this.graph = {
      competitionId,
      sections: initialSections
    };
  }

  getGraph(): CompositionGraph | null {
    return this.graph;
  }

  // TRANSACTION: Add Section
  addSection(title: string) {
    if (!this.graph) return;
    
    const newSection: SectionNode = {
      id: `sec_${Date.now()}`,
      title,
      order: this.graph.sections.length,
      questions: []
    };

    // Apply
    this.graph.sections.push(newSection);

    // Queue for persistence
    CompositionBatchEngine.queueOperation('AddSection', newSection);

    // Track History
    CompositionHistoryEngine.push({
      type: 'AddSection',
      description: `Added Section: ${title}`,
      undo: () => {
        if (this.graph) this.graph.sections = this.graph.sections.filter(s => s.id !== newSection.id);
      },
      redo: () => {
        if (this.graph) this.graph.sections.push(newSection);
      }
    });

    EventBus.publish('SectionCreated', newSection);
  }

  // Future Transactions (MoveQuestion, ReplaceQuestion, DeleteSection, etc) would follow the same pattern
}

export const CompositionEngine = new CompositionEngineService();
