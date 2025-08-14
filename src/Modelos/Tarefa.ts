import { Usuario } from "./Usuario";
import { Projecto } from "./Projecto";

// Enums para o modelo Tarefa
export enum EstadoTarefa {
  PENDENTE = 'pendente',
  EM_ANDAMENTO = 'emandamento',
  CONCLUIDA = 'concluida',
  CANCELADA = 'cancelada'
}

export enum RelevanciaTarefa {
  BAIXO = 'baixo',
  MEDIO = 'medio',
  ALTO = 'alto'
}

// Interface base para Tarefa
export interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  estado: EstadoTarefa;
  relevancia: RelevanciaTarefa;
  dataLimite: Date;
  responsavelId?: number;
  projectoId: number;
  responsavel?: Usuario;
  projecto?: Projecto;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para criação de tarefa
export interface CriarTarefa {
  titulo: string;
  descricao: string;
  estado?: EstadoTarefa;
  relevancia: RelevanciaTarefa;
  dataLimite: string;
  responsavelId?: number;
  projectoId: number;
}

// Interface para atualização de tarefa
export interface AtualizarTarefa {
  titulo?: string;
  descricao?: string;
  estado?: EstadoTarefa;
  relevancia?: RelevanciaTarefa;
  dataLimite?: string;
  responsavelId?: number;
  projectoId?: number;
}

// Interface para resposta de tarefa
export interface TarefaResposta {
  id: number;
  titulo: string;
  descricao: string;
  estado: EstadoTarefa;
  relevancia: RelevanciaTarefa;
  dataLimite: Date;
  responsavel?: Usuario;
  projecto?: Projecto;
  createdAt?: Date;
  updatedAt?: Date;
}
