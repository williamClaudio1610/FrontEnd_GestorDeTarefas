import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProjectoService } from '../../../../Servicos/projecto.service';
import { TarefaService } from '../../../../Servicos/tarefa.service';
import { UsuarioService } from '../../../../Servicos/usuario.service';
import { EquipeService } from '../../../../Servicos/equipe.service';
import { AuthService } from '../../../../Servicos/auth.service';
import { Projecto, EstadoProjecto } from '../../../../Modelos/Projecto';
import { Tarefa, CriarTarefa, EstadoTarefa, RelevanciaTarefa } from '../../../../Modelos/Tarefa';
import { Usuario } from '../../../../Modelos/Usuario';

@Component({
  selector: 'app-user-dentro-do-projecto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    ChipModule,
    BadgeModule,
    AvatarModule,
    DialogModule,
    InputTextModule,
    ToastModule
  ],
  templateUrl: './user-dentro-do-projecto.html',
  styleUrl: './user-dentro-do-projecto.css',
  providers: [MessageService]
})
export class UserDentroDoProjecto implements OnInit, OnDestroy {
  // Dados do projeto
  projeto: Projecto | null = null;
  tarefas: Tarefa[] = [];
  usuarios: Usuario[] = [];
  usuariosEquipe: Usuario[] = [];
  equipes: any[] = [];
  
  // Estados
  loading = false;
  error = false;
  
  // Router público para template
  public router!: Router;
  
  // Dialog de criar tarefa
  showCreateTaskDialog = false;
  createTaskForm: FormGroup;
  isCreatingTask = false;
  
  // Dialog de editar projeto
  showEditProjectDialog = false;
  editProjectForm: FormGroup;
  isEditingProject = false;
  
  // Subscriptions
  private subscriptions: Subscription = new Subscription();
  
  // Options para dropdowns
  estadoOptions = [
    { label: 'Pendente', value: EstadoTarefa.PENDENTE },
    { label: 'Em Andamento', value: EstadoTarefa.EM_ANDAMENTO },
    { label: 'Concluída', value: EstadoTarefa.CONCLUIDA },
    { label: 'Cancelada', value: EstadoTarefa.CANCELADA }
  ];
  
  relevanciaOptions = [
    { label: 'Baixo', value: RelevanciaTarefa.BAIXO },
    { label: 'Médio', value: RelevanciaTarefa.MEDIO },
    { label: 'Alto', value: RelevanciaTarefa.ALTO }
  ];

  estadoProjectoOptions = [
    { label: 'Ativo', value: EstadoProjecto.EM_ANDAMENTO },
    { label: 'Concluído', value: EstadoProjecto.CONCLUIDO },
    { label: 'Cancelado', value: EstadoProjecto.CANCELADO }
  ];

