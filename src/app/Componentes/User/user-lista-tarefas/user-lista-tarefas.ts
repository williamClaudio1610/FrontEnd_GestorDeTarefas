import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService, DadosConsolidadosUsuario } from '../../../../Servicos/usuario.service';

@Component({
  selector: 'app-user-lista-tarefas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-lista-tarefas.html',
  styleUrl: './user-lista-tarefas.css'
})
export class UserListaTarefasComponent implements OnInit {
  minhasTarefas: DadosConsolidadosUsuario['minhasTarefas'] = [];
  tarefasEquipe: DadosConsolidadosUsuario['tarefasEquipe'] = [];
  loading = true;
  error = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.carregarTarefas();
  }

  carregarTarefas(): void {
    this.loading = true;
    
    this.usuarioService.getDadosConsolidados().subscribe({
      next: (response) => {
        if (response.success) {
          this.minhasTarefas = response.data.minhasTarefas;
          this.tarefasEquipe = response.data.tarefasEquipe;
        } else {
          this.error = response.message || 'Erro ao carregar tarefas';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao conectar com o servidor';
        this.loading = false;
        console.error('Erro ao carregar tarefas:', err);
      }
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'pendente':
        return 'estado-pendente';
      case 'em_andamento':
        return 'estado-em-andamento';
      case 'concluida':
        return 'estado-concluida';
      case 'pausada':
        return 'estado-pausada';
      case 'cancelada':
        return 'estado-cancelada';
      default:
        return 'estado-padrao';
    }
  }

  getEstadoLabel(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'pendente':
        return 'Pendente';
      case 'em_andamento':
        return 'Em Andamento';
      case 'concluida':
        return 'Concluída';
      case 'pausada':
        return 'Pausada';
      case 'cancelada':
        return 'Cancelada';
      default:
        return estado || 'Não definido';
    }
  }

  getPrioridadeClass(prioridade: string): string {
    switch (prioridade?.toLowerCase()) {
      case 'baixa':
        return 'prioridade-baixa';
      case 'media':
        return 'prioridade-media';
      case 'alta':
        return 'prioridade-alta';
      case 'urgente':
        return 'prioridade-urgente';
      default:
        return 'prioridade-padrao';
    }
  }

  getPrioridadeLabel(prioridade: string): string {
    switch (prioridade?.toLowerCase()) {
      case 'baixa':
        return 'Baixa';
      case 'media':
        return 'Média';
      case 'alta':
        return 'Alta';
      case 'urgente':
        return 'Urgente';
      default:
        return prioridade || 'Não definida';
    }
  }

  getTotalTarefas(): number {
    return this.minhasTarefas.length + this.tarefasEquipe.length;
  }
}
