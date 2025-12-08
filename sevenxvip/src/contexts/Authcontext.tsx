import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isVip: boolean;
  token: string | null;
  loadingAuth: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isVip: false,
  token: null,
  loadingAuth: true,
  login: () => {},
  logout: () => {},
  checkAuth: () => false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('Token')
  );

  const [isVip, setIsVip] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

  const isAuthenticated = Boolean(token);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!token) {
        setLoadingAuth(false);
        return;
      }

      await checkVipStatus();
      setLoadingAuth(false);
    };

    initializeAuth();
  }, [token]);

  const checkVipStatus = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsVip(data.isVip);
      } else {
        setIsVip(false);
      }
    } catch (error) {
      console.error('Error checking VIP status:', error);
      setIsVip(false);
    }
  };

  const login = (newToken: string) => {
    localStorage.setItem('Token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('Token');
    setToken(null);
    setIsVip(false);
  };

  const checkAuth = () => Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isVip,
        token,
        loadingAuth,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
