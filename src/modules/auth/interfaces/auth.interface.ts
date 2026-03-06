/** Valores que el usuario ingresa en el formulario de login */
export interface LoginFormValues {
  username: string;
  password: string;
}

/** Valores que el usuario ingresa en el formulario de registro */
export interface RegisterFormValues {
  username: string;
  password: string;
  confirmarPassword: string;
  celular: string;
  aceptarTerminosCondiciones: boolean;
}
