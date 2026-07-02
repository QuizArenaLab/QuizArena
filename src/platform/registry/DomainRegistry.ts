export type DomainLifecycle = 'INITIALIZED' | 'REGISTERED' | 'READY' | 'ACTIVE' | 'DISABLED';

export interface DomainManifest {
  name: string;
  version: string;
  level: number;
  owner?: string;
  description?: string;
  capabilities: string[];
  dependencies: string[];
  exports: string[];
  visibility: 'PUBLIC' | 'PRIVATE' | 'INTERNAL';
  experimental: boolean;
  enabled: boolean;
  eventsPublished: string[];
  eventsConsumed: string[];
  commands: string[];
  publicAPIs: string[];
}

export class DomainRegistry {
  private static instance: DomainRegistry;
  private domains: Map<string, DomainManifest> = new Map();

  private constructor() {}

  public static getInstance(): DomainRegistry {
    if (!DomainRegistry.instance) {
      DomainRegistry.instance = new DomainRegistry();
    }
    return DomainRegistry.instance;
  }

  public register(manifest: DomainManifest): void {
    if (this.domains.has(manifest.name)) {
      throw new Error(`Domain ${manifest.name} is already registered.`);
    }
    this.domains.set(manifest.name, manifest);
  }

  public getDomain(name: string): DomainManifest | undefined {
    return this.domains.get(name);
  }

  public getAllDomains(): DomainManifest[] {
    return Array.from(this.domains.values());
  }

  public clear(): void {
    this.domains.clear();
  }
}
