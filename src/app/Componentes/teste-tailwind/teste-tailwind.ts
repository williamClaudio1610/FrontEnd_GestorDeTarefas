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
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, senha } = this.loginForm.value;
      
      // Simular login
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso!',
          detail: `Login realizado com: ${email}`
        });
        this.loading = false;
      }, 1500);
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

  hasFieldError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFieldClasses(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      return 'border-red-500';
    }
    if (field?.touched) {
      return 'border-green-500';
    }
    return 'border-gray-300';
  }
}
