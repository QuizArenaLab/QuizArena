import { KPIManifest } from "./KPIManifest";
import { KPICapabilities } from "./KPICapabilities";

class KPIRegistryService {
  private manifests: Map<string, KPIManifest> = new Map();

  register(manifest: KPIManifest): void {
    if (this.manifests.has(manifest.metadata.id)) {
      console.warn(`KPI with id ${manifest.metadata.id} is already registered. Overwriting.`);
    }
    this.manifests.set(manifest.metadata.id, manifest);
  }

  unregister(id: string): void {
    this.manifests.delete(id);
  }

  find(id: string): KPIManifest | undefined {
    return this.manifests.get(id);
  }

  list(): KPIManifest[] {
    return Array.from(this.manifests.values());
  }

  validate(manifest: KPIManifest): boolean {
    return !!(
      manifest.metadata &&
      manifest.metadata.id &&
      manifest.presentation &&
      manifest.capabilities
    );
  }

  resolve(id: string): KPIManifest {
    const manifest = this.find(id);
    if (!manifest) {
      throw new Error(`KPIManifest with id ${id} not found.`);
    }
    return manifest;
  }

  resolveCapabilities(id: string): KPICapabilities {
    const manifest = this.resolve(id);
    return manifest.capabilities;
  }
}

export const KPIRegistry = new KPIRegistryService();
