// Interfaces para el módulo de autenticación

// Interfaz para las credenciales de login
export interface LoginCredentials {
  username: string;
  password: string;
  tokenFirebase: string | null;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  confirmarPassword: string;
  aceptarTerminosCondiciones: boolean;
  celular: string;
  aplicacion: string;
}

// Respuesta real del backend (sin JWT)
export interface ApiLoginResponse {
  autenticar: boolean;
  usuario: AuthUser;
}

// Interfaz para el usuario autenticado (campos reales del backend)
export interface AuthUser {
  codigo: number;
  usuario: string; // email del usuario
  nombre: string;
  urlImagen: string;
  codigoCelda: string;
  codigoPanal: string;
  codigoCiudad: string;
  codigoPuesto: string;
  codigoTercero: string;
  codigoOperador: string;
  calidadImagen: string;
  codigoOperacion: string;
  celda: string;
  operador: string;
  puntoServicio: string;
  puntoServicioToken: string;
}

export interface RegisterResponse {
  usuario: AuthUser;
}

// Interfaz para el estado de autenticación
export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

// Mantenido para compatibilidad con IAuthService / token.service (no usado activamente)
export interface RefreshTokenResponse {
  access: string;
}

/** Solo el campo que el usuario ingresa. `aplicacion` se inyecta en el controller. */
export type ForgotPasswordFormValues = {
  username: string;
};
