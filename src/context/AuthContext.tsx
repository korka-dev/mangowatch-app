import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

import { fetchMe, login as apiLogin, register as apiRegister, RegisterPayload } from "../api/auth";
import { TOKEN_STORAGE_KEY } from "../api/client";
import { User } from "../api/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: RegisterPayload) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        try {
          const me = await fetchMe();
          setUser(me);
        } catch {
          await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
        }
      }
      setIsLoading(false);
    })();
  }, []);

  async function signIn(email: string, password: string) {
    const token = await apiLogin(email, password);
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
    const me = await fetchMe();
    setUser(me);
  }

  async function signUp(payload: RegisterPayload) {
    await apiRegister(payload);
    await signIn(payload.email, payload.password);
  }

  async function signOut() {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit etre utilise dans un AuthProvider");
  return ctx;
}
