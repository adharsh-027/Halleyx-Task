import React, { createContext, useContext, useState, useCallback } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'auth-user';

function loadAuthState(): AuthUser | null {
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadAuthState());
  const [isLoading, setIsLoading] = useState(false);

  const signIn = useCallback((email: string, password: string) => {
    setIsLoading(true);

    return new Promise<AuthUser>((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const newUser: AuthUser = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name: email.split('@')[0],
          };
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
          setUser(newUser);
          setIsLoading(false);
          resolve(newUser);
        } else {
          setIsLoading(false);
          reject(new Error('Email and password are required'));
        }
      }, 2000);
    });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
