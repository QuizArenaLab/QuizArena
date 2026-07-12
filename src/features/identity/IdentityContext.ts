import { createContext, useContext } from "react";
export const IdentityContext = createContext<any>(null);
export const useIdentity = () => useContext(IdentityContext);
