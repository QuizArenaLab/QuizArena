import { createContext, useContext } from "react";
export const QuestionAuthoringContext = createContext<any>(null);
export const useQuestionAuthoring = () => useContext(QuestionAuthoringContext);
