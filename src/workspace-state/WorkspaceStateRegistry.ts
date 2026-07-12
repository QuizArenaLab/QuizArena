import { WorkspaceStateManifest } from "./WorkspaceStateManifest";
import { WorkspaceStateCapabilities } from "./WorkspaceStateCapabilities";

class WorkspaceStateRegistryImpl {
  private manifests = new Map<string, WorkspaceStateManifest>();

  public register(manifest: WorkspaceStateManifest): void {
    if (this.manifests.has(manifest.id)) {
      console.warn(
        `WorkspaceStateManifest with id '${manifest.id}' is already registered and will be overwritten.`
      );
    }
    this.manifests.set(manifest.id, manifest);
  }

  public unregister(id: string): void {
    this.manifests.delete(id);
  }

  public find(id: string): WorkspaceStateManifest | undefined {
    return this.manifests.get(id);
  }

  public list(): WorkspaceStateManifest[] {
    return Array.from(this.manifests.values());
  }

  public validate(manifest: WorkspaceStateManifest): boolean {
    if (!manifest.id || !manifest.version) {
      return false;
    }
    return true;
  }

  public resolve(id: string): WorkspaceStateManifest | null {
    return this.find(id) || null;
  }

  public resolveCapabilities(id: string): WorkspaceStateCapabilities | null {
    const manifest = this.find(id);
    if (!manifest) return null;

    return {
      loading: manifest.supportsLoading,
      empty: manifest.supportsEmpty,
      error: manifest.supportsError,
      offline: manifest.supportsOffline,
      maintenance: manifest.supportsMaintenance,
      permission: manifest.supportsPermission,
      skeleton: manifest.supportsSkeleton,
      responsive: manifest.responsive,
      accessibility: manifest.accessibility,
    };
  }
}

export const WorkspaceStateRegistry = new WorkspaceStateRegistryImpl();
