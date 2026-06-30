/**
 * Inspector Registry
 * 
 * Supports dynamic registration of Inspector panels (Summary, Health, Readiness, etc.)
 * Avoids conditional rendering spread across UI components.
 */
import React from 'react';

export interface InspectorPanel {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  order: number;
}

class InspectorRegistryService {
  private panels: Map<string, InspectorPanel> = new Map();

  registerPanel(panel: InspectorPanel) {
    if (this.panels.has(panel.id)) {
      console.warn(`[InspectorRegistry] Panel ${panel.id} is already registered. Overwriting.`);
    }
    this.panels.set(panel.id, panel);
  }

  getPanels(): InspectorPanel[] {
    return Array.from(this.panels.values()).sort((a, b) => a.order - b.order);
  }
}

export const InspectorRegistry = new InspectorRegistryService();
