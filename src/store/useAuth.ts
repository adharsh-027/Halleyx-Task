import { useState, useCallback } from 'react';

const AUTH_STORAGE_KEY = 'auth-user';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

function loadAuthState(): AuthState {
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    if (data) {
      const user = JSON.parse(data);
      return {
        user,
        isAuthenticated: true,
        isLoading: false,
      };
    }
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
  };
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(loadAuthState());

  const signIn = useCallback((email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    // Simulate API call (2-second delay)
    return new Promise<AuthUser>((resolve, reject) => {
      setTimeout(() => {
        // Simple validation - accept any email/password combination for demo
        if (email && password) {
          const user: AuthUser = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name: email.split('@')[0],
          };
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          resolve(user);
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
          reject(new Error('Email and password are required'));
        }
      }, 2000);
    });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return {
    ...authState,
    signIn,
    signOut,
  };
}
