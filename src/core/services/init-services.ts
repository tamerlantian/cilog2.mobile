import { AuthRepository } from '../../modules/auth/repositories/auth.repository';
import { firebaseMessagingService } from '../../shared/services/firebase-messaging.service';
import tokenService from './token.service';

/**
 * Inicializa los servicios de la aplicación.
 * Configura las dependencias entre servicios para evitar ciclos de importación
 * y solicita permisos de notificaciones push en segundo plano.
 */
export async function initializeServices(): Promise<void> {
  // Configurar el servicio de token con la implementación de autenticación
  const authService = AuthRepository.getInstance();
  tokenService.setAuthService(authService);

  // Solicitar permisos de notificaciones push (no bloquea el inicio de la app)
  firebaseMessagingService.requestPermission().catch(error => {
    console.warn(
      '[initializeServices] Error inicializando Firebase Messaging:',
      error,
    );
  });
}
