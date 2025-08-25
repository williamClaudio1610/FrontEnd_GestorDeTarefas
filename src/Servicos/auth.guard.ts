import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Verificar se o usuário está autenticado
    if (!this.authService.isAuthenticated()) {
      console.log('Usuário não autenticado, redirecionando para login');
      this.router.navigate(['/login']);
      return false;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      console.log('Usuário não encontrado, redirecionando para login');
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar se a rota requer role específico
    const requiredRole = route.data['role'];
    if (requiredRole) {
      if (!this.authService.hasRole(requiredRole)) {
        console.log(`Usuário não tem role ${requiredRole}, redirecionando`);
        this.redirectBasedOnRole(user.role);
        return false;
      }
    }

    // Verificar se a rota é para admin ou user
    const isAdminRoute = state.url.startsWith('/admin');
    const isUserRoute = state.url.startsWith('/user');

    if (isAdminRoute && !this.authService.isAdmin()) {
      console.log('Usuário não é admin, redirecionando para área do usuário');
      this.router.navigate(['/user/dashboard']);
      return false;
    }

    if (isUserRoute && this.authService.isAdmin()) {
      console.log('Admin acessando área do usuário, permitindo acesso');
      return true;
    }

    return true;
  }

  private redirectBasedOnRole(role: string): void {
    const roleLower = role.toLowerCase();
    
    if (roleLower === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/user/dashboard']);
    }
  }
}
