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
      buildApiUrl(API_CONFIG.ENDPOINTS.PROJECTOS),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter projeto por ID
   */
  getProjectoById(id: number): Observable<ProjectoResposta> {
    return this.http.get<ProjectoResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.PROJECTOS}/${id}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Criar novo projeto
   */
  criarProjecto(projecto: CriarProjecto): Observable<ProjectoResposta> {
    return this.http.post<ProjectoResposta>(
      buildApiUrl(API_CONFIG.ENDPOINTS.PROJECTOS),
      projecto,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Atualizar projeto existente
   */
  atualizarProjecto(id: number, projecto: AtualizarProjecto): Observable<ProjectoResposta> {
    return this.http.put<ProjectoResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.PROJECTOS}/${id}`),
      projecto,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Excluir projeto
   */
  excluirProjecto(id: number): Observable<any> {
    return this.http.delete(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.PROJECTOS}/${id}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter projetos por equipe
   */
  getProjectosPorEquipe(equipeId: number): Observable<ProjectoResposta[]> {
    return this.http.get<ProjectoResposta[]>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.PROJECTOS}/equipe/${equipeId}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter projetos ativos
   */
  getProjectosAtivos(): Observable<ProjectoResposta[]> {
    return this.http.get<ProjectoResposta[]>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.PROJECTOS}/ativos`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter projetos finalizados
   */
  getProjectosFinalizados(): Observable<ProjectoResposta[]> {
    return this.http.get<ProjectoResposta[]>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.PROJECTOS}/finalizados`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter projetos por período
   */
  getProjectosPorPeriodo(dataInicio: string, dataFim: string): Observable<ProjectoResposta[]> {
    return this.http.get<ProjectoResposta[]>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.PROJECTOS}/periodo`),
      { 
        headers: getAuthHeaders(),
        params: { dataInicio, dataFim }
      }
    );
  }

  /**
   * Finalizar projeto
   */
  finalizarProjecto(id: number, dataFim?: string): Observable<ProjectoResposta> {
    const payload = dataFim ? { dataFim } : {};
    return this.http.patch<ProjectoResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.PROJECTOS}/${id}/finalizar`),
      payload,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Reativar projeto
   */
  reativarProjecto(id: number): Observable<ProjectoResposta> {
    return this.http.patch<ProjectoResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.PROJECTOS}/${id}/reativar`),
      {},
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter estatísticas do projeto
   */
  getEstatisticasProjecto(id: number): Observable<{
    totalTarefas: number;
    tarefasPendentes: number;
    tarefasEmAndamento: number;
    tarefasConcluidas: number;
    tarefasVencidas: number;
    progresso: number;
    tempoRestante?: number;
  }> {
    return this.http.get<{
      totalTarefas: number;
      tarefasPendentes: number;
      tarefasEmAndamento: number;
      tarefasConcluidas: number;
      tarefasVencidas: number;
      progresso: number;
      tempoRestante?: number;
    }>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.PROJECTOS}/${id}/estatisticas`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter estatísticas gerais dos projetos
   */
  getEstatisticasGerais(): Observable<{
    total: number;
    ativos: number;
    finalizados: number;
    atrasados: number;
    porEquipe: { [key: string]: number };
  }> {
    return this.http.get<{
      total: number;
      ativos: number;
      finalizados: number;
      atrasados: number;
      porEquipe: { [key: string]: number };
    }>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.PROJECTOS}/estatisticas-gerais`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Duplicar projeto
   */
  duplicarProjecto(id: number, novoNome?: string): Observable<ProjectoResposta> {
    const payload = novoNome ? { novoNome } : {};
    return this.http.post<ProjectoResposta>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.PROJECTOS}/${id}/duplicar`),
      payload,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter cronograma do projeto
   */
  getCronogramaProjecto(id: number): Observable<{
    dataInicio: Date;
    dataFim?: Date;
    marcos: any[];
    dependencias: any[];
  }> {
    return this.http.get<{
      dataInicio: Date;
      dataFim?: Date;
      marcos: any[];
      dependencias: any[];
    }>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.PROJECTOS}/${id}/cronograma`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Exportar projeto
   */
  exportarProjecto(id: number, formato: 'pdf' | 'excel' = 'pdf'): Observable<Blob> {
    return this.http.get(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.PROJECTOS}/${id}/exportar/${formato}`),
      { 
        headers: getAuthHeaders(),
        responseType: 'blob'
      }
    );
  }
}
