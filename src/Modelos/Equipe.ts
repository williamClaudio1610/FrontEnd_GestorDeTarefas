import { Usuario } from "./Usuario";
import { Projecto } from "./Projecto";

// Interface base para Equipe
export interface Equipe {
  id: number;
  nome: string;
  descricao: string;
  membros?: Usuario[];
  projectos?: Projecto[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para criação de equipe
export interface CriarEquipe {
  nome: string;
  descricao: string;
  membrosIds?: number[];
  emailsConvite?: string[];
}

// Interface para atualização de equipe
export interface AtualizarEquipe {
  nome?: string;
  descricao?: string;
  membrosIds?: number[];
}

// Interface para adicionar membro
export interface AdicionarMembro {
  usuarioId: number;
}

// Interface para remover membro
export interface RemoverMembro {
  usuarioId: number;
}

// Interface para resposta de equipe
export interface EquipeResposta {
  id: number;
  nome: string;
  descricao: string;
  membros?: Usuario[];
  projectos?: Projecto[];
  createdAt?: Date;
  updatedAt?: Date;
}
