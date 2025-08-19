import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { buildApiUrl, getAuthHeaders, API_CONFIG } from './api.config';
import { Tarefa, CriarTarefa, AtualizarTarefa, TarefaResposta } from '../Modelos';

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
      buildApiUrl(`${API_CONFIG.ENDPOINTS.TAREFAS}/listar`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter tarefa por ID
   */
  getTarefaById(id: number): Observable<TarefaResposta> {
    return this.http.get<TarefaResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.TAREFAS}/buscar/${id}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Criar nova tarefa
   */
  criarTarefa(tarefa: CriarTarefa): Observable<TarefaResposta> {
    return this.http.post<TarefaResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.TAREFAS}/criar`),
      tarefa,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Atualizar tarefa existente
   */
  atualizarTarefa(id: number, tarefa: AtualizarTarefa): Observable<TarefaResposta> {
    return this.http.put<TarefaResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.TAREFAS}/atualizar/${id}`),
      tarefa,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Excluir tarefa
   */
  excluirTarefa(id: number): Observable<any> {
    return this.http.delete(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.TAREFAS}/deletar/${id}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter tarefas vencidas
   */
  getTarefasVencidas(): Observable<TarefaResposta[]> {
    return this.http.get<TarefaResposta[]>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.TAREFAS}/buscar/vencidas`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter tarefas próximas do vencimento
   */
  getTarefasProximasVencimento(dias: number = 7): Observable<TarefaResposta[]> {
    return this.http.get<TarefaResposta[]>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.TAREFAS}/buscar/proximas-vencimento`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter estatísticas das tarefas
   */
  // Métodos extra removidos por não existirem no backend atual
}
