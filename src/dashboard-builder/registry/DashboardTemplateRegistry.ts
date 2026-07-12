import { DashboardTemplateManifest } from "./DashboardTemplateManifest";
import { DashboardLayoutDefinition } from "../types/DashboardLayoutDefinition";

class DashboardTemplateRegistryImpl {
  private templates = new Map<string, DashboardTemplateManifest>();

  public register(template: DashboardTemplateManifest): void {
    if (this.templates.has(template.id)) {
      console.warn(
        `DashboardTemplate with id '${template.id}' is already registered and will be overwritten.`
      );
    }
    this.templates.set(template.id, template);
  }

  public unregister(id: string): void {
    this.templates.delete(id);
  }

  public find(id: string): DashboardTemplateManifest | undefined {
    return this.templates.get(id);
  }

  public list(): DashboardTemplateManifest[] {
    return Array.from(this.templates.values());
  }

  public getLayout(id: string): DashboardLayoutDefinition | null {
    const template = this.find(id);
    return template ? template.layout : null;
  }
}

export const DashboardTemplateRegistry = new DashboardTemplateRegistryImpl();
