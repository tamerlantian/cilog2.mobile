import messaging from '@react-native-firebase/messaging';

/**
 * Servicio singleton para Firebase Cloud Messaging (FCM).
 *
 * Gestiona permisos de notificaciones push y obtención del token FCM
 * que el backend requiere en el payload de login (campo `tokenFirebase`).
 *
 * Si el usuario no otorga permisos o Firebase falla, los métodos devuelven null
 * para que el flujo de login continúe sin bloquearse.
 */
class FirebaseMessagingService {
  private static instance: FirebaseMessagingService;

  private constructor() {}

  public static getInstance(): FirebaseMessagingService {
    if (!FirebaseMessagingService.instance) {
      FirebaseMessagingService.instance = new FirebaseMessagingService();
    }
    return FirebaseMessagingService.instance;
  }

  /**
   * Solicita permiso para notificaciones push.
   * @returns true si el permiso fue otorgado, false en caso contrario.
   */
  async requestPermission(): Promise<boolean> {
    try {
      const authStatus = await messaging().requestPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    } catch (error) {
      console.warn('[FirebaseMessaging] Error solicitando permisos:', error);
      return false;
    }
  }

  /**
   * Obtiene el token FCM del dispositivo.
   * Solicita permiso automáticamente si aún no ha sido otorgado.
   * @returns Token FCM como string, o null si no se puede obtener.
   */
  async getToken(): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.warn(
          '[FirebaseMessaging] Permisos de notificación no otorgados',
        );
        return null;
      }
      const token = await messaging().getToken();
      return token;
    } catch (error) {
      console.warn('[FirebaseMessaging] Error obteniendo token FCM:', error);
      return null;
    }
  }
}

export const firebaseMessagingService = FirebaseMessagingService.getInstance();
