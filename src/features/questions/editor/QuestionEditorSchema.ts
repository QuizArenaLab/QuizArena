import { QuestionEditorLayoutType } from "./QuestionEditorLayout";
import { QuestionEditorSectionType } from "./QuestionEditorSection";
import { QuestionEditorVariant } from "./QuestionEditorVariant";
import { QuestionEditorCapabilities } from "./QuestionEditorCapabilities";

export interface QuestionEditorSchema {
  metadata: any;
  sections: QuestionEditorSectionType[];
  layouts: QuestionEditorLayoutType[];
  variants: QuestionEditorVariant[];
  capabilities: QuestionEditorCapabilities;
}
