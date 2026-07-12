import { QuestionCapabilities } from "./QuestionCapabilities";

export interface QuestionManifest {
  id: string; // The specific type of question (e.g. 'multiple-choice', 'code-snippet')
  name: string;
  version: string;
  capabilities: QuestionCapabilities;
}
