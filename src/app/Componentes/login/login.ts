import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// PrimeNG Components
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Services
import { AuthService } from '../../../Servicos/auth.service';
import { Role } from '../../../Modelos/Usuario';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    DividerModule,
    MessageModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    console.log('Login component inicializado');
    console.log('MessageService injetado:', this.messageService);
    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, senha } = this.loginForm.value;

      this.authService.login({ email, senha }).subscribe({
        next: (response: any) => {
          console.log('Resposta do login:', response);
          
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: 'Login realizado com sucesso! Redirecionando...'
          });

          // Verificar o role do usuário e redirecionar adequadamente
          setTimeout(() => {
            this.redirectBasedOnRole(response);
          }, 1500);
        },
        error: (error: any) => {
          console.error('Erro no login:', error);
          
          let errorMessage = 'Erro ao fazer login.';
          
          if (error.status === 0) {
            errorMessage = 'Servidor não está respondendo. Verifique sua conexão.';
          } else if (error.status === 401) {
            errorMessage = 'Credenciais inválidas. Verifique seu email e senha.';
          } else if (error.status === 500) {
            errorMessage = 'Erro interno do servidor. Tente novamente.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          this.messageService.add({
            severity: 'error',
            summary: 'Erro no Login',
            detail: errorMessage,
            life: 5000
          });
          
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulário Inválido',
        detail: 'Por favor, preencha todos os campos corretamente.',
        life: 3000
      });
    }
  }

  /**
   * Redireciona o usuário baseado no seu role
   */
  private redirectBasedOnRole(response: any): void {
    console.log('Processando redirecionamento com resposta:', response);
    
    // Extrair usuário da estrutura real: response.data.user
    let user = null;
    let role = null;
    
    if (response?.data?.user) {
      user = response.data.user;
      role = response.data.user.role;
    } else if (response?.user) {
      user = response.user;
      role = response.user.role;
    } else if (response?.usuario) {
      user = response.usuario;
      role = response.usuario.role;
    }
    
    console.log('Usuário extraído:', user);
    console.log('Role extraído:', role);
    
    if (!user || !role) {
      console.error('Usuário ou role não encontrado na resposta:', response);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro no Login',
        detail: 'Resposta do servidor inválida. Tente novamente.',
        life: 5000
      });
      return;
    }

    const roleLower = role.toLowerCase();
    
    if (roleLower === Role.ADMIN || roleLower === 'admin') {
      console.log('Usuário é ADMIN, redirecionando para área administrativa');
      this.router.navigate(['/admin/dashboard']);
    } else if (roleLower === Role.USER || roleLower === 'user') {
      console.log('Usuário é USER, redirecionando para área do usuário');
      this.router.navigate(['/user/dashboard']);
    } else {
      console.warn('Role desconhecido:', roleLower);
      // Fallback para área do usuário
      this.router.navigate(['/user/dashboard']);
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field.errors?.['required']) {
        return `${fieldName === 'email' ? 'Email' : 'Senha'} é obrigatório`;
      }
      if (field.errors?.['email']) {
        return 'Por favor, insira um email válido';
      }
      if (field.errors?.['minlength']) {
        return 'Senha deve ter pelo menos 6 caracteres';
      }
    }
    return '';
  }

  // Método para verificar se o campo tem erro
  hasFieldError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  // Método para obter classes CSS do campo
  getFieldClasses(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      return 'ng-invalid ng-touched';
    }
    if (field?.touched) {
      return 'ng-touched';
    }
    return '';
  }
}
