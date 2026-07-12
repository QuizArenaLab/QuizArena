import { DashboardBuilderManifest } from "./DashboardBuilderManifest";
import { DashboardBuilderCapabilities } from "./DashboardBuilderCapabilities";

class DashboardBuilderRegistryImpl {
  private manifests = new Map<string, DashboardBuilderManifest>();

  public register(manifest: DashboardBuilderManifest): void {
    if (this.manifests.has(manifest.id)) {
      console.warn(
        `DashboardBuilderManifest with id '${manifest.id}' is already registered and will be overwritten.`
      );
    }
    this.manifests.set(manifest.id, manifest);
  }

  public unregister(id: string): void {
    this.manifests.delete(id);
  }

  public find(id: string): DashboardBuilderManifest | undefined {
    return this.manifests.get(id);
  }

  public list(): DashboardBuilderManifest[] {
    return Array.from(this.manifests.values());
  }

  public resolveCapabilities(id: string): DashboardBuilderCapabilities | null {
    const manifest = this.find(id);
    if (!manifest) return null;

    return {
      edit: manifest.supportsEdit,
      responsive: manifest.supportsResponsive,
      maxWidgets: manifest.maxWidgets || 100,
    };
  }
}

export const DashboardBuilderRegistry = new DashboardBuilderRegistryImpl();
