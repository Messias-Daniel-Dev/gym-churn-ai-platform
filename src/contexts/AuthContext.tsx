import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'manager' | 'agent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users
const DEMO_USERS: User[] = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@demo.com',
    role: 'admin'
  },
  {
    id: '2',
    name: 'Guilherme Silva',
    email: 'gestor@demo.com',
    role: 'manager'
  },
  {
    id: '3',
    name: 'Carlos Vendedor',
    email: 'carlos@demo.com',
    role: 'agent'
  },
  {
    id: '4',
    name: 'Ana Silva',
    email: 'ana@demo.com',
    role: 'agent'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('auth-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo authentication - in real app this would be an API call
    const demoUser = DEMO_USERS.find(u => u.email === email);
    
    if (demoUser && password === 'demo123') {
      setUser(demoUser);
      localStorage.setItem('auth-user', JSON.stringify(demoUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}