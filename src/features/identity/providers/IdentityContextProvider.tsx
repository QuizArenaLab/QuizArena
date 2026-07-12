import React, { useReducer } from "react";
import { IdentityContext } from "../IdentityContext";
import { IdentityProvider as IdpProvider } from "../IdentityProvider";
import { AuthenticationStatusPresentation } from "../AuthenticationStatusPresentation";

export interface IdentityProviderState {
  currentProvider: IdpProvider | null;
  authenticationMethod: string | null;
  authenticationStatus: AuthenticationStatusPresentation;
  verificationState: string;
  profileState: string;
  sessionState: string;
  compactMode: boolean;
  readonlyMode: boolean;
}

const initialState: IdentityProviderState = {
  currentProvider: null,
  authenticationMethod: null,
  authenticationStatus: "INITIAL",
  verificationState: "UNVERIFIED",
  profileState: "INCOMPLETE",
  sessionState: "EXPIRED",
  compactMode: false,
  readonlyMode: false,
};

function identityReducer(state: IdentityProviderState, action: any): IdentityProviderState {
  switch (action.type) {
    case "SET_STATUS":
      return { ...state, authenticationStatus: action.payload };
    default:
      return state;
  }
}

export const IdentityContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(identityReducer, initialState);
  return (
    <IdentityContext.Provider value={{ state, dispatch }}>{children}</IdentityContext.Provider>
  );
};
