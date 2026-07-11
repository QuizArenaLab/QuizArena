import { HeaderManifest } from "./HeaderManifest";
import { HeaderCapabilities } from "./HeaderCapabilities";

class HeaderRegistryImpl {
  private headers = new Map<string, HeaderManifest>();

  public register(manifest: HeaderManifest): void {
    if (this.headers.has(manifest.id)) {
      console.warn(
        `HeaderManifest with id '${manifest.id}' is already registered and will be overwritten.`
      );
    }
    this.headers.set(manifest.id, manifest);
  }

  public unregister(id: string): void {
    this.headers.delete(id);
  }

  public find(id: string): HeaderManifest | undefined {
    return this.headers.get(id);
  }

  public list(): HeaderManifest[] {
    return Array.from(this.headers.values());
  }

  public validate(manifest: HeaderManifest): boolean {
    if (!manifest.id || !manifest.title || !manifest.version) {
      return false;
    }
    return true;
  }

  public resolve(id: string): HeaderManifest | null {
    const manifest = this.find(id);
    if (!manifest) return null;
    return manifest;
  }

  public resolveCapabilities(id: string): HeaderCapabilities | null {
    const manifest = this.find(id);
    if (!manifest) return null;

    return {
      title: manifest.supportsTitle,
      subtitle: manifest.supportsSubtitle,
      profileMenu: manifest.supportsProfile,
      notificationBell: manifest.supportsNotifications,
      workspaceSwitcher: manifest.supportsWorkspaceSwitcher,
      actions: manifest.supportsActions,
      responsive: true, // Defaulting responsive support
      rtl: manifest.supportsRTL,
      accessibility: manifest.supportsAccessibility,
    };
  }
}

export const HeaderRegistry = new HeaderRegistryImpl();
