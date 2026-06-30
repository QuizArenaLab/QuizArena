/**
 * Module Registry
 * 
 * Supports feature registration for the Workspace Module Loader.
 * Future modules (Overview, Composition, Validation, etc.) register themselves here.
 */
import React from 'react';

export interface StudioModule {
  id: string;
  label: string;
  icon: string; // using string for icon name/identifier for now
  component: React.ComponentType<any>;
}

class ModuleRegistryService {
  private modules: Map<string, StudioModule> = new Map();

  registerModule(module: StudioModule) {
    if (this.modules.has(module.id)) {
      console.warn(`[ModuleRegistry] Module ${module.id} is already registered. Overwriting.`);
    }
    this.modules.set(module.id, module);
  }

  getModule(id: string): StudioModule | undefined {
    return this.modules.get(id);
  }

  getAllModules(): StudioModule[] {
    return Array.from(this.modules.values());
  }
}

export const ModuleRegistry = new ModuleRegistryService();
