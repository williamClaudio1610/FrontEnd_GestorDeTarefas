import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../../../Servicos/theme.service';
import { AuthService } from '../../../../Servicos/auth.service';

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-sidebar.html',
  styleUrl: './user-sidebar.css'
})
export class UserSidebarComponent implements OnInit {
  // Estado do menu
  isCollapsed = false;
  activeMenuItem = 'dashboard';

  @Output() collapsedChange = new EventEmitter<boolean>();

  // Tema claro/escuro
  isDarkTheme = false;

  // Dados do usuário (mock - substituir por dados reais)
  currentUser = {
    name: 'Usuário',
    email: 'usuario@gestor.com',
    avatar: 'U',
    role: 'USER'
  };

  // Itens do menu principal para usuários
  menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/user/dashboard',
      color: 'blue'
    },
    {
      id: 'projectos',
      label: 'Meus Projetos',
      icon: 'projects',
      route: '/user/projectos',
      color: 'purple'
    },
    {
      id: 'tarefas',
      label: 'Minhas Tarefas',
      icon: 'tasks',
      route: '/user/tarefas',
      color: 'orange',
      hasNotification: true
    },
    {
      id: 'equipes',
      label: 'Minhas Equipes',
      icon: 'teams',
      route: '/user/equipes',
      color: 'indigo'
    },
    {
      id: 'perfil',
      label: 'Meu Perfil',
      icon: 'profile',
      route: '/user/perfil',
      color: 'green'
    }
  ];

  // Itens secundários
  secondaryMenuItems = [
    {
      id: 'notificacoes',
      label: 'Notificações',
      icon: 'notifications',
      route: '/user/notificacoes',
      color: 'yellow'
    },
    {
      id: 'ajuda',
      label: 'Ajuda',
      icon: 'help',
      route: '/user/ajuda',
      color: 'gray'
    }
  ];

  constructor(
    private router: Router, 
    private theme: ThemeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.theme.init();
    this.isDarkTheme = this.theme.isDark();
    this.collapsedChange.emit(this.isCollapsed);
    
    // Obter dados do usuário logado
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser = {
        name: user.nome,
        email: user.email,
        avatar: user.nome.charAt(0).toUpperCase(),
        role: user.role
      };
    }
  }

  // Alternar estado do menu (colapsar/expandir)
  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedChange.emit(this.isCollapsed);
  }

  // Alternar tema claro/escuro
  toggleTheme() {
    this.theme.toggle();
    this.isDarkTheme = this.theme.isDark();
  }

  // Navegar para uma rota
  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  // Definir item ativo
  setActiveItem(itemId: string) {
    this.activeMenuItem = itemId;
  }

  // Verificar se um item está ativo
  isActive(itemId: string): boolean {
    return this.activeMenuItem === itemId;
  }

  // Fazer logout
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Obter classes CSS para um item do menu
  getMenuItemClasses(item: any): string {
    const baseClasses = 'nav-item';
    const activeClasses = this.isActive(item.id) ? 'active' : '';
    return `${baseClasses} ${activeClasses}`;
  }

  // Obter classes CSS para o ícone de um item
  getIconClasses(item: any): string {
    return 'nav-icon';
  }

  // Obter classes CSS para o texto de um item
  getTextClasses(item: any): string {
    return 'nav-text';
  }
}
