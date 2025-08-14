import { Routes } from '@angular/router';
import { Login } from './Componentes/login/login';
import { TesteTailwindComponent } from './Componentes/teste-tailwind/teste-tailwind';
  
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'teste-tailwind', component: TesteTailwindComponent },
  { path: '**', redirectTo: '/login' }
];
