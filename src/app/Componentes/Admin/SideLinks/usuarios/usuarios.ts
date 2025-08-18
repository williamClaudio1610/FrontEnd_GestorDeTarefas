import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Importar modelos do sistema
import { Usuario, Cargo, Equipe, EstadoUsuario, NivelHierarquico, Role } from '../../../../../Modelos';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
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

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadUsers();
    this.loadCargos();
    this.loadEquipes();
    this.calculateStatistics();
  }

  // Carregar usuários (mock data - substituir por chamada real da API)
  loadUsers() {
    // Dados mock para demonstração usando os enums corretos
    this.users = [
      {
        id: 1,
        nome: 'João Silva',
        email: 'joao.silva@gestor.com',
        telefone: '+351 912 345 678',
        cargoId: 1,
        nivelHierarquico: NivelHierarquico.PLENO,
        estado: EstadoUsuario.ATIVO,
        role: Role.USER,
        equipas: [
          { id: 1, nome: 'TI', descricao: 'Equipe de Tecnologia da Informação' }
        ],
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 2,
        nome: 'Maria Santos',
        email: 'maria.santos@gestor.com',
        telefone: '+351 923 456 789',
        cargoId: 2,
        nivelHierarquico: NivelHierarquico.SENIOR,
        estado: EstadoUsuario.ATIVO,
        role: Role.USER,
        equipas: [
          { id: 2, nome: 'Design', descricao: 'Equipe de Design e UX' }
        ],
        createdAt: new Date('2022-06-20'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 3,
        nome: 'Pedro Costa',
        email: 'pedro.costa@gestor.com',
        telefone: '+351 934 567 890',
        cargoId: 1,
        nivelHierarquico: NivelHierarquico.JUNIOR,
        estado: EstadoUsuario.ATIVO,
        role: Role.USER,
        equipas: [
          { id: 1, nome: 'TI', descricao: 'Equipe de Tecnologia da Informação' }
        ],
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: 4,
        nome: 'Ana Oliveira',
        email: 'ana.oliveira@gestor.com',
        telefone: '+351 945 678 901',
        cargoId: 3,
        nivelHierarquico: NivelHierarquico.GERENTE,
        estado: EstadoUsuario.INATIVO,
        role: Role.ADMIN,
        equipas: [
          { id: 3, nome: 'Administração', descricao: 'Equipe de Administração' }
        ],
        createdAt: new Date('2021-03-15'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: 5,
        nome: 'Carlos Ferreira',
        email: 'carlos.ferreira@gestor.com',
        telefone: '+351 956 789 012',
        cargoId: 4,
        nivelHierarquico: NivelHierarquico.PLENO,
        estado: EstadoUsuario.ATIVO,
        role: Role.USER,
        equipas: [
          { id: 4, nome: 'Marketing', descricao: 'Equipe de Marketing Digital' }
        ],
        createdAt: new Date('2023-08-22'),
        updatedAt: new Date('2024-01-15')
      }
    ];

    this.filteredUsers = [...this.users];
    this.totalUsers = this.users.length;
    this.calculateStatistics();
    this.calculatePagination();
  }

  // Carregar cargos (mock data)
  loadCargos() {
    this.cargos = [
      { id: 1, nome: 'Desenvolvedor', descricao: 'Desenvolvimento de software' },
      { id: 2, nome: 'Designer', descricao: 'Design de interfaces e UX' },
      { id: 3, nome: 'Gerente', descricao: 'Gestão de equipes e projetos' },
      { id: 4, nome: 'Analista', descricao: 'Análise de dados e processos' },
      { id: 5, nome: 'Estagiário', descricao: 'Estágio em desenvolvimento' }
    ];
  }

  // Carregar equipes (mock data)
  loadEquipes() {
    this.equipes = [
      { id: 1, nome: 'TI', descricao: 'Equipe de Tecnologia da Informação' },
      { id: 2, nome: 'Design', descricao: 'Equipe de Design e UX' },
      { id: 3, nome: 'Administração', descricao: 'Equipe de Administração' },
      { id: 4, nome: 'Marketing', descricao: 'Equipe de Marketing Digital' },
      { id: 5, nome: 'Vendas', descricao: 'Equipe de Vendas e Relacionamento' }
    ];
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
    // Implementar modal de adicionar usuário
    console.log('Abrir modal de adicionar usuário');
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
