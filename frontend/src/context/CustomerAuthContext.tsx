import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  clearCustomerSession,
  getCustomerSession,
  saveCustomerSession,
  type AuthResponse,
  type Customer,
} from "../lib/customerAuth";

type CustomerAuthContextValue = {
  auth: AuthResponse | null;
  customer: Customer | null;
  isAuthenticated: boolean;
  setAuthSession: (session: AuthResponse) => void;
  logout: () => void;
};

const CustomerAuthContext = createContext<CustomerAuthContextValue | undefined>(undefined);

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthResponse | null>(() => getCustomerSession());

  const setAuthSession = (session: AuthResponse) => {
    saveCustomerSession(session);
    setAuth(session);
  };

  const logout = () => {
    clearCustomerSession();
    setAuth(null);
  };

  const value = useMemo(
    () => ({
      auth,
      customer: auth?.customer ?? null,
      isAuthenticated: Boolean(auth?.accessToken),
      setAuthSession,
      logout,
    }),
    [auth],
  );

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  }
  return context;
};
