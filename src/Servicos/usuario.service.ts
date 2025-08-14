import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { buildApiUrl, getAuthHeaders, API_CONFIG } from './api.config';
import { Usuario, CriarUsuario, AtualizarUsuario, UsuarioResposta } from '../Modelos';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  /**
   * Obter todos os usuários
   */
  getUsuarios(): Observable<UsuarioResposta[]> {
    return this.http.get<UsuarioResposta[]>(
      buildApiUrl(API_CONFIG.ENDPOINTS.USUARIOS),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter usuário por ID
   */
  getUsuarioById(id: number): Observable<UsuarioResposta> {
    return this.http.get<UsuarioResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/${id}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter usuário por email
   */
  getUsuarioByEmail(email: string): Observable<UsuarioResposta> {
    return this.http.get<UsuarioResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/email/${email}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Criar novo usuário
   */
  criarUsuario(usuario: CriarUsuario): Observable<UsuarioResposta> {
    return this.http.post<UsuarioResposta>(
      buildApiUrl(API_CONFIG.ENDPOINTS.USUARIOS),
      usuario,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Atualizar usuário existente
   */
  atualizarUsuario(id: number, usuario: AtualizarUsuario): Observable<UsuarioResposta> {
    return this.http.put<UsuarioResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/${id}`),
      usuario,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Excluir usuário
   */
  excluirUsuario(id: number): Observable<any> {
    return this.http.delete(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/${id}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Ativar usuário
   */
  ativarUsuario(id: number): Observable<UsuarioResposta> {
    return this.http.patch<UsuarioResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/${id}/ativar`),
      {},
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Desativar usuário
   */
  desativarUsuario(id: number): Observable<UsuarioResposta> {
    return this.http.patch<UsuarioResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/${id}/desativar`),
      {},
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Suspender usuário
   */
  suspenderUsuario(id: number): Observable<UsuarioResposta> {
    return this.http.patch<UsuarioResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/${id}/suspender`),
      {},
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter usuários por equipe
   */
  getUsuariosPorEquipe(equipeId: number): Observable<UsuarioResposta[]> {
    return this.http.get<UsuarioResposta[]>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/equipe/${equipeId}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter usuários por projeto
   */
  getUsuariosPorProjeto(projetoId: number): Observable<UsuarioResposta[]> {
    return this.http.get<UsuarioResposta[]>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/projeto/${projetoId}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter usuários por cargo
   */
  getUsuariosPorCargo(cargoId: number): Observable<UsuarioResposta[]> {
    return this.http.get<UsuarioResposta[]>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/cargo/${cargoId}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Alterar senha do usuário
   */
  alterarSenha(id: number, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/${id}/alterar-senha`),
      { oldPassword, newPassword },
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Redefinir senha do usuário (admin)
   */
  redefinirSenha(id: number, newPassword: string): Observable<any> {
    return this.http.post(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/${id}/redefinir-senha`),
      { newPassword },
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter perfil do usuário atual
   */
  getPerfil(): Observable<UsuarioResposta> {
    return this.http.get<UsuarioResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/perfil`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Atualizar perfil do usuário atual
   */
  atualizarPerfil(usuario: AtualizarUsuario): Observable<UsuarioResposta> {
    return this.http.put<UsuarioResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/perfil`),
      usuario,
      { headers: getAuthHeaders() }
    );
  }
}
