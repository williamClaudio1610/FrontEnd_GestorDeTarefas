import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// PrimeNG Components
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-teste-tailwind',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    DividerModule,
    MessageModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './teste-tailwind.html',
  styleUrl: './teste-tailwind.css'
})
export class TesteTailwindComponent {
  loginForm: FormGroup;
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      senha: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, senha } = this.loginForm.value;
      
      // Simular login corporativo
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Acesso Autorizado',
          detail: `Bem-vindo ao sistema, ${email.split('@')[0]}!`
        });
        this.loading = false;
      }, 1500);
    } else {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Dados Inválidos',
        detail: 'Por favor, verifique as informações inseridas e tente novamente.'
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
        return `${fieldName === 'email' ? 'Email corporativo' : 'Senha'} é obrigatório`;
      }
      if (field.errors?.['email']) {
        return 'Por favor, insira um email corporativo válido';
      }
      if (field.errors?.['pattern'] && fieldName === 'email') {
        return 'Formato de email inválido';
      }
      if (field.errors?.['minlength'] && fieldName === 'senha') {
        return 'Senha deve ter pelo menos 8 caracteres';
      }
      if (field.errors?.['pattern'] && fieldName === 'senha') {
        return 'Senha deve conter maiúscula, minúscula, número e caractere especial';
      }
    }
    return '';
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFieldClasses(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      return 'border-danger';
    }
    if (field?.touched && field?.valid) {
      return 'border-success';
    }
    return 'border-slate-300';
  }

  // Método para verificar se o campo está válido
  isFieldValid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.valid && field?.touched);
  }

  // Método para obter a força da senha
  getPasswordStrength(): string {
    const senha = this.loginForm.get('senha')?.value;
    if (!senha) return '';
    
    let strength = 0;
    if (senha.length >= 8) strength++;
    if (/[a-z]/.test(senha)) strength++;
    if (/[A-Z]/.test(senha)) strength++;
    if (/\d/.test(senha)) strength++;
    if (/[@$!%*?&]/.test(senha)) strength++;
    
    if (strength <= 2) return 'fraca';
    if (strength <= 3) return 'média';
    if (strength <= 4) return 'forte';
    return 'muito forte';
  }
}
