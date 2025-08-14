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
      buildApiUrl(API_CONFIG.ENDPOINTS.EQUIPES),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter equipe por ID
   */
  getEquipeById(id: number): Observable<EquipeResposta> {
    return this.http.get<EquipeResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/${id}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Criar nova equipe
   */
  criarEquipe(equipe: CriarEquipe): Observable<EquipeResposta> {
    return this.http.post<EquipeResposta>(
      buildApiUrl(API_CONFIG.ENDPOINTS.EQUIPES),
      equipe,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Atualizar equipe existente
   */
  atualizarEquipe(id: number, equipe: AtualizarEquipe): Observable<EquipeResposta> {
    return this.http.put<EquipeResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/${id}`),
      equipe,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Excluir equipe
   */
  excluirEquipe(id: number): Observable<any> {
    return this.http.delete(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/${id}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Adicionar membro à equipe
   */
  adicionarMembro(equipeId: number, membro: AdicionarMembro): Observable<EquipeResposta> {
    return this.http.post<EquipeResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/${equipeId}/membros`),
      membro,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Remover membro da equipe
   */
  removerMembro(equipeId: number, membro: RemoverMembro): Observable<EquipeResposta> {
    return this.http.delete<EquipeResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/${equipeId}/membros/${membro.usuarioId}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter membros da equipe
   */
  getMembrosEquipe(equipeId: number): Observable<any[]> {
    return this.http.get<any[]>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/${equipeId}/membros`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter projetos da equipe
   */
  getProjectosEquipe(equipeId: number): Observable<any[]> {
    return this.http.get<any[]>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/${equipeId}/projectos`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter equipes por usuário
   */
  getEquipesPorUsuario(usuarioId: number): Observable<EquipeResposta[]> {
    return this.http.get<EquipeResposta[]>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/usuario/${usuarioId}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter equipes ativas
   */
  getEquipesAtivas(): Observable<EquipeResposta[]> {
    return this.http.get<EquipeResposta[]>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/ativas`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Enviar convite por email
   */
  enviarConviteEmail(equipeId: number, emails: string[]): Observable<any> {
    return this.http.post(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/${equipeId}/convites`),
      { emails },
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Aceitar convite
   */
  aceitarConvite(token: string): Observable<EquipeResposta> {
    return this.http.post<EquipeResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/convites/aceitar`),
      { token },
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Rejeitar convite
   */
  rejeitarConvite(token: string): Observable<any> {
    return this.http.post(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/convites/rejeitar`),
      { token },
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter convites pendentes
   */
  getConvitesPendentes(): Observable<any[]> {
    return this.http.get<any[]>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/convites/pendentes`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter estatísticas da equipe
   */
  getEstatisticasEquipe(id: number): Observable<{
    totalMembros: number;
    totalProjectos: number;
    projectosAtivos: number;
    projectosFinalizados: number;
    totalTarefas: number;
    tarefasPendentes: number;
    tarefasEmAndamento: number;
    tarefasConcluidas: number;
  }> {
    return this.http.get<{
      totalMembros: number;
      totalProjectos: number;
      projectosAtivos: number;
      projectosFinalizados: number;
      totalTarefas: number;
      tarefasPendentes: number;
      tarefasEmAndamento: number;
      tarefasConcluidas: number;
    }>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/${id}/estatisticas`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter estatísticas gerais das equipes
   */
  getEstatisticasGerais(): Observable<{
    total: number;
    ativas: number;
    totalMembros: number;
    mediaMembrosPorEquipe: number;
    equipesComMaisProjectos: { nome: string; total: number }[];
  }> {
    return this.http.get<{
      total: number;
      ativas: number;
      totalMembros: number;
      mediaMembrosPorEquipe: number;
      equipesComMaisProjectos: { nome: string; total: number }[];
    }>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/estatisticas-gerais`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Duplicar equipe
   */
  duplicarEquipe(id: number, novoNome?: string): Observable<EquipeResposta> {
    const payload = novoNome ? { novoNome } : {};
    return this.http.post<EquipeResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/${id}/duplicar`),
      payload,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter hierarquia da equipe
   */
  getHierarquiaEquipe(id: number): Observable<{
    lider: any;
    membros: any[];
    estrutura: any;
  }> {
    return this.http.get<{
      lider: any;
      membros: any[];
      estrutura: any;
    }>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/${id}/hierarquia`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Definir líder da equipe
   */
  definirLider(equipeId: number, usuarioId: number): Observable<EquipeResposta> {
    return this.http.patch<EquipeResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.EQUIPES}/${equipeId}/lider`),
      { usuarioId },
      { headers: getAuthHeaders() }
    );
  }
}
