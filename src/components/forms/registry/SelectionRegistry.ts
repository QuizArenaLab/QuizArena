import { FieldRegistry } from "./FieldRegistry";
import { FieldManifest } from "./FieldManifest";
import { SelectionManifest } from "./SelectionManifest";

export interface SelectionFieldManifest extends FieldManifest {
  selectionCapabilities: SelectionManifest;
}

class SelectionRegistryService {
  private manifests: Map<string, SelectionFieldManifest> = new Map();

  register(manifest: SelectionFieldManifest): void {
    if (this.manifests.has(manifest.id)) {
      console.warn(`Selection field with id ${manifest.id} is already registered. Overwriting.`);
    }

    // Register the field internally in SelectionRegistry
    this.manifests.set(manifest.id, manifest);

    // Bubble up registration to FieldRegistry
    FieldRegistry.register(manifest);
  }

  get(id: string): SelectionFieldManifest | undefined {
    return this.manifests.get(id);
  }

  getAll(): SelectionFieldManifest[] {
    return Array.from(this.manifests.values());
  }

  remove(id: string): void {
    this.manifests.delete(id);
    FieldRegistry.remove(id);
  }
}

export const SelectionRegistry = new SelectionRegistryService();
