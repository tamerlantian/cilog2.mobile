import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useAuthNavigation } from '../../../navigation/hooks';
import { toastTextOneStyle } from '../../../shared/styles/global.style';
import { networkService } from '../../../shared/services/network.service';
import { reportMutationError } from '../../../shared/utils/sentry-helpers';
import { authController } from '../controllers/auth.controller';
import { ForgotPasswordFormValues } from '../models/Auth';
import { AuthErrorMapperService } from '../services/auth-error-mapper.service';

/**
 * View-model para el flujo de recuperación de contraseña.
 *
 * Responsabilidades:
 * - Verificar conectividad antes de intentar el envío
 * - Delegar la llamada al controller (quien inyecta `aplicacion` desde environment)
 * - Mapear errores de la API a mensajes comprensibles para el usuario
 * - Reportar errores inesperados a Sentry
 * - Navegar a Login tras el envío exitoso
 */
export const useForgotPassword = () => {
  const navigation = useAuthNavigation();

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordFormValues) => {
      const isConnected = await networkService.isConnected();
      if (!isConnected) {
        throw new Error('NO_INTERNET_CONNECTION');
      }
      return authController.forgotPassword(data);
    },
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Correo enviado',
        text2: 'Revisa tu bandeja de entrada para restablecer tu contraseña',
        text1Style: toastTextOneStyle,
      });
      navigation.navigate('Login');
    },
    onError: (error: any, variables: ForgotPasswordFormValues) => {
      // Error de conectividad — no reportar a Sentry
      if (error.message === 'NO_INTERNET_CONNECTION') {
        Toast.show({
          type: 'error',
          text1: 'Sin conexión a internet',
          text2: 'Verifica tu conexión e intenta nuevamente',
          text1Style: toastTextOneStyle,
        });
        return;
      }

      reportMutationError('forgot_password', error, {
        module: 'auth',
        operation: 'forgot_password',
        location: 'forgot-password-view-model',
        email: variables.username,
      });

      const mapped = AuthErrorMapperService.mapError(error, 'login');
      Toast.show({
        type: 'error',
        text1: mapped.title,
        text2: mapped.message,
        text1Style: toastTextOneStyle,
      });
    },
  });

  return {
    forgotPassword: forgotPasswordMutation.mutate,
    isLoading: forgotPasswordMutation.isPending,
    isError: forgotPasswordMutation.isError,
    error: forgotPasswordMutation.error,
  };
};
