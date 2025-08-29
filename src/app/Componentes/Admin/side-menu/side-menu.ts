import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../../Servicos/theme.service';
import { AuthService } from '../../../../Servicos/auth.service';

interface CurrentUserDisplay {
  name: string;
  email: string;
  avatar: string;
  role: string;
  nivelHierarquico: string;
}

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.css'
})
export class SideMenuComponent implements OnInit, OnDestroy {
  // Estado do menu
  isCollapsed = false;
  activeMenuItem = 'dashboard';

  @Output() collapsedChange = new EventEmitter<boolean>();

  // Tema claro/escuro
  isDarkTheme = false;

  // Subscription para cleanup
  private userSubscription: Subscription = new Subscription();

  // Dados do usuário (carregados do backend)
  currentUser: CurrentUserDisplay = {
    name: '',
    email: '',
    avatar: '',
    role: '',
    nivelHierarquico: ''
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
    }
  ];

  // Itens secundários
  secondaryMenuItems = [
    {
      id: 'configs',
      label: 'Configurações',
      icon: 'settings',
      route: '/admin/configs',
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
    
    // Inscrever-se nas mudanças do usuário logado
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadCurrentUser();
      }
    });
  }

  loadCurrentUser(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      console.log('Dados do usuário admin carregados do backend:', user);
      this.currentUser = {
        name: user.nome,
        email: user.email,
        avatar: user.nome.charAt(0).toUpperCase(),
        role: user.role,
        nivelHierarquico: user.nivelHierarquico || ''
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

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
