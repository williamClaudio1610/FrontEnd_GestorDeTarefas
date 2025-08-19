import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../../../Servicos/theme.service';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.css'
})
export class SideMenuComponent implements OnInit {
  // Estado do menu
  isCollapsed = false;
  activeMenuItem = 'dashboard';

  @Output() collapsedChange = new EventEmitter<boolean>();

  // Tema claro/escuro
  isDarkTheme = false;

  // Dados do usuário (mock - substituir por dados reais)
  currentUser = {
    name: 'Admin User',
    email: 'admin@gestor.com',
    avatar: 'A',
    role: 'ADMIN'
  };

  // Itens do menu
  menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/admin/dashboard',
      color: 'blue'
    },
    {
      id: 'cargos',
      label: 'Cargos',
      icon: 'briefcase',
      route: '/admin/cargos',
      color: 'orange'
    },
    {
      id: 'users',
      label: 'Usuários',
      icon: 'users',
      route: '/admin/usuarios',
      color: 'green',
      hasNotification: true
    },
    {
      id: 'projectos',
      label: 'Projetos',
      icon: 'projects',
      route: '/admin/projectos',
      color: 'purple'
    },
    {
      id: 'equipes',
      label: 'Equipes',
      icon: 'teams',
      route: '/admin/equipes',
      color: 'indigo'
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: 'reports',
      route: '/admin/reports',
      color: 'red'
    }
  ];

  // Itens secundários
  secondaryMenuItems = [
    {
      id: 'settings',
      label: 'Configurações',
      icon: 'settings',
      route: '/admin/settings',
      color: 'gray'
    },
    {
      id: 'help',
      label: 'Ajuda',
      icon: 'help',
      route: '/admin/help',
      color: 'gray'
    }
  ];

  constructor(private router: Router, private theme: ThemeService) {}

  ngOnInit(): void {
    this.theme.init();
    this.isDarkTheme = this.theme.isDark();
    this.collapsedChange.emit(this.isCollapsed);
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
    // Implementar lógica de logout
    console.log('Logout realizado');
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
