/**
 * Tipos de navegación para toda la aplicación
 */

/**
 * Parámetros para el stack raíz de la aplicación
 */
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

/**
 * Parámetros para el stack de autenticación
 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

/**
 * Parámetros para el stack principal (aplicación autenticada)
 */
export type MainStackParamList = {
  HomeTabs: undefined;
  Profile: undefined;
  About: undefined;
};

/**
 * Parámetros para las tabs principales
 */
export type MainTabParamList = {
  Dashboard: undefined;
  Settings: undefined;
};
