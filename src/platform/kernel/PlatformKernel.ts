import { DomainBootContract } from '../contracts/DomainBootContract';

export class PlatformKernel {
  private domains: Map<string, DomainBootContract> = new Map();
  private isReady: boolean = false;

  constructor(
    private capabilityRegistry: any, // PlatformCapabilityRegistry
    private commandRegistry: any,    // PlatformCommandRegistry
    private eventRegistry: any,      // PlatformEventRegistry
    private configEngine: any        // PlatformConfigurationEngine
  ) {}

  public registerDomain(domain: DomainBootContract): void {
    if (this.domains.has(domain.domainId)) {
      throw new Error(`Domain ${domain.domainId} is already registered.`);
    }
    this.domains.set(domain.domainId, domain);
  }

  public async bootstrap(): Promise<void> {
    console.log('Bootstrapping PlatformKernel...');
    
    // Initialize infrastructure, registries, and domain services
    for (const [domainId, domain] of this.domains.entries()) {
      console.log(`Initializing Domain: ${domainId}`);
      await domain.initialize();
      
      domain.registerCapabilities(this.capabilityRegistry);
      domain.registerCommands(this.commandRegistry);
      domain.registerEvents(this.eventRegistry);
      domain.registerPolicies(this.configEngine);
    }

    this.isReady = true;
    console.log('Platform Kernel Bootstrapped and Ready.');
  }

  public async shutdown(): Promise<void> {
    for (const [domainId, domain] of this.domains.entries()) {
      console.log(`Shutting down Domain: ${domainId}`);
      await domain.shutdown();
    }
    this.isReady = false;
  }

  public isPlatformReady(): boolean {
    return this.isReady;
  }
}
