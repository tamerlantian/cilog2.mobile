import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import Toast from 'react-native-toast-message';
import { authController } from '../controllers/auth.controller';
import { useAuthActions } from '../hooks/useAuthActions';
import { LoginCredentials, AuthUser } from '../models/Auth';
import { authEvents } from '../../../core/services/auth-events.service';
import { toastTextOneStyle } from '../../../shared/styles/global.style';

interface AuthContextType {
  // Estado
  isAuthenticated: boolean;
  user: AuthUser | null;
  /**
   * True únicamente durante la verificación inicial de sesión al arrancar la app.
   * No refleja el estado de carga del formulario de login (ver useLogin hook).
   */
  isLoading: boolean;

  // Acciones
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  logoutTokenExpired: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { clearAppData } = useAuthActions();

  /** Verifica si existe una sesión activa en el almacenamiento local. Solo se llama al arrancar. */
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const authenticated = await authController.isAuthenticated();

      if (authenticated) {
        const userData = await authController.getCurrentUser();
        setIsAuthenticated(true);
        setUser(userData);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('[AuthContext] Error verificando estado de sesión:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Realiza el login del usuario.
   * El backend devuelve { autenticar, usuario } — sin JWT.
   * La gestión del estado de carga del formulario (spinner) es responsabilidad
   * del hook `useLogin`, no de este contexto.
   */
  const login = async (credentials: LoginCredentials) => {
    const response = await authController.login(credentials);
    setIsAuthenticated(true);
    setUser(response.usuario);

    Toast.show({
      type: 'success',
      text1: 'Inicio de sesión exitoso',
      text1Style: toastTextOneStyle,
    });
  };

  /** Logout manual — limpia tokens, datos de la app y estado local */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authController.logout();
      await clearAppData();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('[AuthContext] Error durante logout:', error);
      // Forzar logout local aunque falle el servidor
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [clearAppData]);

  /** Logout por sesión expirada — preserva datos locales de la app */
  const logoutTokenExpired = useCallback(async () => {
    try {
      setIsLoading(true);
      await authController.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error(
        '[AuthContext] Error en logout por sesión expirada:',
        error,
      );
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      Toast.show({
        type: 'error',
        text1: 'Sesión expirada',
        text2: 'Por favor inicia sesión nuevamente',
        text1Style: toastTextOneStyle,
      });
      setIsLoading(false);
    }
  }, []);

  // Verificar sesión al montar la app
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Escuchar expiración de sesión emitida por el interceptor HTTP
  useEffect(() => {
    const handleTokenExpired = () => logoutTokenExpired();
    authEvents.on('TOKEN_EXPIRED', handleTokenExpired);
    return () => {
      authEvents.off('TOKEN_EXPIRED', handleTokenExpired);
    };
  }, [logoutTokenExpired]);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    logoutTokenExpired,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
