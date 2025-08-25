import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../Modelos/Usuario';
import { API_CONFIG } from './api.config';
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
    equipeId: number;
    equipeNome: string;
    estado: string;
    dataInicio: string;
    dataFim: string;
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
  private apiUrl = API_CONFIG.BASE_URL;

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
    
    return this.http.get<ApiResponse<DadosConsolidadosUsuario>>(`${this.apiUrl}/projectos/usuario/${usuarioId}/dados-consolidados`);
  }

  // Buscar usuário por ID
  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/usuarios/${id}`);
  }

  // Listar todos os usuários
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`);
  }

  // Criar novo usuário
  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, usuario);
  }

  // Atualizar usuário
  updateUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${id}`, usuario);
  }

  // Deletar usuário
  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuarios/${id}`);
  }
}
