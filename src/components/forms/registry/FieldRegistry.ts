import { FieldManifest } from "./FieldManifest";

class FieldRegistryService {
  private manifests: Map<string, FieldManifest> = new Map();

  register(manifest: FieldManifest): void {
    if (this.manifests.has(manifest.id)) {
      console.warn(`Field with id ${manifest.id} is already registered. Overwriting.`);
    }
    this.manifests.set(manifest.id, manifest);
  }

  get(id: string): FieldManifest | undefined {
    return this.manifests.get(id);
  }

  getAll(): FieldManifest[] {
    return Array.from(this.manifests.values());
  }

  remove(id: string): void {
    this.manifests.delete(id);
  }
}

export const FieldRegistry = new FieldRegistryService();
