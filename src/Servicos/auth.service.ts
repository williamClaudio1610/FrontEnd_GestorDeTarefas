import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { buildApiUrl, getAuthHeaders, API_CONFIG } from './api.config';
import { Usuario, LoginUsuario, CriarUsuario, UsuarioResposta } from '../Modelos';

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
  login(credentials: LoginUsuario): Observable<any> {
    return this.http.post<any>(
      buildApiUrl(API_CONFIG.ENDPOINTS.AUTH + '/login'),
      credentials
    ).pipe(
      tap(response => {
        if (response.token && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.usuario));
          this.currentUserSubject.next(response.usuario);
        }
      })
    );
  }

  /**
   * Registrar novo usuário
   */
  register(userData: CriarUsuario): Observable<UsuarioResposta> {
    return this.http.post<UsuarioResposta>(
      buildApiUrl(API_CONFIG.ENDPOINTS.AUTH + '/register'),
      userData
    );
  }

  /**
   * Fazer logout do usuário
   */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
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
      return localStorage.getItem('token');
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
    return user ? user.role === role : false;
  }

  /**
   * Verificar se usuário é admin
   */
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  /**
   * Atualizar usuário atual
   */
  updateCurrentUser(user: Usuario): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  /**
   * Verificar usuário armazenado no localStorage
   */
  private checkStoredUser(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          this.currentUserSubject.next(user);
        } catch (error) {
          console.error('Erro ao parsear usuário armazenado:', error);
          localStorage.removeItem('currentUser');
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
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  /**
   * Alterar senha
   */
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post<any>(
      buildApiUrl(API_CONFIG.ENDPOINTS.AUTH + '/change-password'),
      { oldPassword, newPassword },
      { headers: getAuthHeaders() }
    );
  }
}
