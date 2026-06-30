/**
 * Multi Selection Engine
 * 
 * Selections become first-class state separated from the UI.
 * Supports Single, Range, Section, and Entire Competition selections.
 */

import { EventBus } from '../../studio/bus/EventBus';

export type SelectionType = 'QUESTION' | 'SECTION' | 'COMPETITION';

class MultiSelectionEngineService {
  private selectedIds: Set<string> = new Set();
  private selectionType: SelectionType | null = null;
  private lastSelectedId: string | null = null;

  select(id: string, type: SelectionType, multi: boolean = false) {
    if (!multi) {
      this.selectedIds.clear();
    }
    this.selectedIds.add(id);
    this.selectionType = type;
    this.lastSelectedId = id;
    this.publish();
  }

  deselect(id: string) {
    this.selectedIds.delete(id);
    if (this.selectedIds.size === 0) {
      this.selectionType = null;
      this.lastSelectedId = null;
    }
    this.publish();
  }

  selectAllQuestions(questionIds: string[]) {
    this.selectedIds = new Set(questionIds);
    this.selectionType = 'QUESTION';
    this.publish();
  }

  clearSelection() {
    this.selectedIds.clear();
    this.selectionType = null;
    this.lastSelectedId = null;
    this.publish();
  }

  getSelection() {
    return {
      ids: Array.from(this.selectedIds),
      type: this.selectionType,
    };
  }

  private publish() {
    EventBus.publish('SelectionChanged', this.getSelection());
  }
}

export const MultiSelectionEngine = new MultiSelectionEngineService();
