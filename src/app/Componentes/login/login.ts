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
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: 'Login realizado com sucesso! Redirecionando...'
          });

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro no Login',
            detail: error.error?.message || 'Credenciais inválidas. Verifique seu email e senha.'
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
        detail: 'Por favor, preencha todos os campos corretamente.'
      });
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
