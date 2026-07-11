import { FormManifest } from "./FormManifest";

class FormRegistryService {
  private manifests: Map<string, FormManifest> = new Map();

  register(manifest: FormManifest): void {
    if (this.manifests.has(manifest.metadata.id)) {
      console.warn(`Form with id ${manifest.metadata.id} is already registered. Overwriting.`);
    }
    this.manifests.set(manifest.metadata.id, manifest);
  }

  get(id: string): FormManifest | undefined {
    return this.manifests.get(id);
  }

  getAll(): FormManifest[] {
    return Array.from(this.manifests.values());
  }

  remove(id: string): void {
    this.manifests.delete(id);
  }
}

export const FormRegistry = new FormRegistryService();
