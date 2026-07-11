import { DateManifest } from "./DateManifest";
import { FieldRegistry } from "./FieldRegistry";

class DateRegistryService {
  private manifests: Map<string, DateManifest> = new Map();

  register(manifest: DateManifest): void {
    if (this.manifests.has(manifest.id)) {
      console.warn(`Date component with id ${manifest.id} is already registered. Overwriting.`);
    }
    this.manifests.set(manifest.id, manifest);
    // Bubble up to global field registry
    FieldRegistry.register(manifest);
  }

  get(id: string): DateManifest | undefined {
    return this.manifests.get(id);
  }

  getAll(): DateManifest[] {
    return Array.from(this.manifests.values());
  }

  remove(id: string): void {
    this.manifests.delete(id);
    FieldRegistry.remove(id);
  }
}

export const DateRegistry = new DateRegistryService();
