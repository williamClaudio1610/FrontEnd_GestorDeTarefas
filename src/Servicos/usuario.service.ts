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
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/listar`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter usuário por ID
   */
  getUsuarioById(id: number): Observable<UsuarioResposta> {
    return this.http.get<UsuarioResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/buscar/${id}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Criar novo usuário
   */
  criarUsuario(usuario: CriarUsuario): Observable<UsuarioResposta> {
    return this.http.post<UsuarioResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/criar`),
      usuario,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Atualizar usuário existente
   */
  atualizarUsuario(id: number, usuario: AtualizarUsuario): Observable<UsuarioResposta> {
    return this.http.put<UsuarioResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/atualizar/${id}`),
      usuario,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Excluir usuário
   */
  excluirUsuario(id: number): Observable<any> {
    return this.http.delete(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/deletar/${id}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter perfil do usuário atual
   */
  getPerfil(): Observable<UsuarioResposta> {
    return this.http.get<UsuarioResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/perfil/meu`),
      { headers: getAuthHeaders() }
    );
  }

}
