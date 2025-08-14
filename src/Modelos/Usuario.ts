import { Cargo } from "./Cargo";
import { Equipe } from "./Equipe";
import { Tarefa } from "./Tarefa";

// Enums para o modelo Usuario
export enum Role {
  ADMIN = 'admin',
  USER = 'user'
}

export enum NivelHierarquico {
  ESTAGIARIO = 'estagiario',
  JUNIOR = 'junior',
  PLENO = 'pleno',
  SENIOR = 'senior',
  LIDER = 'lider',
  GERENTE = 'gerente',
  DIRETOR = 'diretor'
}

export enum EstadoUsuario {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  SUSPENSO = 'suspenso',
  DEMITIDO = 'demitido'
}

// Interface base para Usuario
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  cargoId: number;
  nivelHierarquico: NivelHierarquico;
  estado: EstadoUsuario;
  role: Role;
  equipas?: Equipe[];
  tarefas?: Tarefa[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para criação de usuário
export interface CriarUsuario {
  nome: string;
  email: string;
  telefone?: string;
  senha: string;
  cargoId: number;
  nivelHierarquico: NivelHierarquico;
  estado: EstadoUsuario;
  role: Role;
}

// Interface para atualização de usuário
export interface AtualizarUsuario {
  nome?: string;
  email?: string;
  telefone?: string;
  senha?: string;
  cargoId?: number;
  nivelHierarquico?: NivelHierarquico;
  estado?: EstadoUsuario;
  role?: Role;
}

// Interface para login
export interface LoginUsuario {
  email: string;
  senha: string;
}

// Interface para resposta de usuário (sem dados sensíveis)
export interface UsuarioResposta {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  cargoId: number;
  equipas?: Equipe[];
  tarefas?: Equipe[];
  nivelHierarquico: NivelHierarquico;
  estado: EstadoUsuario;
  role: Role;
}
