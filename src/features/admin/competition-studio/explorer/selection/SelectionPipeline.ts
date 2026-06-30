/**
 * Selection Pipeline
 * 
 * Pipeline: Select -> Selection Basket -> Validation -> Duplicate Detection -> Conflict Detection -> Preview Changes -> Commit Selection
 */

import { EventBus } from '../../studio/bus/EventBus';

export interface SelectionState {
  basket: string[];
}

class SelectionPipelineService {
  private basket: Set<string> = new Set();

  select(questionId: string) {
    this.basket.add(questionId);
    EventBus.publish('QuestionSelected', { questionId, total: this.basket.size });
  }

  deselect(questionId: string) {
    this.basket.delete(questionId);
    EventBus.publish('QuestionDeselected', { questionId, total: this.basket.size });
  }

  getBasket(): string[] {
    return Array.from(this.basket);
  }

  async validateSelection(): Promise<boolean> {
    // Validate rules, check max limits, etc.
    return true;
  }

  async detectConflicts(): Promise<{ hasConflict: boolean; warnings: string[] }> {
    // Duplicate Detection & Conflict Detection
    return { hasConflict: false, warnings: [] };
  }

  async commitSelection() {
    const isValid = await this.validateSelection();
    if (!isValid) throw new Error("Selection validation failed");

    const conflicts = await this.detectConflicts();
    if (conflicts.hasConflict) {
      EventBus.publish('DuplicateDetected', conflicts.warnings);
      throw new Error("Conflicts detected");
    }

    // Commit
    EventBus.publish('BasketCommitted', { questions: this.getBasket() });
    this.basket.clear();
  }
}

export const SelectionPipeline = new SelectionPipelineService();
