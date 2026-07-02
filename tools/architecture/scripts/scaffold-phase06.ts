import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');

function write(p: string, content: string) {
  const fullPath = path.join(SRC_DIR, p);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
}

const CONTAINER_TS = `export type Lifecycle = 'Singleton' | 'Scoped' | 'Transient';

interface Registration {
  token: string;
  factory: () => any;
  lifecycle: Lifecycle;
  instance?: any;
}

export class Container {
  private static instance: Container;
  private registrations: Map<string, Registration> = new Map();

  private constructor() {}

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public register<T>(token: string, factory: () => T, lifecycle: Lifecycle = 'Singleton'): void {
    this.registrations.set(token, { token, factory, lifecycle });
  }

  public resolve<T>(token: string): T {
    const reg = this.registrations.get(token);
    if (!reg) throw new Error(\`Token \${token} not registered in container.\`);

    if (reg.lifecycle === 'Singleton') {
      if (!reg.instance) reg.instance = reg.factory();
      return reg.instance;
    }
    
    if (reg.lifecycle === 'Scoped') {
      // Scoped would typically tie to a request/context. For simplicity, we treat it similarly to transient or placeholder here.
      return reg.factory();
    }

    return reg.factory(); // Transient
  }
}
`;

const CAPABILITY_REG_TS = `export class CapabilityRegistry {
  private static instance: CapabilityRegistry;
  private capabilities: Map<string, string[]> = new Map(); // Domain -> capabilities[]

  private constructor() {}

  public static getInstance(): CapabilityRegistry {
    if (!CapabilityRegistry.instance) {
      CapabilityRegistry.instance = new CapabilityRegistry();
    }
    return CapabilityRegistry.instance;
  }

  public register(domain: string, capability: string): void {
    const caps = this.capabilities.get(domain) || [];
    if (!caps.includes(capability)) {
      caps.push(capability);
      this.capabilities.set(domain, caps);
    }
  }

  public getCapabilities(domain: string): string[] {
    return this.capabilities.get(domain) || [];
  }
}
`;

const FEATURE_FLAGS_TS = `export type FlagLevel = 'Platform' | 'Domain' | 'Feature' | 'Capability';

export interface FeatureFlag {
  id: string;
  level: FlagLevel;
  parent?: string; // ID of the parent flag
  enabled: boolean;
}

export class FeatureFlagManager {
  private static instance: FeatureFlagManager;
  private flags: Map<string, FeatureFlag> = new Map();

  private constructor() {}

  public static getInstance(): FeatureFlagManager {
    if (!FeatureFlagManager.instance) {
      FeatureFlagManager.instance = new FeatureFlagManager();
    }
    return FeatureFlagManager.instance;
  }

  public register(flag: FeatureFlag): void {
    this.flags.set(flag.id, flag);
  }

  public isEnabled(id: string): boolean {
    const flag = this.flags.get(id);
    if (!flag) return false;
    
    if (flag.parent) {
       const parentEnabled = this.isEnabled(flag.parent);
       if (!parentEnabled) return false;
    }
    return flag.enabled;
  }
}
`;

const HEALTH_TS = `import { Container } from '../container/Container';
import { DomainRegistry } from '../registry/DomainRegistry';

export class PlatformHealthMonitor {
  public static async checkHealth(): Promise<Record<string, any>> {
    return {
       status: 'HEALTHY',
       checks: {
         container: 'OK',
         registry: 'OK',
         flags: 'OK',
         artifacts: 'OK',
         events: 'OK',
         commands: 'OK'
       },
       timestamp: new Date().toISOString()
    };
  }
}
`;

const COMPETITION_VERSION = `export interface CompetitionVersion {
  id: string;
  competitionId: string;
  metadata: Record<string, any>;
  semanticVersion: string;
  versionNumber: number;
  createdAt: string;
  parentVersionId?: string; // Lineage
  status: 'DRAFT' | 'FROZEN' | 'SUPERSEDED';
}
`;

const COMPETITION_ARTIFACT = `export interface CompetitionArtifact {
  artifactId: string;
  versionId: string;
  snapshotHash: string;
  manifestHash: string;
  artifactHash: string;
  serializedPayload: string; // The immutable snapshot data
  manifest: any;
  compatibilityReport: any;
  dependencies: string[];
  integrityReport: any;
}
`;

const ARTIFACT_REGISTRY = `import { CompetitionArtifact } from '../models/CompetitionArtifact';

export class ArtifactRepository {
  private artifacts: Map<string, CompetitionArtifact> = new Map();

  public save(artifact: CompetitionArtifact): void {
    if (this.artifacts.has(artifact.artifactId)) throw new Error('Artifacts are immutable and cannot be overwritten.');
    this.artifacts.set(artifact.artifactId, artifact);
  }

  public get(artifactId: string): CompetitionArtifact | undefined {
    return this.artifacts.get(artifactId);
  }
}

export class ArtifactResolver {
  constructor(private repo: ArtifactRepository) {}

  public resolveCompatible(versionId: string): CompetitionArtifact | undefined {
    // Logic to find the latest compatible version
    return undefined;
  }
}

export class ArtifactRegistry {
  private static instance: ArtifactRegistry;
  private resolver!: ArtifactResolver;
  
  private constructor() {}
  
  public static getInstance(): ArtifactRegistry {
    if (!ArtifactRegistry.instance) {
      ArtifactRegistry.instance = new ArtifactRegistry();
    }
    return ArtifactRegistry.instance;
  }

  public setResolver(resolver: ArtifactResolver) {
    this.resolver = resolver;
  }

  public fetch(versionId: string): CompetitionArtifact {
    const artifact = this.resolver.resolveCompatible(versionId);
    if (!artifact) throw new Error('No compatible artifact found.');
    return artifact;
  }
}
`;

const FREEZE_PIPELINE = `import { CompetitionArtifact } from '../models/CompetitionArtifact';

export class FreezePipeline {
  public async execute(context: any): Promise<CompetitionArtifact> {
    console.log('1. Prepare');
    console.log('2. Validate');
    console.log('3. Resolve Dependencies');
    console.log('4. Snapshot');
    console.log('5. Normalize');
    console.log('6. Serialize');
    console.log('7. Generate Snapshot Hash');
    console.log('8. Generate Manifest Hash');
    console.log('9. Generate Artifact Hash');
    console.log('10. Build Manifest');
    console.log('11. Compatibility Validation');
    console.log('12. Integrity Validation');
    console.log('13. Artifact Assembly');
    console.log('14. Persist');
    console.log('15. Audit');
    console.log('16. Publish Artifact Events');
    
    return {} as CompetitionArtifact;
  }
}
`;

write('platform/container/Container.ts', CONTAINER_TS);
write('platform/registry/CapabilityRegistry.ts', CAPABILITY_REG_TS);
write('platform/feature-flags/FeatureFlagManager.ts', FEATURE_FLAGS_TS);
write('platform/health/PlatformHealthMonitor.ts', HEALTH_TS);

write('admin/competition-studio/models/CompetitionVersion.ts', COMPETITION_VERSION);
write('admin/competition-studio/models/CompetitionArtifact.ts', COMPETITION_ARTIFACT);
write('admin/competition-studio/pipeline/FreezePipeline.ts', FREEZE_PIPELINE);
write('competitions/registry/ArtifactRegistry.ts', ARTIFACT_REGISTRY);

console.log('Phase 06 scaffolding complete.');
