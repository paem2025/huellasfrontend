import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        authService.setupAxiosInterceptors();
        await authService.initialize();
      } catch (error) {
        console.error("Error inicializando autenticación:", error);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
          const hasValidToken = await authService.verifyToken();
          if (hasValidToken) {
            setUser(storedUser);
            setIsAuthenticated(true);
          } else {
            authService.logout();
          }
        }
      } catch (error) {
        console.error("Error verificando autenticación:", error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const result = await authService.login(username, password);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Error en login:", error);
      return { success: false, message: "Error interno del sistema" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const result = await authService.register(userData);
      return result;
    } catch (error) {
      console.error("Error en registro:", error);
      return { success: false, message: "Error interno del sistema" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error en logout:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (role) => {
    return user && user.role === role;
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    
    const rolePermissions = {
      admin: ['all'],
      operador: ['read', 'write'],
      user: ['read'],
      viewer: ['read']
    };
    
    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes(permission) || userPermissions.includes('all');
  };

  return (
    <AuthContext.Provider
      value={{ 
        isAuthenticated, 
        user, 
        loading,
        login, 
        logout, 
        register,
        hasRole,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
