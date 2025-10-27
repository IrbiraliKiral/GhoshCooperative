import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentMachineSession, getStoredMemberName, updateSessionAccess } from '@/services/sessionService';

interface AuthContextType {
  isAuthenticated: boolean;
  memberName: string | null;
  login: (memberName: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [memberName, setMemberName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      const session = getCurrentMachineSession();
      const storedName = getStoredMemberName();

      if (session && storedName) {
        setMemberName(storedName);
        setIsAuthenticated(true);
        updateSessionAccess();
      }

      setIsLoading(false);
    };

    checkExistingSession();
  }, []);

  const login = (name: string) => {
    setMemberName(name);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setMemberName(null);
    setIsAuthenticated(false);
    localStorage.removeItem('machine_id');
    localStorage.removeItem('member_name');
    localStorage.removeItem('machines_database');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, memberName, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
