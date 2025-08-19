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
      buildApiUrl(`${API_CONFIG.ENDPOINTS.CARGOS}/listar`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Obter cargo por ID
   */
  getCargoById(id: number): Observable<Cargo> {
    return this.http.get<Cargo>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.CARGOS}/buscar/${id}`),
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Criar novo cargo
   */
  criarCargo(cargo: CriarCargo): Observable<Cargo> {
    return this.http.post<Cargo>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.CARGOS}/criar`),
      cargo,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Atualizar cargo existente
   */
  atualizarCargo(id: number, cargo: AtualizarCargo): Observable<Cargo> {
    return this.http.put<Cargo>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.CARGOS}/atualizar/${id}`),
      cargo,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Excluir cargo
   */
  excluirCargo(id: number): Observable<any> {
    return this.http.delete(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.CARGOS}/deletar/${id}`),
      { headers: getAuthHeaders() }
    );
  }
}
