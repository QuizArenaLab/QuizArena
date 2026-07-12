import React, { useReducer } from "react";
import { QuizNavigationContext } from "../navigation/QuizNavigationContext";
import { QuizNavigationState } from "../navigation/QuizNavigationState";
import { QuizNavigationAction } from "../navigation/QuizNavigationTypes";

const initialState: QuizNavigationState = {
  activeQuestionId: null,
  activeQuestionIndex: 0,
  hoveredQuestionId: null,
  focusedQuestionId: null,
  bookmarkedQuestionIds: [],
  flaggedQuestionIds: [],
  readonlyMode: false,
  layout: "GRID",
  view: "DEFAULT",
  density: "COMFORTABLE",
  display: "NUMBERS_ONLY",
  animation: "NONE",
};

function navigationReducer(
  state: QuizNavigationState,
  action: QuizNavigationAction
): QuizNavigationState {
  switch (action.type) {
    case "SET_LAYOUT":
      return { ...state, layout: action.payload };
    case "SET_DENSITY":
      return { ...state, density: action.payload };
    case "SET_DISPLAY":
      return { ...state, display: action.payload };
    default:
      return state;
  }
}

export const QuizNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(navigationReducer, initialState);
  return (
    <QuizNavigationContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizNavigationContext.Provider>
  );
};
