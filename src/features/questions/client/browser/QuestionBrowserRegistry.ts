// We rely on the global ComponentRegistry for components,
// but we might want a lightweight registry here for Browser extensions/plugins in the future.
// For now, it simply exports a registry placeholder.

export class QuestionBrowserRegistry {
  private static manifests = new Map<string, any>();

  public static register(id: string, manifest: any) {
    this.manifests.set(id, manifest);
  }

  public static get(id: string) {
    return this.manifests.get(id);
  }
}
