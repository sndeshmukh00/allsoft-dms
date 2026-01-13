import React, { createContext, useState, useEffect, useContext } from 'react';
import { getToken, storeToken, clearToken } from '../services/api';

interface AuthContextType {
  isLoading: boolean;
  userToken: string | null;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  const loadToken = async () => {
    try {
      const token = await getToken();
      setUserToken(token);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadToken();
  }, []);

  const signIn = async (token: string) => {
    await storeToken(token);
    setUserToken(token);
  };

  const signOut = async () => {
    await clearToken();
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ isLoading, userToken, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth is not being used inside AuthProvider');
  }
  return context;
};
