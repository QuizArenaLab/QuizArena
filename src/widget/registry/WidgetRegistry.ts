import { WidgetManifest } from "./WidgetManifest";

class WidgetRegistryService {
  private static instance: WidgetRegistryService;
  private widgets: Map<string, WidgetManifest>;

  private constructor() {
    this.widgets = new Map<string, WidgetManifest>();
  }

  public static getInstance(): WidgetRegistryService {
    if (!WidgetRegistryService.instance) {
      WidgetRegistryService.instance = new WidgetRegistryService();
    }
    return WidgetRegistryService.instance;
  }

  public register(manifest: WidgetManifest): void {
    if (this.widgets.has(manifest.metadata.id)) {
      console.warn(`Widget ${manifest.metadata.id} is already registered.`);
      return;
    }
    this.widgets.set(manifest.metadata.id, manifest);
  }

  public getManifest(id: string): WidgetManifest | undefined {
    return this.widgets.get(id);
  }

  public getAllManifests(): WidgetManifest[] {
    return Array.from(this.widgets.values());
  }

  public clear(): void {
    this.widgets.clear();
  }
}

export const WidgetRegistry = WidgetRegistryService.getInstance();
