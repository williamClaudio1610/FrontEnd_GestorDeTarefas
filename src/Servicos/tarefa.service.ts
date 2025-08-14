import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { buildApiUrl, getAuthHeaders, API_CONFIG } from './api.config';
import { Tarefa, CriarTarefa, AtualizarTarefa, TarefaResposta, EstadoTarefa, RelevanciaTarefa } from '../Modelos';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {

  constructor(private http: HttpClient) { }

  /**
   * Obter todas as tarefas
   */
  getTarefas(): Observable<TarefaResposta[]> {
    return this.http.get<TarefaResposta[]>(
      buildApiUrl(API_CONFIG.ENDPOINTS.TAREFAS),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter tarefa por ID
   */
  getTarefaById(id: number): Observable<TarefaResposta> {
    return this.http.get<TarefaResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.TAREFAS}/${id}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Criar nova tarefa
   */
  criarTarefa(tarefa: CriarTarefa): Observable<TarefaResposta> {
    return this.http.post<TarefaResposta>(
      buildApiUrl(API_CONFIG.ENDPOINTS.TAREFAS),
      tarefa,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Atualizar tarefa existente
   */
  atualizarTarefa(id: number, tarefa: AtualizarTarefa): Observable<TarefaResposta> {
    return this.http.put<TarefaResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.TAREFAS}/${id}`),
      tarefa,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Excluir tarefa
   */
  excluirTarefa(id: number): Observable<any> {
    return this.http.delete(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.TAREFAS}/${id}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Alterar estado da tarefa
   */
  alterarEstado(id: number, estado: EstadoTarefa): Observable<TarefaResposta> {
    return this.http.patch<TarefaResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.TAREFAS}/${id}/estado`),
      { estado },
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Alterar relevância da tarefa
   */
  alterarRelevancia(id: number, relevancia: RelevanciaTarefa): Observable<TarefaResposta> {
    return this.http.patch<TarefaResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.TAREFAS}/${id}/relevancia`),
      { relevancia },
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Atribuir responsável à tarefa
   */
  atribuirResponsavel(id: number, responsavelId: number): Observable<TarefaResposta> {
    return this.http.patch<TarefaResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.TAREFAS}/${id}/responsavel`),
      { responsavelId },
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Remover responsável da tarefa
   */
  removerResponsavel(id: number): Observable<TarefaResposta> {
    return this.http.patch<TarefaResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.TAREFAS}/${id}/remover-responsavel`),
      {},
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter tarefas por responsável
   */
  getTarefasPorResponsavel(responsavelId: number): Observable<TarefaResposta[]> {
    return this.http.get<TarefaResposta[]>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.TAREFAS}/responsavel/${responsavelId}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter tarefas por projeto
   */
  getTarefasPorProjeto(projectoId: number): Observable<TarefaResposta[]> {
    return this.http.get<TarefaResposta[]>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.TAREFAS}/projeto/${projectoId}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter tarefas por estado
   */
  getTarefasPorEstado(estado: EstadoTarefa): Observable<TarefaResposta[]> {
    return this.http.get<TarefaResposta[]>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.TAREFAS}/estado/${estado}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter tarefas por relevância
   */
  getTarefasPorRelevancia(relevancia: RelevanciaTarefa): Observable<TarefaResposta[]> {
    return this.http.get<TarefaResposta[]>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.TAREFAS}/relevancia/${relevancia}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter tarefas vencidas
   */
  getTarefasVencidas(): Observable<TarefaResposta[]> {
    return this.http.get<TarefaResposta[]>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.TAREFAS}/vencidas`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter tarefas próximas do vencimento
   */
  getTarefasProximasVencimento(dias: number = 7): Observable<TarefaResposta[]> {
    return this.http.get<TarefaResposta[]>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.TAREFAS}/proximas-vencimento/${dias}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter estatísticas das tarefas
   */
  getEstatisticasTarefas(): Observable<{
    total: number;
    pendentes: number;
    emAndamento: number;
    concluidas: number;
    canceladas: number;
    vencidas: number;
    porRelevancia: { [key: string]: number };
  }> {
    return this.http.get<{
      total: number;
      pendentes: number;
      emAndamento: number;
      concluidas: number;
      canceladas: number;
      vencidas: number;
      porRelevancia: { [key: string]: number };
    }>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.TAREFAS}/estatisticas`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Duplicar tarefa
   */
  duplicarTarefa(id: number): Observable<TarefaResposta> {
    return this.http.post<TarefaResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.TAREFAS}/${id}/duplicar`),
      {},
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Marcar tarefa como concluída
   */
  marcarConcluida(id: number): Observable<TarefaResposta> {
    return this.alterarEstado(id, EstadoTarefa.CONCLUIDA);
  }

  /**
   * Marcar tarefa como em andamento
   */
  marcarEmAndamento(id: number): Observable<TarefaResposta> {
    return this.alterarEstado(id, EstadoTarefa.EM_ANDAMENTO);
  }

  /**
   * Cancelar tarefa
   */
  cancelarTarefa(id: number): Observable<TarefaResposta> {
    return this.alterarEstado(id, EstadoTarefa.CANCELADA);
  }
}
