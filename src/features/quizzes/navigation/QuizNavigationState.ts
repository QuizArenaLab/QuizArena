import { QuizNavigationLayout } from "./QuizNavigationLayout";
import { QuizNavigationView } from "./QuizNavigationView";
import { QuizNavigationDensity } from "./QuizNavigationDensity";
import { QuizNavigationDisplay } from "./QuizNavigationDisplay";
import { QuizNavigationAnimation } from "./QuizNavigationAnimation";

export interface QuizNavigationState {
  activeQuestionId: string | null;
  activeQuestionIndex: number;
  hoveredQuestionId: string | null;
  focusedQuestionId: string | null;
  bookmarkedQuestionIds: string[];
  flaggedQuestionIds: string[];
  readonlyMode: boolean;
  layout: QuizNavigationLayout;
  view: QuizNavigationView;
  density: QuizNavigationDensity;
  display: QuizNavigationDisplay;
  animation: QuizNavigationAnimation;
}
