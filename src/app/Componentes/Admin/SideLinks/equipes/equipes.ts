import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { EquipeService } from '../../../../../Servicos/equipe.service';
import { UsuarioService } from '../../../../../Servicos/usuario.service';
import { NotificacaoService } from '../../../../../Servicos/notificacao.service';
import { Equipe, CriarEquipe } from '../../../../../Modelos/Equipe';
import { Usuario, NivelHierarquico } from '../../../../../Modelos/Usuario';

@Component({
  selector: 'app-equipes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ToastModule],
  templateUrl: './equipes.html',
  styleUrl: './equipes.css',
  providers: [MessageService]
})
export class EquipesComponent implements OnInit {
  // Lista de equipes
  equipes: Equipe[] = [];
  filteredEquipes: Equipe[] = [];
  
  // Lista de usuários para seleção
  usuarios: Usuario[] = [];
  lideres: Usuario[] = [];
  
  // Paginação
  currentPage = 1;
  itemsPerPage = 10;
  totalEquipes = 0;
  totalPages = 0;
  
  // Busca
  searchTerm = '';
  
  // Modal de criação
  isAddEquipeOpen = false;
  isSavingEquipe = false;
  newEquipe: CriarEquipe = {
    nome: '',
    descricao: '',
    liderId: 0,
    membrosIds: [],
    emailsConvite: []
  };
  
  // Seleção de usuários
  selectedUserIds: number[] = [];
  newEmailConvite = '';
  
  // Estatísticas
  totalEquipesAtivas = 0;
  totalMembros = 0;
  equipesRecentes = 0;

  constructor(
    private equipeService: EquipeService,
    private usuarioService: UsuarioService,
    private notificacao: NotificacaoService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadEquipes();
    this.loadUsuarios();
  }

