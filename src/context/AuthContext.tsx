import React, { createContext, useState, useEffect, useContext } from 'react';
import { getToken, storeToken, clearToken, getUser, storeUser } from '../services/api';

interface UserData {
  userId: string;
  userName: string;
}
interface AuthContextType {
  isLoading: boolean;
  userToken: string | null;
  userData: UserData | null;
  signIn: (token: string, user: UserData) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

 const loadAuthData = async () => {
    try {
      const token = await getToken();
      const user = await getUser();
      setUserToken(token);
      setUserData(user);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAuthData();
  }, []);

  const signIn = async (token: string, user: UserData) => {
    await storeToken(token);
    await storeUser(user);
    setUserToken(token);
    setUserData(user);
  };

  const signOut = async () => {
    await clearToken();
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ isLoading, userToken, userData, signIn, signOut }}>
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
