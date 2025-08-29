import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../../Servicos/theme.service';
import { AuthService } from '../../../../Servicos/auth.service';
import { UsuarioService } from '../../../../Servicos/usuario.service';
import { EquipeService } from '../../../../Servicos/equipe.service';

interface CurrentUserDisplay {
  name: string;
  email: string;
  avatar: string;
  role: string;
  nivelHierarquico: string;
  isLeader: boolean;
  teamRole: string;
}

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-sidebar.html',
  styleUrl: './user-sidebar.css'
})
export class UserSidebarComponent implements OnInit, OnDestroy {
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
    nivelHierarquico: '',
    isLeader: false,
    teamRole: 'Membro'
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
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private equipeService: EquipeService
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
      console.log('Dados do usuário carregados do backend:', user);
      this.currentUser = {
        name: user.nome,
        email: user.email,
        avatar: user.nome.charAt(0).toUpperCase(),
        role: user.role,
        nivelHierarquico: user.nivelHierarquico || '',
        isLeader: false,
        teamRole: 'Membro'
      };
      
      // Carregar informações de liderança em equipes
      this.loadTeamLeadershipInfo();
    }
  }

  loadTeamLeadershipInfo(): void {
    this.usuarioService.getDadosConsolidados().subscribe({
      next: (response: any) => {
        const dadosConsolidados = response.data;
        const userId = this.authService.getCurrentUser()?.id;
        
        console.log('Dados consolidados:', dadosConsolidados);
        
        // Verificar se é líder de alguma equipe usando os dados consolidados
        const equipes = dadosConsolidados.equipes || [];
        const isLeaderOfAnyTeam = equipes.some((equipe: any) => equipe.liderId === userId);
        
        // Contar quantas equipes o usuário lidera
        const teamsLed = equipes.filter((equipe: any) => equipe.liderId === userId);
        
        this.currentUser.isLeader = isLeaderOfAnyTeam;
        this.currentUser.teamRole = isLeaderOfAnyTeam 
          ? `Líder de ${teamsLed.length} equipe${teamsLed.length > 1 ? 's' : ''}` 
          : 'Membro';
          
        console.log(`Usuário ${userId} é líder:`, isLeaderOfAnyTeam);
        console.log(`Role da equipe:`, this.currentUser.teamRole);
      },
      error: (error) => {
        console.error('Erro ao carregar dados consolidados:', error);
        // Em caso de erro, manter como membro
        this.currentUser.isLeader = false;
        this.currentUser.teamRole = 'Membro';
      }
    });
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
