import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { buildApiUrl, getAuthHeaders, API_CONFIG } from './api.config';
import { Equipe, CriarEquipe, AtualizarEquipe, EquipeResposta, AdicionarMembro, RemoverMembro } from '../Modelos';

@Injectable({
  providedIn: 'root'
})
export class EquipeService {

  constructor(private http: HttpClient) { }

  /**
   * Obter todas as equipes
   */
  getEquipes(): Observable<EquipeResposta[]> {
    return this.http.get<EquipeResposta[]>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/listar`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter equipe por ID
   */
  getEquipeById(id: number): Observable<EquipeResposta> {
    return this.http.get<EquipeResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/buscar/${id}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Criar nova equipe
   */
  criarEquipe(equipe: CriarEquipe): Observable<EquipeResposta> {
    return this.http.post<EquipeResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/criar`),
      equipe,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Atualizar equipe existente
   */
  atualizarEquipe(id: number, equipe: AtualizarEquipe): Observable<EquipeResposta> {
    return this.http.put<EquipeResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/atualizar/${id}`),
      equipe,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Excluir equipe
   */
  excluirEquipe(id: number): Observable<any> {
    return this.http.delete(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/deletar/${id}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Adicionar membro à equipe
   */
  adicionarMembro(equipeId: number, membro: AdicionarMembro): Observable<EquipeResposta> {
    return this.http.post<EquipeResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/${equipeId}/adicionar-membro`),
      membro,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Remover membro da equipe
   */
  removerMembro(equipeId: number, membro: RemoverMembro): Observable<EquipeResposta> {
    return this.http.request<EquipeResposta>('DELETE',
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/${equipeId}/remover-membro`),
      { headers: getAuthHeaders(), body: membro }
    );
  }
}
