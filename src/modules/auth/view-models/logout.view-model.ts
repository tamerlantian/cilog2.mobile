import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authController } from '../controllers/auth.controller';
import { authKeys } from '../constants/auth-keys';
import { useAppDispatch } from '../../../store/hooks';
import { clearSettingsThunk, resetSettings } from '../../settings';
import { persistor } from '../../../store';

// Hook para manejar el logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // 1. Logout del servidor y limpiar tokens de auth
      await authController.logout();

      // 2. Limpiar settings del storage y Redux
      await dispatch(clearSettingsThunk());
      dispatch(resetSettings());

      // 3. Limpiar React Query cache
      queryClient.clear();

      // 4. Purgar Redux Persist
      await persistor.purge();

      return true;
    },
    onSuccess: () => {
      queryClient.setQueryData(authKeys.session(), false);
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
    onError: (error) => {
      console.error('Error during logout:', error);
      queryClient.setQueryData(authKeys.session(), false);
      queryClient.setQueryData(authKeys.user(), null);
    },
  });

  return {
    logout: logoutMutation.mutate,
    isLoading: logoutMutation.isPending,
    isError: logoutMutation.isError,
    error: logoutMutation.error,
  };
};
