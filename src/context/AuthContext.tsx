import React, { createContext, useState, useEffect, useContext } from 'react';

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
      // TODO: Get Token form api and set it in userToken state
      // const token = await getToken();
      // setUserToken(token);
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
    // TODO: Store Token in async storage and set uSerToken state
    setUserToken(token);
  };

  const signOut = async () => {
    // TODO: Clear Token from async storage and set userToken state
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
