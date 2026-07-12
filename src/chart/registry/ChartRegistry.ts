import { ChartManifest } from "./ChartManifest";
import { ChartCapabilities } from "./ChartCapabilities";

class ChartRegistryService {
  private manifests: Map<string, ChartManifest> = new Map();

  register(manifest: ChartManifest): void {
    if (this.manifests.has(manifest.metadata.id)) {
      console.warn(`Chart with id ${manifest.metadata.id} is already registered. Overwriting.`);
    }
    this.manifests.set(manifest.metadata.id, manifest);
  }

  unregister(id: string): void {
    this.manifests.delete(id);
  }

  find(id: string): ChartManifest | undefined {
    return this.manifests.get(id);
  }

  list(): ChartManifest[] {
    return Array.from(this.manifests.values());
  }

  validate(manifest: ChartManifest): boolean {
    return !!(
      manifest.metadata &&
      manifest.metadata.id &&
      manifest.capabilities &&
      manifest.layout
    );
  }

  resolve(id: string): ChartManifest {
    const manifest = this.find(id);
    if (!manifest) {
      throw new Error(`ChartManifest with id ${id} not found.`);
    }
    return manifest;
  }

  resolveCapabilities(id: string): ChartCapabilities {
    return this.resolve(id).capabilities;
  }
}

export const ChartRegistry = new ChartRegistryService();
