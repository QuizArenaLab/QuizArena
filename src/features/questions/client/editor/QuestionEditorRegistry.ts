export class QuestionEditorRegistry {
  private static instances = new Map<string, any>();
  static register(id: string, instance: any) {
    this.instances.set(id, instance);
  }
}