  constructor(
    private route: ActivatedRoute,
    private routerService: Router,
    private fb: FormBuilder,
    private projectoService: ProjectoService,
    private tarefaService: TarefaService,
    private usuarioService: UsuarioService,
    private equipeService: EquipeService,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.router = this.routerService;
    this.createTaskForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required, Validators.minLength(10)]],
      relevancia: [RelevanciaTarefa.MEDIO, Validators.required],
      dataLimite: ['', Validators.required],
      responsavelId: ['']
    });
    
    this.editProjectForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required, Validators.minLength(10)]],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
      estado: ['ativo', Validators.required],
      equipeId: ['', Validators.required]
    });
  }

  ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProjectData(+projectId);
    } else {
      this.routerService.navigate(['/user/projectos']);
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadProjectData(projectId: number) {
    this.loading = true;
    this.error = false;

    // Carregar dados do projeto
    const projectSub = this.projectoService.getProjectoById(projectId).subscribe({
      next: (response: any) => {
        console.log('Projeto carregado:', response);
        this.projeto = response.data;
        
        // Extrair tarefas diretamente do projeto
        this.tarefas = response.data?.tarefas || [];
        console.log('Tarefas do projeto:', this.tarefas);
        
        // Carregar usuários da equipe
        this.loadUsuarios();
      },
      error: (error) => {
        console.error('Erro ao carregar projeto:', error);
        this.error = true;
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar dados do projeto',
          life: 5000
        });
      }
    });

    this.subscriptions.add(projectSub);
  }



  loadUsuarios() {
    if (!this.projeto?.equipe?.id) {
      console.log('Projeto ou equipe não encontrados');
      this.loading = false;
      return;
    }

    // Carregar membros da equipe do projeto
    const equipeSub = this.equipeService.getEquipeById(this.projeto.equipe.id).subscribe({
      next: (response: any) => {
        console.log('Equipe carregada:', response);
        const equipe = response.data;
        this.usuariosEquipe = equipe?.membros || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar membros da equipe:', error);
        // Fallback: carregar todos os usuários se não conseguir carregar a equipe
        this.loadAllUsuarios();
      }
    });

    this.subscriptions.add(equipeSub);
  }

  private loadAllUsuarios() {
    const usersSub = this.usuarioService.getUsuarios().subscribe({
      next: (response: any) => {
        this.usuarios = response.data || [];
        this.usuariosEquipe = this.usuarios; // Usar todos os usuários como fallback
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.loading = false;
      }
    });

    this.subscriptions.add(usersSub);
  }

  openCreateTaskDialog() {
    this.createTaskForm.reset({
      relevancia: RelevanciaTarefa.MEDIO
    });
    this.showCreateTaskDialog = true;
  }

  closeCreateTaskDialog() {
    this.showCreateTaskDialog = false;
    this.createTaskForm.reset();
  }

  openEditProjectDialog() {
    if (!this.projeto) return;
    
    // Carregar equipes para o dropdown
    this.loadEquipes();
    
    // Preencher formulário com dados atuais do projeto
    this.editProjectForm.patchValue({
      nome: this.projeto.nome,
      descricao: this.projeto.descricao,
      dataInicio: this.formatDateForInput(this.projeto.dataInicio),
      dataFim: this.formatDateForInput(this.projeto.dataFim),
      estado: this.projeto.estado || 'ativo',
      equipeId: this.projeto.equipe?.id || this.projeto.equipeId
    });
    
    this.showEditProjectDialog = true;
  }

  closeEditProjectDialog() {
    this.showEditProjectDialog = false;
    this.editProjectForm.reset();
  }

  private formatDateForInput(date: Date | string | null | undefined): string {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toISOString().split('T')[0];
  }

  loadEquipes() {
    const equipesSub = this.equipeService.getEquipes().subscribe({
      next: (response: any) => {
        this.equipes = response.data || [];
      },
      error: (error) => {
        console.error('Erro ao carregar equipes:', error);
      }
    });

    this.subscriptions.add(equipesSub);
  }

  createTask() {
    if (this.createTaskForm.invalid || !this.projeto) {
      this.markFormGroupTouched();
      return;
    }

    this.isCreatingTask = true;
    const formData = this.createTaskForm.value;
    
    const novaTarefa: CriarTarefa = {
      titulo: formData.titulo,
      descricao: formData.descricao,
      relevancia: formData.relevancia,
      dataLimite: formData.dataLimite,
      responsavelId: formData.responsavelId || undefined,
      projectoId: this.projeto.id
    };

    const createSub = this.tarefaService.criarTarefa(novaTarefa).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Tarefa criada com sucesso!',
          life: 5000
        });
        
        this.closeCreateTaskDialog();
        // Recarregar dados do projeto para obter tarefas atualizadas
        this.loadProjectData(this.projeto!.id);
      },
      error: (error) => {
        console.error('Erro ao criar tarefa:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao criar tarefa. Tente novamente.',
          life: 5000
        });
      },
      complete: () => {
        this.isCreatingTask = false;
      }
    });

    this.subscriptions.add(createSub);
  }

  editProject() {
    if (this.editProjectForm.invalid || !this.projeto) {
      this.markFormGroupTouched(this.editProjectForm);
      return;
    }

    this.isEditingProject = true;
    const formData = this.editProjectForm.value;
    
    const projectUpdate = {
      nome: formData.nome,
      descricao: formData.descricao,
      dataInicio: formData.dataInicio,
      dataFim: formData.dataFim,
      estado: formData.estado,
      equipeId: formData.equipeId
    };

    const updateSub = this.projectoService.atualizarProjecto(this.projeto.id, projectUpdate).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Projeto atualizado com sucesso!',
          life: 5000
        });
        
        this.closeEditProjectDialog();
        // Recarregar dados do projeto
        this.loadProjectData(this.projeto!.id);
      },
      error: (error) => {
        console.error('Erro ao atualizar projeto:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao atualizar projeto. Tente novamente.',
          life: 5000
        });
      },
      complete: () => {
        this.isEditingProject = false;
      }
    });

    this.subscriptions.add(updateSub);
  }

  private markFormGroupTouched(form?: FormGroup) {
    const targetForm = form || this.createTaskForm;
    Object.keys(targetForm.controls).forEach(key => {
      const control = targetForm.get(key);
      control?.markAsTouched();
    });
  }

  hasFieldError(fieldName: string, form?: FormGroup): boolean {
    const targetForm = form || this.createTaskForm;
    const field = targetForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(fieldName: string, form?: FormGroup): string {
    const targetForm = form || this.createTaskForm;
    const field = targetForm.get(fieldName);
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

  getFieldClasses(fieldName: string, form?: FormGroup): string {
    const targetForm = form || this.createTaskForm;
    const field = targetForm.get(fieldName);
    if (this.hasFieldError(fieldName, form)) {
      return 'border-red-500';
    }
    if (field?.valid && field?.touched) {
      return 'border-green-500';
    }
    return 'border-gray-300';
  }

  getEstadoClass(estado: string): string {
    const estadoLower = estado?.toLowerCase();
    switch (estadoLower) {
      case 'pendente': return 'status-pendente';
      case 'emandamento': 
      case 'em_andamento':
      case 'em andamento': return 'status-andamento';
      case 'concluida':
      case 'concluído':
      case 'concluída': return 'status-concluida';
      case 'cancelada':
      case 'cancelado': return 'status-cancelada';
      default: return 'status-pendente';
    }
  }

  getEstadoLabel(estado: string): string {
    const estadoLower = estado?.toLowerCase();
    switch (estadoLower) {
      case 'pendente': return 'Pendente';
      case 'emandamento':
      case 'em_andamento':
      case 'em andamento': return 'Em Andamento';
      case 'concluida':
      case 'concluído':
      case 'concluída': return 'Concluída';
      case 'cancelada':
      case 'cancelado': return 'Cancelada';
      default: return 'Pendente';
    }
  }

  getRelevanciaClass(relevancia: string): string {
    const relevanciaLower = relevancia?.toLowerCase();
    switch (relevanciaLower) {
      case 'baixo': return 'relevancia-baixa';
      case 'medio':
      case 'médio': return 'relevancia-media';
      case 'alto': return 'relevancia-alta';
      default: return 'relevancia-media';
    }
  }

  getRelevanciaLabel(relevancia: string): string {
    const relevanciaLower = relevancia?.toLowerCase();
    switch (relevanciaLower) {
      case 'baixo': return 'Baixo';
      case 'medio':
      case 'médio': return 'Médio';
      case 'alto': return 'Alto';
      default: return 'Médio';
    }
  }

  isTaskOverdue(dataLimite: Date): boolean {
    return new Date(dataLimite) < new Date();
  }

  getDaysUntilDeadline(dataLimite: Date): number {
    const today = new Date();
    const deadline = new Date(dataLimite);
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getEstadoProjectoLabel(estado: EstadoProjecto | string): string {
    if (typeof estado === 'string') {
      switch (estado.toLowerCase()) {
        case 'ativo': return 'Ativo';
        case 'pausado': return 'Pausado';
        case 'concluido': return 'Concluído';
        case 'cancelado': return 'Cancelado';
        case 'pendente': return 'Pendente';
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

  getEstadoProjectoClass(estado: EstadoProjecto | string): string {
    if (typeof estado === 'string') {
      switch (estado.toLowerCase()) {
        case 'ativo': return 'estado-projeto-ativo';
        case 'pausado': return 'estado-projeto-pausado';
        case 'concluido': return 'estado-projeto-concluido';
        case 'cancelado': return 'estado-projeto-cancelado';
        case 'pendente': return 'estado-projeto-pendente';
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
}
