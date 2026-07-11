import { SearchManifest } from "./SearchManifest";
import { SearchCapabilities } from "./SearchCapabilities";

export interface SearchResolution {
  manifest: SearchManifest;
  capabilities: SearchCapabilities;
}

class SearchRegistryService {
  private manifests: Map<string, SearchManifest> = new Map();
  private capabilities: Map<string, SearchCapabilities> = new Map();

  register(manifest: SearchManifest, capabilities?: SearchCapabilities): void {
    this.manifests.set(manifest.id, manifest);
    if (capabilities) {
      this.capabilities.set(manifest.id, capabilities);
    }
  }

  unregister(id: string): void {
    this.manifests.delete(id);
    this.capabilities.delete(id);
  }

  find(id: string): SearchManifest | undefined {
    return this.manifests.get(id);
  }

  list(): SearchManifest[] {
    return Array.from(this.manifests.values());
  }

  validate(manifest: SearchManifest): boolean {
    return Boolean(manifest.id && manifest.version && manifest.status);
  }

  resolve(id: string): SearchResolution | undefined {
    const manifest = this.find(id);
    if (!manifest) return undefined;

    const capabilities = this.resolveCapabilities(id);

    return { manifest, capabilities };
  }

  resolveCapabilities(id: string): SearchCapabilities {
    return (
      this.capabilities.get(id) || {
        searchInput: false,
        globalSearch: false,
        filterBar: false,
        filterGroups: false,
        chips: false,
        advancedFilters: false,
        savedFilters: false,
      }
    );
  }

  resolveFilters(id: string): any {
    // Architecture only: resolve available filter configurations for the given search context
    return {};
  }

  resolveSearch(id: string): any {
    // Architecture only: resolve search configuration (fields, weighting, etc)
    return {};
  }
}

export const SearchRegistry = new SearchRegistryService();
