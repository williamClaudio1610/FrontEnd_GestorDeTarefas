import { Usuario } from "./Usuario";

// Interface para o modelo Cargo
export interface Cargo {
  id: number;
  nome: string;
  descricao?: string;
  usuarios?: Usuario[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para criação de cargo
export interface CriarCargo {
  nome: string;
  descricao?: string;
}

// Interface para atualização de cargo
export interface AtualizarCargo {
  nome?: string;
  descricao?: string;
}