  // Carregar equipes
  loadEquipes() {
    this.messageService.add({
      severity: 'info',
      summary: 'Carregando',
      detail: 'Carregando lista de equipes...',
      life: 2000
    });

    this.equipeService.getEquipes().subscribe({
      next: (response: any) => {
        const equipes = response.data;
        this.equipes = (equipes as Equipe[]).map(e => ({
          ...e,
          createdAt: e.createdAt ? new Date(e.createdAt as unknown as string) : undefined,
          updatedAt: e.updatedAt ? new Date(e.updatedAt as unknown as string) : undefined
        }));
        this.filteredEquipes = [...this.equipes];
        this.totalEquipes = this.equipes.length;
        this.calculateStatistics();
        this.calculatePagination();
        
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `${this.equipes.length} equipes carregadas com sucesso`,
          life: 3000
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar equipes',
          life: 5000
        });
        this.notificacao.erroGenerico('Falha ao carregar equipes.');
      }
    });
  }

  // Carregar usuários para seleção
  loadUsuarios() {
    this.messageService.add({
      severity: 'info',
      summary: 'Carregando',
      detail: 'Carregando lista de usuários...',
      life: 2000
    });

    this.usuarioService.getUsuarios().subscribe({
      next: (response: any) => {
        const usuarios = response.data;
        this.usuarios = usuarios as Usuario[];
        
        // Filtrar apenas líderes para seleção de líder da equipe
        this.lideres = this.usuarios.filter(usuario => 
          usuario.nivelHierarquico === NivelHierarquico.LIDER
        );
        
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `${this.usuarios.length} usuários carregados (${this.lideres.length} líderes disponíveis)`,
          life: 2000
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar usuários',
          life: 5000
        });
        this.notificacao.erroGenerico('Falha ao carregar usuários.');
      }
    });
  }

  // Abrir modal de criação
  openAddEquipeModal() {
    this.isAddEquipeOpen = true;
    this.resetNewEquipe();
  }

  // Fechar modal
  closeAddEquipeModal() {
    this.isAddEquipeOpen = false;
    this.resetNewEquipe();
  }

  // Resetar dados da nova equipe
  resetNewEquipe() {
    this.newEquipe = {
      nome: '',
      descricao: '',
      liderId: this.lideres.length > 0 ? this.lideres[0].id : 0,
      membrosIds: [],
      emailsConvite: []
    };
    this.selectedUserIds = [];
    this.newEmailConvite = '';
  }

  // Adicionar usuário selecionado
  addSelectedUser(userId: number) {
    if (!this.selectedUserIds.includes(userId)) {
      this.selectedUserIds.push(userId);
      this.newEquipe.membrosIds = [...this.selectedUserIds];
    }
  }

  // Remover usuário selecionado
  removeSelectedUser(userId: number) {
    this.selectedUserIds = this.selectedUserIds.filter(id => id !== userId);
    this.newEquipe.membrosIds = [...this.selectedUserIds];
  }

  // Adicionar email de convite
  addEmailConvite() {
    if (this.newEmailConvite && this.newEmailConvite.trim() && 
        this.newEquipe.emailsConvite && 
        !this.newEquipe.emailsConvite.includes(this.newEmailConvite.trim())) {
      this.newEquipe.emailsConvite.push(this.newEmailConvite.trim());
      this.newEmailConvite = '';
    }
  }

  // Remover email de convite
  removeEmailConvite(email: string) {
    if (this.newEquipe.emailsConvite) {
      this.newEquipe.emailsConvite = this.newEquipe.emailsConvite.filter(e => e !== email);
    }
  }

  // Verificar se usuário está selecionado
  isUserSelected(userId: number): boolean {
    return this.selectedUserIds.includes(userId);
  }

  // Salvar nova equipe
  saveNewEquipe() {
    if (!this.newEquipe.nome.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validação',
        detail: 'Nome da equipe é obrigatório',
        life: 4000
      });
      return;
    }

    if (!this.newEquipe.liderId || this.newEquipe.liderId === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validação',
        detail: 'Seleção de líder é obrigatória',
        life: 4000
      });
      return;
    }

    this.isSavingEquipe = true;
    
    this.messageService.add({
      severity: 'info',
      summary: 'Salvando',
      detail: 'Criando nova equipe...',
      life: 2000
    });
    
    this.equipeService.criarEquipe(this.newEquipe).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Equipe criada com sucesso!',
          life: 4000
        });
        this.notificacao.sucesso('Sucesso', 'Equipe criada com sucesso!');
        this.closeAddEquipeModal();
        this.loadEquipes();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao criar equipe',
          life: 5000
        });
        this.notificacao.erroGenerico('Falha ao criar equipe.');
        this.isSavingEquipe = false;
      }
    });
  }

  // Buscar equipes
  searchEquipes() {
    if (!this.searchTerm.trim()) {
      this.filteredEquipes = [...this.equipes];
    } else {
      this.filteredEquipes = this.equipes.filter(equipe =>
        equipe.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        equipe.descricao.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.calculatePagination();
  }

  // Calcular estatísticas
  calculateStatistics() {
    this.totalEquipesAtivas = this.equipes.length; // Todas as equipes são consideradas ativas
    this.totalMembros = this.equipes.reduce((total, e) => total + (e.membros?.length || 0), 0);
    this.equipesRecentes = this.equipes.filter(e => {
      if (!e.createdAt) return false;
      const daysDiff = (Date.now() - e.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    }).length;
  }

  // Calcular paginação
  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredEquipes.length / this.itemsPerPage);
  }

  // Obter equipes da página atual
  getCurrentPageEquipes(): Equipe[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredEquipes.slice(startIndex, endIndex);
  }

  // Obter índice final da página atual
  getCurrentPageEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredEquipes.length);
  }

  // Navegar para página
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Obter números das páginas
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 2) {
        pages.push(1);
        for (let i = this.totalPages - 3; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(this.totalPages);
      }
    }
    
    return pages;
  }

  // Formatar data
  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return date.toLocaleDateString('pt-BR');
  }

  // Obter nome do usuário por ID
  getUserName(userId: number): string {
    const usuario = this.usuarios.find(u => u.id === userId);
    return usuario ? usuario.nome : 'Usuário não encontrado';
  }

  // Obter email do usuário por ID
  getUserEmail(userId: number): string {
    const usuario = this.usuarios.find(u => u.id === userId);
    return usuario ? usuario.email : 'Email não encontrado';
  }

  // Obter nome do líder selecionado
  getLiderSelecionadoNome(): string {
    if (!this.newEquipe.liderId) return 'Nenhum líder selecionado';
    const lider = this.lideres.find(l => l.id === this.newEquipe.liderId);
    return lider ? lider.nome : 'Líder não encontrado';
  }
}
