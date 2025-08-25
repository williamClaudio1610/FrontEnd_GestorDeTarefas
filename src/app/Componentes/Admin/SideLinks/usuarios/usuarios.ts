import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { UsuarioService } from '../../../../../Servicos/usuario.service';
import { CargoService } from '../../../../../Servicos/cargo.service';
import { EquipeService } from '../../../../../Servicos/equipe.service';
import { NotificacaoService } from '../../../../../Servicos/notificacao.service';
import { Usuario, CriarUsuario } from '../../../../../Modelos/Usuario';
import { Cargo } from '../../../../../Modelos/Cargo';
import { Equipe } from '../../../../../Modelos/Equipe';
import { EstadoUsuario, NivelHierarquico, Role } from '../../../../../Modelos';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ToastModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
  providers: [MessageService]
})
export class UsuariosComponent implements OnInit {
  // Propriedades de busca e filtros
  searchTerm = '';
  showFilters = false;
  selectedCargo = '';
  selectedStatus = '';
  selectedEquipe = '';

  // Dados dos usuários
  users: Usuario[] = [];
  filteredUsers: Usuario[] = [];
  cargos: Cargo[] = [];
  equipes: Equipe[] = [];

  // Paginação
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Estatísticas
  totalUsers = 0;
  activeUsers = 0;
  pendingUsers = 0;
  inactiveUsers = 0;

  // Modal de novo usuário
  isAddUserOpen = false;
  isSavingUser = false;
  newUser: CriarUsuario = {
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    cargoId: 0,
    nivelHierarquico: NivelHierarquico.JUNIOR,
    estado: EstadoUsuario.ATIVO,
    role: Role.USER
  };

