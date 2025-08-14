import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { buildApiUrl, getAuthHeaders, API_CONFIG } from './api.config';
import { Cargo, CriarCargo, AtualizarCargo } from '../Modelos';

@Injectable({
  providedIn: 'root'
})
export class CargoService {

  constructor(private http: HttpClient) { }

  /**
   * Obter todos os cargos
   */
  getCargos(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(
      buildApiUrl(API_CONFIG.ENDPOINTS.CARGOS),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter cargo por ID
   */
  getCargoById(id: number): Observable<Cargo> {
    return this.http.get<Cargo>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.CARGOS}/${id}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter cargo por nome
   */
  getCargoByNome(nome: string): Observable<Cargo> {
    return this.http.get<Cargo>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.CARGOS}/nome/${nome}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Criar novo cargo
   */
  criarCargo(cargo: CriarCargo): Observable<Cargo> {
    return this.http.post<Cargo>(
      buildApiUrl(API_CONFIG.ENDPOINTS.CARGOS),
      cargo,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Atualizar cargo existente
   */
  atualizarCargo(id: number, cargo: AtualizarCargo): Observable<Cargo> {
    return this.http.put<Cargo>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.CARGOS}/${id}`),
      cargo,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Excluir cargo
   */
  excluirCargo(id: number): Observable<any> {
    return this.http.delete(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.CARGOS}/${id}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter usuários por cargo
   */
  getUsuariosPorCargo(cargoId: number): Observable<any[]> {
    return this.http.get<any[]>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.CARGOS}/${cargoId}/usuarios`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Verificar se cargo pode ser excluído (sem usuários associados)
   */
  podeExcluirCargo(id: number): Observable<{ podeExcluir: boolean; motivo?: string }> {
    return this.http.get<{ podeExcluir: boolean; motivo?: string }>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.CARGOS}/${id}/pode-excluir`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter estatísticas do cargo
   */
  getEstatisticasCargo(id: number): Observable<{
    totalUsuarios: number;
    usuariosAtivos: number;
    usuariosInativos: number;
    nivelHierarquicoMaisComum: string;
  }> {
    return this.http.get<{
      totalUsuarios: number;
      usuariosAtivos: number;
      usuariosInativos: number;
      nivelHierarquicoMaisComum: string;
    }>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.CARGOS}/${id}/estatisticas`),
      { headers: getAuthHeaders() }
    );
  }
}
