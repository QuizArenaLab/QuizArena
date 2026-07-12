import { createContext, useContext } from "react";
export const QuizNavigationContext = createContext<any>(null);
export const useQuizNavigation = () => useContext(QuizNavigationContext);