  // Opções para selects
  nivelOptions = [
    { value: NivelHierarquico.ESTAGIARIO, label: 'Estagiário' },
    { value: NivelHierarquico.JUNIOR, label: 'Júnior' },
    { value: NivelHierarquico.PLENO, label: 'Pleno' },
    { value: NivelHierarquico.SENIOR, label: 'Sênior' },
    { value: NivelHierarquico.LIDER, label: 'Líder' },
    { value: NivelHierarquico.GERENTE, label: 'Gerente' },
    { value: NivelHierarquico.DIRETOR, label: 'Diretor' }
  ];
  estadoOptions = [
    { value: EstadoUsuario.ATIVO, label: 'Ativo' },
    { value: EstadoUsuario.INATIVO, label: 'Inativo' },
    { value: EstadoUsuario.SUSPENSO, label: 'Suspenso' },
    { value: EstadoUsuario.DEMITIDO, label: 'Demitido' }
  ];
  roleOptions = [
    { value: Role.USER, label: 'Usuário' },
    { value: Role.ADMIN, label: 'Administrador' }
  ];

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private cargoService: CargoService,
    private equipeService: EquipeService,
    private notificacao: NotificacaoService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadCargos();
    this.loadEquipes();
    this.calculateStatistics();
  }

  // Carregar usuários
  loadUsers() {
    this.messageService.add({
      severity: 'info',
      summary: 'Carregando',
      detail: 'Carregando lista de usuários...',
      life: 2000
    });

    this.usuarioService.getUsuarios().subscribe({
      next: (response: any) => {
        const usuarios = response.data;
        this.users = (usuarios as Usuario[]).map(u => ({
          ...u,
          createdAt: u.createdAt ? new Date(u.createdAt as unknown as string) : undefined,
          updatedAt: u.updatedAt ? new Date(u.updatedAt as unknown as string) : undefined
        }));
        this.filteredUsers = [...this.users];
        this.totalUsers = this.users.length;
        this.calculateStatistics();
        this.calculatePagination();
        
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `${this.users.length} usuários carregados com sucesso`,
          life: 3000
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

  // Carregar cargos
  loadCargos() {
    this.cargoService.getCargos().subscribe({
      next: (response: any) => {
        const cargos = response.data;
        this.cargos = cargos as Cargo[];
        
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `${this.cargos.length} cargos carregados`,
          life: 2000
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar cargos',
          life: 5000
        });
        this.notificacao.erroGenerico('Falha ao carregar cargos.');
      }
    });
  }

  // Carregar equipes
  loadEquipes() {
    this.equipeService.getEquipes().subscribe({
      next: (response: any) => {
        const equipes = response.data;
        this.equipes = equipes as Equipe[];
        
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `${this.equipes.length} equipes carregadas`,
          life: 2000
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

  // Busca em tempo real
  onSearch() {
    this.currentPage = 1;
    this.applyFilters();
  }

  // Aplicar filtros
  applyFilters() {
    let filtered = [...this.users];

    // Filtro por termo de busca
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.nome.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }

    // Filtro por cargo
    if (this.selectedCargo) {
      filtered = filtered.filter(user => user.cargoId === parseInt(this.selectedCargo));
    }

    // Filtro por status
    if (this.selectedStatus) {
      let estadoFilter: EstadoUsuario;
      switch (this.selectedStatus) {
        case 'ativo':
          estadoFilter = EstadoUsuario.ATIVO;
          break;
        case 'inativo':
          estadoFilter = EstadoUsuario.INATIVO;
          break;
        case 'suspenso':
          estadoFilter = EstadoUsuario.SUSPENSO;
          break;
        case 'demitido':
          estadoFilter = EstadoUsuario.DEMITIDO;
          break;
        default:
          estadoFilter = EstadoUsuario.ATIVO;
      }
      filtered = filtered.filter(user => user.estado === estadoFilter);
    }

    // Filtro por equipe
    if (this.selectedEquipe) {
      filtered = filtered.filter(user => 
        user.equipas?.some((equipe: Equipe) => equipe.id === parseInt(this.selectedEquipe))
      );
    }

    this.filteredUsers = filtered;
    this.calculatePagination();
  }

  // Alternar exibição dos filtros
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  // Abrir modal de adicionar usuário
  openAddUserModal() {
    this.newUser = {
      nome: '',
      email: '',
      telefone: '',
      senha: '',
      cargoId: this.cargos[0]?.id || 0,
      nivelHierarquico: NivelHierarquico.JUNIOR,
      estado: EstadoUsuario.ATIVO,
      role: Role.USER
    };
    this.isAddUserOpen = true;
  }

  // Fechar modal
  closeAddUserModal() {
    this.isAddUserOpen = false;
  }

  // Salvar novo usuário
  saveNewUser() {
    if (!this.newUser.nome.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validação',
        detail: 'Nome do usuário é obrigatório',
        life: 4000
      });
      return;
    }

    this.isSavingUser = true;
    
    this.messageService.add({
      severity: 'info',
      summary: 'Salvando',
      detail: 'Criando novo usuário...',
      life: 2000
    });

    this.usuarioService.createUsuario(this.newUser as unknown as Usuario).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário criado com sucesso!',
          life: 4000
        });
        this.closeAddUserModal();
        this.loadUsers();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao criar usuário',
          life: 5000
        });
        this.notificacao.erroGenerico('Não foi possível criar o usuário.');
        this.isSavingUser = false;
      }
    });
  }

  // Ver usuário
  viewUser(user: Usuario) {
    console.log('Ver usuário:', user);
    // Implementar navegação para perfil do usuário
  }

  // Editar usuário
  editUser(user: Usuario) {
    console.log('Editar usuário:', user);
    // Implementar modal de edição
  }

  // Excluir usuário
  deleteUser(user: Usuario) {
    if (confirm(`Tem certeza que deseja excluir o usuário ${user.nome}?`)) {
      console.log('Excluir usuário:', user);
      // Implementar exclusão
      this.users = this.users.filter(u => u.id !== user.id);
      this.applyFilters();
      this.calculateStatistics();
    }
  }

  // Calcular estatísticas
  calculateStatistics() {
    this.totalUsers = this.users.length;
    this.activeUsers = this.users.filter(u => u.estado === EstadoUsuario.ATIVO).length;
    this.pendingUsers = this.users.filter(u => u.estado === EstadoUsuario.SUSPENSO).length;
    this.inactiveUsers = this.users.filter(u => u.estado === EstadoUsuario.INATIVO).length;
  }

  // Calcular paginação
  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    if (this.totalPages === 0) this.currentPage = 1;
  }

  // Obter usuários da página atual
  getCurrentPageUsers(): Usuario[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  // Navegar para página anterior
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Navegar para próxima página
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Ir para página específica
  goToPage(page: number) {
    this.currentPage = page;
  }

  // Obter números das páginas para exibição
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, start + maxVisiblePages - 1);
      
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  // Obter índices para exibição
  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage, this.filteredUsers.length);
  }

  // Obter classes CSS para status
  getStatusClasses(status: EstadoUsuario): string {
    switch (status) {
      case EstadoUsuario.ATIVO:
        return 'bg-green-100 text-green-800';
      case EstadoUsuario.INATIVO:
        return 'bg-red-100 text-red-800';
      case EstadoUsuario.SUSPENSO:
        return 'bg-yellow-100 text-yellow-800';
      case EstadoUsuario.DEMITIDO:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Obter texto do status
  getStatusText(status: EstadoUsuario): string {
    switch (status) {
      case EstadoUsuario.ATIVO:
        return 'Ativo';
      case EstadoUsuario.INATIVO:
        return 'Inativo';
      case EstadoUsuario.SUSPENSO:
        return 'Suspenso';
      case EstadoUsuario.DEMITIDO:
        return 'Demitido';
      default:
        return 'Desconhecido';
    }
  }

  // Obter nome do cargo
  getCargoNome(cargoId: number): string {
    const cargo = this.cargos.find(c => c.id === cargoId);
    return cargo?.nome || 'Não definido';
  }

  // Obter nome da equipe principal
  getEquipeNome(equipas?: Equipe[]): string {
    if (!equipas || equipas.length === 0) return 'Não definido';
    return equipas[0].nome;
  }

  // Obter nível hierárquico formatado
  getNivelHierarquicoText(nivel: NivelHierarquico): string {
    switch (nivel) {
      case NivelHierarquico.ESTAGIARIO:
        return 'Estagiário';
      case NivelHierarquico.JUNIOR:
        return 'Júnior';
      case NivelHierarquico.PLENO:
        return 'Pleno';
      case NivelHierarquico.SENIOR:
        return 'Sênior';
      case NivelHierarquico.LIDER:
        return 'Líder';
      case NivelHierarquico.GERENTE:
        return 'Gerente';
      case NivelHierarquico.DIRETOR:
        return 'Diretor';
      default:
        return 'Não definido';
    }
  }

  // Obter role formatado
  getRoleText(role: Role): string {
    switch (role) {
      case Role.ADMIN:
        return 'Administrador';
      case Role.USER:
        return 'Usuário';
      default:
        return 'Não definido';
    }
  }
}
