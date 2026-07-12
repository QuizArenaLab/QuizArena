"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthenticationService } from "../services/AuthenticationService";
import { AuthenticationStatusPresentation } from "../AuthenticationStatusPresentation";

export interface AuthContextType {
  status: AuthenticationStatusPresentation;
  user: any | null;
  session: any | null;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode; demoMode?: boolean }> = ({
  children,
  demoMode = false,
}) => {
  const [status, setStatus] = useState<AuthenticationStatusPresentation>("INITIAL");
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);

  useEffect(() => {
    if (demoMode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("UNAUTHENTICATED");
      return;
    }

    setStatus("AUTHENTICATING");
    AuthenticationService.session.getSession().then(({ data, error }) => {
      if (error || !data.session) {
        setStatus("UNAUTHENTICATED");
      } else {
        setSession(data.session);
        setUser(data.session.user);
        setStatus("AUTHENTICATED");
      }
    });

    const {
      data: { subscription },
    } = AuthenticationService.session.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setSession(session);
        setUser(session?.user);
        setStatus("AUTHENTICATED");
      } else if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
        setStatus("UNAUTHENTICATED");
      }
    });

    return () => subscription.unsubscribe();
  }, [demoMode]);

  const signOut = async () => {
    if (!demoMode) await AuthenticationService.session.signOut();
    setStatus("UNAUTHENTICATED");
  };

  return (
    <AuthContext.Provider value={{ status, user, session, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
