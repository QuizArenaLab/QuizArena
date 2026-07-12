import { QuestionManifest } from "./QuestionManifest";
import { ComponentRegistry } from "@/registry";

class QuestionRegistryService {
  private manifests = new Map<string, QuestionManifest>();

  register(manifest: QuestionManifest) {
    if (this.manifests.has(manifest.id)) {
      console.warn(`Question component ${manifest.id} is already registered.`);
    }
    this.manifests.set(manifest.id, manifest);

    ComponentRegistry.register({
      id: `question-${manifest.id}`,
      name: manifest.name,
      category: "question",
      version: manifest.version,
      status: "stable",
      owner: "QuizArena",
    });
  }

  get(id: string): QuestionManifest | undefined {
    return this.manifests.get(id);
  }

  getAll(): QuestionManifest[] {
    return Array.from(this.manifests.values());
  }
}

export const QuestionRegistry = new QuestionRegistryService();
