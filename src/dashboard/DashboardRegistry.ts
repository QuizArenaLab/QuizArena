import { DashboardManifest } from "./DashboardManifest";
import { DashboardCapabilities } from "./DashboardCapabilities";

class DashboardRegistryService {
  private manifests: Map<string, DashboardManifest> = new Map();

  register(manifest: DashboardManifest): void {
    if (this.manifests.has(manifest.metadata.id)) {
      console.warn(`Dashboard with id ${manifest.metadata.id} is already registered. Overwriting.`);
    }
    this.manifests.set(manifest.metadata.id, manifest);
  }

  unregister(id: string): void {
    this.manifests.delete(id);
  }

  find(id: string): DashboardManifest | undefined {
    return this.manifests.get(id);
  }

  list(): DashboardManifest[] {
    return Array.from(this.manifests.values());
  }

  validate(manifest: DashboardManifest): boolean {
    return !!(
      manifest.metadata &&
      manifest.metadata.id &&
      manifest.layout &&
      manifest.capabilities
    );
  }

  resolve(id: string): DashboardManifest {
    const manifest = this.find(id);
    if (!manifest) {
      throw new Error(`DashboardManifest with id ${id} not found.`);
    }
    return manifest;
  }

  resolveCapabilities(id: string): DashboardCapabilities {
    const manifest = this.resolve(id);
    return manifest.capabilities;
  }
}

export const DashboardRegistry = new DashboardRegistryService();
