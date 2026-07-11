import { WorkspaceManifest } from "./WorkspaceManifest";

export interface WorkspaceLayoutImplementation {
  id: string;
  name: string;
  version: string;
  owner: string;
  responsive: boolean;
  accessibility: boolean;
  registryVersion: string;
  manifest: WorkspaceManifest;
  slots: string[];
}

class WorkspaceRegistryImpl {
  private layouts: Map<string, WorkspaceLayoutImplementation> = new Map();

  register(layout: WorkspaceLayoutImplementation): void {
    if (this.layouts.has(layout.id)) {
      console.warn(`[WorkspaceRegistry] Layout ${layout.id} is already registered. Overwriting.`);
    }
    this.validate(layout);
    this.layouts.set(layout.id, layout);
  }

  unregister(id: string): void {
    this.layouts.delete(id);
  }

  find(id: string): WorkspaceLayoutImplementation | undefined {
    return this.layouts.get(id);
  }

  list(): WorkspaceLayoutImplementation[] {
    return Array.from(this.layouts.values());
  }

  validate(layout: WorkspaceLayoutImplementation): boolean {
    if (!layout.id || !layout.name || !layout.version) {
      throw new Error(`[WorkspaceRegistry] Layout is missing required fields (id, name, version).`);
    }
    if (!layout.manifest) {
      throw new Error(`[WorkspaceRegistry] Layout ${layout.id} is missing a manifest.`);
    }
    
    // Slot Validation
    const slotSet = new Set<string>();
    layout.slots.forEach(slot => {
      if (slotSet.has(slot)) {
        throw new Error(`[WorkspaceRegistry] Layout ${layout.id} has duplicate slot: ${slot}`);
      }
      const allowedSlots = ['navigation', 'header', 'toolbar', 'content', 'aside', 'footer'];
      if (!allowedSlots.includes(slot)) {
        throw new Error(`[WorkspaceRegistry] Layout ${layout.id} has unknown slot: ${slot}`);
      }
      slotSet.add(slot);
    });

    if (layout.manifest.supportsHeader && !slotSet.has('header')) {
      throw new Error(`[WorkspaceRegistry] Layout ${layout.id} claims to support header but is missing Header slot.`);
    }

    return true;
  }
}

export const WorkspaceRegistry = new WorkspaceRegistryImpl();
