import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../Modelos/Usuario';
import { buildApiUrl, getAuthHeaders, API_CONFIG } from './api.config';
import { AuthService } from './auth.service';

export interface DadosConsolidadosUsuario {
  usuario: {
    id: number;
    nome: string;
    email: string;
    cargoId: number;
    nivelHierarquico: string;
    estado: string;
    role: string;
  };
  equipes: Array<{
    id: number;
    nome: string;
    descricao: string;
  }>;
  projetos: Array<{
    id: number;
    nome: string;
    descricao: string;
    dataInicio: string;
    dataFim: string;
    equipe: {
      id: number;
      nome: string;
      descricao: string;
    };
  }>;
  minhasTarefas: Array<{
    id: number;
    titulo: string;
    descricao: string;
    estado: string;
    prioridade: string;
    dataCriacao: string;
    dataLimite: string;
    projetoId: number;
    projetoNome: string;
  }>;
  tarefasEquipe: Array<{
    id: number;
    titulo: string;
    descricao: string;
    estado: string;
    prioridade: string;
    dataCriacao: string;
    dataLimite: string;
    projetoId: number;
    projetoNome: string;
    responsavelId: number;
    responsavelNome: string;
  }>;
}

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  message: string;
  timestamp: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Buscar dados consolidados do usuário
  getDadosConsolidados(usuarioId?: number): Observable<ApiResponse<DadosConsolidadosUsuario>> {
    // Se não foi passado ID, usar o usuário logado
    if (!usuarioId) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }
      usuarioId = currentUser.id;
    }
    
    return this.http.get<ApiResponse<DadosConsolidadosUsuario>>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.PROJECTOS}/usuario/${usuarioId}/dados-consolidados`),
      { headers: getAuthHeaders() }
    );
  }

  // Buscar usuário por ID
  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/buscar/${id}`),
      { headers: getAuthHeaders() }
    );
  }

  // Listar todos os usuários
  getUsuarios(): Observable<any> {
    return this.http.get<any>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/listar`),
      { headers: getAuthHeaders() }
    );
  }

  // Criar novo usuário
  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/criar`),
      usuario,
      { headers: getAuthHeaders() }
    );
  }

  // Atualizar usuário
  updateUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/atualizar/${id}`),
      usuario,
      { headers: getAuthHeaders() }
    );
  }

  // Deletar usuário
  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(
      buildApiUrl(`${API_CONFIG.ENDPOINTS.USUARIOS}/deletar/${id}`),
      { headers: getAuthHeaders() }
    );
  }
}
