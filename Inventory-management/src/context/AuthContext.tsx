import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

interface JwtPayload {
  role?: string | string[];
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
  [key: string]: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  roles: string[];
  login: (token: string, email: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const extractRoles = (decoded: JwtPayload): string[] => {
    // Try standard .NET role claim first
    const netRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    if (netRole) {
      return Array.isArray(netRole) ? netRole : [netRole];
    }

    // Fallback to custom "role" claim
    const customRole = decoded.role;
    if (customRole) {
      return Array.isArray(customRole) ? customRole : [customRole];
    }

    return [];
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        const userRoles = extractRoles(decoded);
        console.log("roles", userRoles)
        setRoles(userRoles);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, email?: string) => {
    localStorage.setItem('token', token);
    console.log("email", email)
    const decoded: JwtPayload = jwtDecode(token);
    const userRoles = extractRoles(decoded);
    setRoles(userRoles);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsAuthenticated(true);
    if (email){ localStorage.setItem('userEmail', email);}
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setRoles([]);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, roles, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};