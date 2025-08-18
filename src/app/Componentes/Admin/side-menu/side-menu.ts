import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.css'
})
export class SideMenuComponent {
  // Estado do menu
  isCollapsed = false;
  activeMenuItem = 'dashboard';

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
      id: 'users',
      label: 'Usuários',
      icon: 'users',
      route: '/admin/usuarios',
      color: 'green',
      hasNotification: true
    },
    /*{
      id: 'projects',
      label: 'Projetos',
      icon: 'projects',
      route: '/admin/projects',
      color: 'purple'
    },*/
    /*{
      id: 'tasks',
      label: 'Tarefas',
      icon: 'tasks',
      route: '/admin/tasks',
      color: 'orange'
    },*/
    {
      id: 'teams',
      label: 'Equipes',
      icon: 'teams',
      route: '/admin/teams',
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

  constructor(private router: Router) {}

  // Alternar estado do menu (colapsar/expandir)
  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
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
    const baseClasses = 'flex items-center space-x-3 p-3 rounded-xl text-gray-700 transition-all duration-200 group nav-item';
    const colorClasses = `hover:bg-${item.color}-50 hover:text-${item.color}-600`;
    const activeClasses = this.isActive(item.id) ? 'active' : '';
    
    return `${baseClasses} ${colorClasses} ${activeClasses}`;
  }

  // Obter classes CSS para o ícone de um item
  getIconClasses(item: any): string {
    const baseClasses = 'w-8 h-8 rounded-lg flex items-center justify-center transition-colors nav-icon';
    const colorClasses = `bg-${item.color}-100 group-hover:bg-${item.color}-200`;
    
    return `${baseClasses} ${colorClasses}`;
  }

  // Obter classes CSS para o texto de um item
  getTextClasses(item: any): string {
    const baseClasses = 'font-medium';
    const activeClasses = this.isActive(item.id) ? 'text-white' : '';
    
    return `${baseClasses} ${activeClasses}`;
  }
}
