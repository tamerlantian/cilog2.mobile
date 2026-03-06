import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { environment } from '../../../config/environment';
import { useAuthNavigation } from '../../../navigation/hooks/useTypedNavigation';
import { toastTextOneStyle } from '../../../shared/styles/global.style';
import { networkService } from '../../../shared/services/network.service';
import { reportMutationError } from '../../../shared/utils/sentry-helpers';
import { authKeys } from '../constants/auth-keys';
import { authController } from '../controllers/auth.controller';
import { RegisterFormValues } from '../interfaces/auth.interface';
import { AuthErrorMapperService } from '../services/auth-error-mapper.service';

/**
 * View-model para el flujo de registro de nuevo usuario.
 *
 * Responsabilidades:
 * - Verificar conectividad antes de intentar el registro
 * - Enriquecer los valores del formulario con el identificador de la app
 * - Delegar la persistencia al controller
 * - Mapear errores de la API a mensajes comprensibles para el usuario
 * - Reportar errores inesperados a Sentry
 * - Navegar a Login tras un registro exitoso
 */
export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigation = useAuthNavigation();

  const registerMutation = useMutation({
    mutationFn: async (formValues: RegisterFormValues) => {
      const isConnected = await networkService.isConnected();
      if (!isConnected) {
        throw new Error('NO_INTERNET_CONNECTION');
      }

      // Enriquecer con el identificador de la app (no es un campo del formulario)
      return authController.register({
        username: formValues.username,
        password: formValues.password,
        confirmarPassword: formValues.confirmarPassword,
        celular: formValues.celular,
        aceptarTerminosCondiciones: formValues.aceptarTerminosCondiciones,
        aplicacion: environment.proyecto,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
      queryClient.invalidateQueries({ queryKey: authKeys.user() });

      Toast.show({
        type: 'success',
        text1: 'Cuenta creada exitosamente',
        text2: 'Ya puedes iniciar sesión',
        text1Style: toastTextOneStyle,
      });

      navigation.navigate('Login');
    },
    onError: (error: any, variables: RegisterFormValues) => {
      // Error de conectividad — no reportar a Sentry (problema del usuario, no del código)
      if (error.message === 'NO_INTERNET_CONNECTION') {
        Toast.show({
          type: 'error',
          text1: 'Sin conexión a internet',
          text2: 'Verifica tu conexión e intenta nuevamente',
          text1Style: toastTextOneStyle,
        });
        return;
      }

      // Reportar a Sentry antes de mostrar el toast
      reportMutationError('register', error, {
        module: 'auth',
        operation: 'register',
        location: 'register-view-model',
        email: variables.username, // nunca incluir password
      });

      const mapped = AuthErrorMapperService.mapError(error, 'register');
      Toast.show({
        type: 'error',
        text1: mapped.title,
        text2: mapped.message,
        text1Style: toastTextOneStyle,
      });
    },
  });

  return {
    register: registerMutation.mutate,
    isLoading: registerMutation.isPending,
    isError: registerMutation.isError,
    error: registerMutation.error,
  };
};
