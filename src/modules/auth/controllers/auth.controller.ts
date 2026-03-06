import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_DATA_KEY,
} from '../../../shared/constants/localstorage-keys';
import {
  ApiLoginResponse,
  AuthUser,
  ForgotPasswordFormValues,
  LoginCredentials,
  RegisterCredentials,
  RegisterResponse,
} from '../models/Auth';
import { AuthRepository } from '../repositories/auth.repository';

/**
 * Capa de orquestación entre las capas de presentación y el repositorio.
 *
 * Responsabilidades:
 * - Llamar al repositorio para operaciones de autenticación
 * - Persistir/limpiar datos de usuario en AsyncStorage
 * - Verificar que el backend confirme la autenticación (autenticar === true)
 * - Inyectar datos de configuración que no provienen del usuario (ej: `proyecto`)
 *
 * Nota: el backend actual no emite JWT. Los tokens (AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY)
 * están reservados para cuando el backend los soporte. La sesión se persiste con USER_DATA_KEY.
 */
export const authController = {
  login: async (credentials: LoginCredentials): Promise<ApiLoginResponse> => {
    const response = await AuthRepository.getInstance().login(credentials);

    if (!response.autenticar) {
      throw new Error('Credenciales inválidas');
    }

    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.usuario));
    return response;
  },

  register: async (
    userData: RegisterCredentials,
  ): Promise<RegisterResponse> => {
    return AuthRepository.getInstance().register(userData);
  },

  logout: async (): Promise<boolean> => {
    await AsyncStorage.multiRemove([
      AUTH_TOKEN_KEY,
      REFRESH_TOKEN_KEY,
      USER_DATA_KEY,
    ]);
    return true;
  },

  isAuthenticated: async (): Promise<boolean> => {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      return !!userData;
    } catch {
      return false;
    }
  },

  getCurrentUser: async (): Promise<AuthUser | null> => {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },

  /**
   * Solicita recuperación de contraseña.
   * `aplicacion` se inyecta desde `environment.proyecto` — no es un campo del formulario.
   */
  forgotPassword: async (data: ForgotPasswordFormValues): Promise<boolean> => {
    return AuthRepository.getInstance().forgotPassword(data.username);
  },
};
