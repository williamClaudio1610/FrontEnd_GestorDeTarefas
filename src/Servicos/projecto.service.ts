import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { buildApiUrl, getAuthHeaders, API_CONFIG } from './api.config';
import { Projecto, CriarProjecto, AtualizarProjecto, ProjectoResposta } from '../Modelos';

@Injectable({
  providedIn: 'root'
})
export class ProjectoService {

  constructor(private http: HttpClient) { }

  /**
   * Obter todos os projetos
   */
  getProjectos(): Observable<ProjectoResposta[]> {
    return this.http.get<ProjectoResposta[]>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.PROJECTOS}/listar`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter projeto por ID
   */
  getProjectoById(id: number): Observable<ProjectoResposta> {
    return this.http.get<ProjectoResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.PROJECTOS}/buscar/${id}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Criar novo projeto
   */
  criarProjecto(projecto: CriarProjecto): Observable<ProjectoResposta> {
    return this.http.post<ProjectoResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.PROJECTOS}/criar`),
      projecto,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Atualizar projeto existente
   */
  atualizarProjecto(id: number, projecto: AtualizarProjecto): Observable<ProjectoResposta> {
    return this.http.put<ProjectoResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.PROJECTOS}/atualizar/${id}`),
      projecto,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Excluir projeto
   */
  excluirProjecto(id: number): Observable<any> {
    return this.http.delete(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.PROJECTOS}/deletar/${id}`),
      { headers: getAuthHeaders() }
    );
  }

  // Métodos extra removidos por não existirem no backend atual
}
