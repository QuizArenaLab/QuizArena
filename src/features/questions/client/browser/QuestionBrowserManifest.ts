import { QuestionBrowserMode } from "./QuestionBrowserMode";
import { QuestionBrowserView } from "./QuestionBrowserView";
import { QuestionBrowserCapabilities } from "./QuestionBrowserCapabilities";
import { QuestionBrowserVariant } from "./QuestionBrowserVariant";

export interface QuestionBrowserManifest {
  id: string;
  name: string;
  version: string;
  defaultMode: QuestionBrowserMode;
  defaultView: QuestionBrowserView;
  variant: QuestionBrowserVariant;
  capabilities: QuestionBrowserCapabilities;
}
