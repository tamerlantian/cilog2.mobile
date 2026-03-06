import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { toastTextOneStyle } from '../../../shared/styles/global.style';
import { networkService } from '../../../shared/services/network.service';
import { firebaseMessagingService } from '../../../shared/services/firebase-messaging.service';
import { reportMutationError } from '../../../shared/utils/sentry-helpers';
import { useAuth } from '../context/auth.context';
import { LoginFormValues } from '../interfaces/auth.interface';
import { AuthErrorMapperService } from '../services/auth-error-mapper.service';

/**
 * Hook de presentación para el flujo de inicio de sesión.
 *
 * Responsabilidades:
 * - Verificar conectividad antes de intentar autenticar
 * - Obtener el token FCM e inyectarlo en las credenciales
 * - Delegar la autenticación y el manejo de estado al AuthContext
 * - Mapear errores de la API a mensajes comprensibles para el usuario
 * - Reportar errores inesperados a Sentry
 *
 * No conoce detalles de implementación del repositorio ni del almacenamiento.
 */
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login: authLogin } = useAuth();

  const login = async (formValues: LoginFormValues) => {
    try {
      setIsLoading(true);

      const isConnected = await networkService.isConnected();
      if (!isConnected) {
        Toast.show({
          type: 'error',
          text1: 'Sin conexión a internet',
          text2: 'Verifica tu conexión e intenta nuevamente',
          text1Style: toastTextOneStyle,
        });
        return;
      }

      // Obtener token FCM; si no hay permisos o falla, continuar con null
      const tokenFirebase = await firebaseMessagingService.getToken();

      await authLogin({
        username: formValues.username,
        password: formValues.password,
        tokenFirebase,
      });
    } catch (error: any) {
      reportMutationError('login', error, {
        module: 'auth',
        operation: 'login',
        location: 'useLogin-hook',
        email: formValues.username,
      });

      const mapped = AuthErrorMapperService.mapError(error, 'login');
      Toast.show({
        type: 'error',
        text1: mapped.title,
        text2: mapped.message,
        text1Style: toastTextOneStyle,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};
