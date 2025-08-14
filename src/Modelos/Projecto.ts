import { Equipe } from "./Equipe";
import { Tarefa } from "./Tarefa";

// Interface base para Projecto
export interface Projecto {
  id: number;
  nome: string;
  descricao: string;
  dataInicio: Date;
  dataFim?: Date;
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
  dataFim?: string;
  equipeId: number;
}

// Interface para atualização de projeto
export interface AtualizarProjecto {
  nome?: string;
  descricao?: string;
  dataInicio?: string;
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
  equipe?: Equipe;
  tarefas?: Tarefa[];
  createdAt?: Date;
  updatedAt?: Date;
}
