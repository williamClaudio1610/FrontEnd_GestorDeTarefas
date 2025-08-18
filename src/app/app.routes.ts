import { Routes } from '@angular/router';
import { Login } from './Componentes/login/login';
import { TesteTailwindComponent } from './Componentes/teste-tailwind/teste-tailwind';
import { AdminLayoutComponent } from './Componentes/Admin/admin-layout/admin-layout';
import { UsuariosComponent } from './Componentes/Admin/SideLinks/usuarios/usuarios';
import { DashboardComponent } from './Componentes/Admin/dashboard/dashboard';
import { PaginaInicial } from './Componentes/HomePage/pagina-inicial/pagina-inicial';
import { Footer } from './Componentes/HomePage/footer/footer';
import { Header } from './Componentes/HomePage/header/header';

export const routes: Routes = [
  { path: '', component: PaginaInicial },
  { path: 'home', component: PaginaInicial },
  { path: 'login', component: Login },
  { path: 'footer', component: Footer },
  { path: 'header', component: Header },
  { path: 'teste-tailwind', component: TesteTailwindComponent },
  { 
    path: 'admin', 
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'projects', component: DashboardComponent }, // Placeholder para projetos
      { path: 'tasks', component: DashboardComponent }, // Placeholder para tarefas
      { path: 'teams', component: DashboardComponent }, // Placeholder para equipes
      { path: 'reports', component: DashboardComponent }, // Placeholder para relatórios
      { path: 'settings', component: DashboardComponent }, // Placeholder para configurações
      { path: 'help', component: DashboardComponent }, // Placeholder para ajuda
    ]
  },
  { path: '**', redirectTo: '' }
];
