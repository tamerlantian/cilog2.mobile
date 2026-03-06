import axios from 'axios';
import { HttpBaseRepository } from '../../../core/repositories/http-base.repository';
import {
  ApiLoginResponse,
  LoginCredentials,
  RefreshTokenResponse,
  RegisterCredentials,
  RegisterResponse,
} from '../models/Auth';
import { IAuthService } from '../../../core/interfaces/auth-service.interface';
import { environment } from '../../../config/environment';

/**
 * Repositorio para manejar las operaciones de API relacionadas con autenticación
 * Implementa el patrón Singleton para evitar múltiples instancias
 */
export class AuthRepository extends HttpBaseRepository implements IAuthService {
  private static instance: AuthRepository;

  private constructor() {
    super();
  }

  public static getInstance(): AuthRepository {
    if (!AuthRepository.instance) {
      AuthRepository.instance = new AuthRepository();
    }
    return AuthRepository.instance;
  }

  async login(credentials: LoginCredentials): Promise<ApiLoginResponse> {
    return this.post<ApiLoginResponse>('api/usuario/autenticar', credentials);
  }

  async register(userData: RegisterCredentials): Promise<RegisterResponse> {
    return this.post<RegisterResponse>('api/usuario/nuevo', userData);
  }

  async forgotPassword(username: string): Promise<boolean> {
    return this.post<boolean>('contenedor/usuario/cambio-clave-solicitar/', {
      username,
    });
  }

  async logout(): Promise<boolean> {
    return this.post<boolean>('seguridad/logout/', {});
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const directAxios = axios.create({
      baseURL: environment.apiBase,
      headers: { 'Content-Type': 'application/json' },
    });
    const response = await directAxios.post<RefreshTokenResponse>(
      '/seguridad/token/refresh/',
      { refresh: refreshToken },
    );
    return response.data;
  }
}
