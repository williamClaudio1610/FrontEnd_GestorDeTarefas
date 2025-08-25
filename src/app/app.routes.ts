import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './Componentes/Admin/admin-layout/admin-layout';
import { UserLayoutComponent } from './Componentes/User/user-layout/user-layout';
import { UserListaProjectosComponent } from './Componentes/User/user-lista-projectos/user-lista-projectos';
import { UserListaTarefasComponent } from './Componentes/User/user-lista-tarefas/user-lista-tarefas';
import { UserDashboardComponent } from './Componentes/User/user-dashboard/user-dashboard';
import { UserEquipesComponent } from './Componentes/User/user-equipes/user-equipes';
import { Login } from './Componentes/login/login';
import { AuthGuard } from '../Servicos/auth.guard';

// Importar componentes do Admin
import { Dashboard as AdminDashboard } from './Componentes/Admin/SideLinks/dashboard/dashboard';
import { UsuariosComponent } from './Componentes/Admin/SideLinks/usuarios/usuarios';
import { CargosComponent } from './Componentes/Admin/SideLinks/cargos/cargos';
import { EquipesComponent } from './Componentes/Admin/SideLinks/equipes/equipes';
import { ProjectosComponent } from './Componentes/Admin/SideLinks/projectos/projectos';
import { Configs } from './Componentes/Admin/SideLinks/configs/configs';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  
  // Rotas do Admin (protegidas)
  { 
    path: 'admin', 
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    data: { role: 'admin' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboard },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'cargos', component: CargosComponent },
      { path: 'equipes', component: EquipesComponent },
      { path: 'projectos', component: ProjectosComponent },
      { path: 'configs', component: Configs },
    ]
  },
  
  // Rotas do User (protegidas)
  { 
    path: 'user', 
    component: UserLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: UserDashboardComponent },
      { path: 'projectos', component: UserListaProjectosComponent },
      { path: 'tarefas', component: UserListaTarefasComponent },
      { path: 'equipes', component: UserEquipesComponent },
      { path: 'perfil', component: UserListaTarefasComponent }, // Placeholder
      { path: 'notificacoes', component: UserListaTarefasComponent }, // Placeholder
      { path: 'ajuda', component: UserListaTarefasComponent }, // Placeholder
    ]
  },
  
  // Rota de fallback
  { path: '**', redirectTo: '/login' }
];
