import { Equipe } from "./Equipe";
import { Tarefa } from "./Tarefa";

// Enum para estados do projeto
export enum EstadoProjecto {
  EM_ANDAMENTO = 'em_andamento',
  CONCLUIDO = 'concluido',
  CANCELADO = 'cancelado'
}

// Interface base para Projecto
export interface Projecto {
  id: number;
  nome: string;
  descricao: string;
  dataInicio: Date;
  dataFim?: Date;
  estado: EstadoProjecto;
  equipeId: number;
  equipe?: Equipe;
  tarefas?: Tarefa[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para criação de projeto
export interface CriarProjecto {
  nome: string;
  descricao: string;
  dataInicio: string;
  estado?: EstadoProjecto;
  dataFim?: string;
  equipeId: number;
}

// Interface para atualização de projeto
export interface AtualizarProjecto {
  nome?: string;
  descricao?: string;
  dataInicio?: string;
  estado?: EstadoProjecto;
  dataFim?: string;
  equipeId?: number;
}

// Interface para resposta de projeto
export interface ProjectoResposta {
  id: number;
  nome: string;
  descricao: string;
  dataInicio: Date;
  dataFim?: Date;
  estado: EstadoProjecto;
  equipe?: {
    id: number;
    nome: string;
    descricao: string;
    liderId: number;
    lider: {
      id: number;
      nome: string;
      email: string;
      nivelHierarquico: string;
    } | null;
  } | null;
  tarefas?: Array<{
    id: number;
    titulo: string;
    descricao: string;
    estado: string;
    relevancia: string;
    dataLimite: Date;
    responsavel: {
      id: number;
      nome: string;
      email: string;
      cargoId: number;
      nivelHierarquico: string;
      estado: string;
      role: string;
    } | null;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}
