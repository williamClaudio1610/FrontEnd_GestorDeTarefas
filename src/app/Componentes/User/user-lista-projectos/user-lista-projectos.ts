import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../../Servicos/usuario.service';
import { ProjectoService } from '../../../../Servicos/projecto.service';
import { EquipeService } from '../../../../Servicos/equipe.service';
import { AuthService } from '../../../../Servicos/auth.service';
import { EstadoProjecto } from '../../../../Modelos/Projecto';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';

import { ProgressBarModule } from 'primeng/progressbar';
import { NivelHierarquico } from '../../../../Modelos/Usuario';

@Component({
  selector: 'app-user-lista-projectos',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    ToastModule, 
    DialogModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    ChipModule,
    BadgeModule,
    AvatarModule,

    ProgressBarModule
  ],
  templateUrl: './user-lista-projectos.html',
  styleUrl: './user-lista-projectos.css',
  providers: [MessageService]
})
export class UserListaProjectosComponent implements OnInit {
  projetos: any[] = [];
  equipes: any[] = [];
  loading = false;
  error = false;
  
  // Dialog de criação
  showCreateDialog = false;
  createForm: FormGroup;
  isCreating = false;
  
  // Verificação de nível hierárquico
  canCreateProject = false;
  userNivelHierarquico: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private projectoService: ProjectoService,
    private equipeService: EquipeService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required, Validators.minLength(10)]],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
      equipeId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.checkUserPermissions();
    this.loadProjects();
    this.loadEquipes();
  }

  /**
   * Verifica se o usuário pode criar projetos baseado no nível hierárquico
   */
  private checkUserPermissions() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userNivelHierarquico = currentUser.nivelHierarquico || '';
      this.canCreateProject = [
        NivelHierarquico.LIDER,
        NivelHierarquico.GERENTE,
        NivelHierarquico.DIRETOR
      ].includes(this.userNivelHierarquico as NivelHierarquico);
      
      console.log('Nível hierárquico:', this.userNivelHierarquico);
      console.log('Pode criar projeto:', this.canCreateProject);
    }
  }

  /**
   * Carrega os projetos do usuário
   */
  loadProjects() {
    this.loading = true;
    this.error = false;

    this.usuarioService.getDadosConsolidados().subscribe({
      next: (response: any) => {
        const projectosData = response.data.projetos || [];
        // Mapear os dados para garantir que equipeNome seja extraído corretamente
        this.projetos = projectosData.map((projeto: any) => ({
          ...projeto,
          equipeNome: projeto.equipe?.nome || 'Equipe não definida'
        }));
        this.loading = false;
        console.log('Projetos carregados:', this.projetos);
      },
      error: (error: any) => {
        console.error('Erro ao carregar projetos:', error);
        this.error = true;
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar projetos',
          life: 5000
        });
      }
    });
  }

  /**
   * Carrega as equipes disponíveis
   */
  loadEquipes() {
    this.equipeService.getEquipes().subscribe({
      next: (response: any) => {
        this.equipes = response.data || [];
      },
      error: (error: any) => {
        console.error('Erro ao carregar equipes:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar equipes',
          life: 5000
        });
      }
    });
  }

  /**
   * Abre o dialog de criação de projeto
   */
  openCreateDialog() {
    if (!this.canCreateProject) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Acesso Negado',
        detail: 'Apenas líderes, gerentes e diretores podem criar projetos',
        life: 5000
      });
      return;
    }
    
    this.createForm.reset();
    this.showCreateDialog = true;
  }

  /**
   * Fecha o dialog de criação
   */
  closeCreateDialog() {
    this.showCreateDialog = false;
    this.createForm.reset();
  }

  /**
   * Cria um novo projeto
   */
  createProject() {
    if (this.createForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isCreating = true;
    const projectData = this.createForm.value;

    // Converter datas para formato ISO
    if (projectData.dataInicio) {
      projectData.dataInicio = new Date(projectData.dataInicio).toISOString().split('T')[0];
    }
    if (projectData.dataFim) {
      projectData.dataFim = new Date(projectData.dataFim).toISOString().split('T')[0];
    }

    this.projectoService.criarProjecto(projectData).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Projeto criado com sucesso!',
          life: 5000
        });
        
        this.closeCreateDialog();
        this.loadProjects(); // Recarregar lista
      },
      error: (error: any) => {
        console.error('Erro ao criar projeto:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao criar projeto. Tente novamente.',
          life: 5000
        });
      },
      complete: () => {
        this.isCreating = false;
      }
    });
  }

  /**
   * Marca todos os campos do formulário como tocados
   */
  private markFormGroupTouched() {
    Object.keys(this.createForm.controls).forEach(key => {
      const control = this.createForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Verifica se um campo tem erro
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.createForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  /**
   * Obtém a mensagem de erro de um campo
   */
  getFieldError(fieldName: string): string {
    const field = this.createForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field.errors?.['required']) {
        return 'Campo obrigatório';
      }
      if (field.errors?.['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `Mínimo de ${requiredLength} caracteres`;
      }
    }
    return '';
  }

  /**
   * Obtém a classe CSS para um campo
   */
  getFieldClasses(fieldName: string): string {
    const field = this.createForm.get(fieldName);
    if (this.hasFieldError(fieldName)) {
      return 'border-red-500';
    }
    if (field?.valid && field?.touched) {
      return 'border-green-500';
    }
    return 'border-gray-300';
  }



  /**
   * Obtém o label para o status do projeto
   */
  getEstadoLabel(estado: EstadoProjecto | string): string {
    if (typeof estado === 'string') {
      const estadoLower = estado.toLowerCase();
      switch (estadoLower) {
        case 'ativo': return 'Ativo';
        case 'pendente': return 'Pendente';
        case 'concluido': return 'Concluído';
        case 'cancelado': return 'Cancelado';
        case 'pausado': return 'Pausado';
        default: return 'Ativo';
      }
    }
    
    switch (estado) {
      case 'ativo': return 'Ativo';
      case 'pausado': return 'Pausado';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      case 'pendente': return 'Pendente';
      default: return 'Ativo';
    }
  }

  /**
   * Obtém a classe CSS para o status do projeto
   */
  getEstadoClass(estado: EstadoProjecto | string): string {
    if (typeof estado === 'string') {
      const estadoLower = estado.toLowerCase();
      switch (estadoLower) {
        case 'ativo': return 'estado-projeto-ativo';
        case 'pendente': return 'estado-projeto-pendente';
        case 'concluido': return 'estado-projeto-concluido';
        case 'cancelado': return 'estado-projeto-cancelado';
        default: return 'estado-projeto-ativo';
      }
    }
    
    switch (estado) {
      case 'ativo': return 'estado-projeto-ativo';
      case 'pausado': return 'estado-projeto-pausado';
      case 'concluido': return 'estado-projeto-concluido';
      case 'cancelado': return 'estado-projeto-cancelado';
      case 'pendente': return 'estado-projeto-pendente';
      default: return 'estado-projeto-ativo';
    }
  }

  /**
   * Navegar para a página de detalhes do projeto
   */
  openProject(projectId: number): void {
    this.router.navigate(['/user/projeto', projectId]);
  }
}
