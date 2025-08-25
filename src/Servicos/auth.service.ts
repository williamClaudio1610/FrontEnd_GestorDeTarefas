import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { buildApiUrl, getAuthHeaders, API_CONFIG } from './api.config';
import { Usuario, LoginUsuario, CriarUsuario, UsuarioResposta, Role } from '../Modelos';
import { environment } from '../environments/environment';

export interface LoginResponse {
  token: string;
  usuario: Usuario;
  message?: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.checkStoredUser();
  }

  /**
   * Fazer login do usuário
   */
  login(credentials: LoginUsuario): Observable<LoginResponse> {
    return this.http.post<any>(
      buildApiUrl(API_CONFIG.ENDPOINTS.AUTH + '/login'),
      credentials
    ).pipe(
      tap(response => {
        console.log('Resposta bruta do login:', response);
        
        // Extrair token e usuário da estrutura real: response.data.access_token e response.data.user
        let token = null;
        let usuario = null;
        
        if (response?.data?.access_token && response?.data?.user) {
          token = response.data.access_token;
          usuario = response.data.user;
        } else if (response?.access_token && response?.user) {
          token = response.access_token;
          usuario = response.user;
        } else if (response?.token && response?.usuario) {
          token = response.token;
          usuario = response.usuario;
        }
        
        console.log('Token extraído:', token);
        console.log('Usuário extraído:', usuario);
        
        if (token && usuario && isPlatformBrowser(this.platformId)) {
          localStorage.setItem(environment.auth.tokenKey, token);
          localStorage.setItem(environment.auth.userKey, JSON.stringify(usuario));
          this.currentUserSubject.next(usuario);
        }
      }),
      map(response => {
        // Retornar no formato padrão esperado
        let token = null;
        let usuario = null;
        
        if (response?.data?.access_token && response?.data?.user) {
          token = response.data.access_token;
          usuario = response.data.user;
        } else if (response?.access_token && response?.user) {
          token = response.access_token;
          usuario = response.user;
        } else if (response?.token && response?.usuario) {
          token = response.token;
          usuario = response.usuario;
        }
        
        return {
          token: token || '',
          usuario: usuario || {},
          message: response?.message || 'Login realizado com sucesso',
          success: true
        };
      })
    );
  }

  /**
   * Fazer logout do usuário
   */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(environment.auth.tokenKey);
      localStorage.removeItem(environment.auth.userKey);
    }
    this.currentUserSubject.next(null);
  }

  /**
   * Verificar se usuário está autenticado
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Obter token de autenticação
   */
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(environment.auth.tokenKey);
    }
    return null;
  }

  /**
   * Obter usuário atual
   */
  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verificar se usuário tem role específica
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.role) return false;
    
    const userRole = user.role.toLowerCase();
    const checkRole = role.toLowerCase();
    
    return userRole === checkRole;
  }

  /**
   * Verificar se usuário é admin
   */
  isAdmin(): boolean {
    return this.hasRole(Role.ADMIN) || this.hasRole('admin');
  }

  /**
   * Verificar se usuário é user comum
   */
  isUser(): boolean {
    return this.hasRole(Role.USER) || this.hasRole('user');
  }

  /**
   * Atualizar usuário atual
   */
  updateCurrentUser(user: Usuario): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(environment.auth.userKey, JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  /**
   * Verificar usuário armazenado no localStorage
   */
  private checkStoredUser(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem(environment.auth.userKey);
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          this.currentUserSubject.next(user);
        } catch (error) {
          console.error('Erro ao parsear usuário armazenado:', error);
          localStorage.removeItem(environment.auth.userKey);
        }
      }
    }
  }

  /**
   * Renovar token
   */
  refreshToken(): Observable<any> {
    return this.http.post<any>(
      buildApiUrl(API_CONFIG.ENDPOINTS.AUTH + '/refresh'),
      {},
      { headers: getAuthHeaders() }
    ).pipe(
      tap(response => {
        if (response.token && isPlatformBrowser(this.platformId)) {
          localStorage.setItem(environment.auth.tokenKey, response.token);
        }
      })
    );
  }
}
