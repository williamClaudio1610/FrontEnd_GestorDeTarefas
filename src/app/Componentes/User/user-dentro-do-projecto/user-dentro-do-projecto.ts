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
import { AuthService } from '../../../../Servicos/auth.service';
import { Projecto } from '../../../../Modelos/Projecto';
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
  
  // Estados
  loading = false;
  error = false;
  
  // Router público para template
  public router!: Router;
  
  // Dialog de criar tarefa
  showCreateTaskDialog = false;
  createTaskForm: FormGroup;
  isCreatingTask = false;
  
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

  constructor(
    private route: ActivatedRoute,
    private routerService: Router,
    private fb: FormBuilder,
    private projectoService: ProjectoService,
    private tarefaService: TarefaService,
    private usuarioService: UsuarioService,
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
        this.projeto = response.data;
        this.loadProjectTasks(projectId);
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

  loadProjectTasks(projectId: number) {
    // Por enquanto, usar dados mock até ter endpoint específico para tarefas do projeto
    // TODO: Implementar endpoint /projetos/{id}/tarefas no backend
    const mockTasks: Tarefa[] = [
      {
        id: 1,
        titulo: 'Implementar autenticação',
        descricao: 'Desenvolver sistema de login e registro de usuários',
        estado: EstadoTarefa.EM_ANDAMENTO,
        relevancia: RelevanciaTarefa.ALTO,
        dataLimite: new Date('2025-01-15'),
        responsavelId: 1,
        projectoId: projectId,
        responsavel: {
          id: 1,
          nome: 'João Silva',
          email: 'joao@exemplo.com',
          telefone: '',
          cargoId: 1,
          nivelHierarquico: 'senior' as any,
          estado: 'ativo' as any,
          role: 'user' as any
        }
      },
      {
        id: 2,
        titulo: 'Criar interface de dashboard',
        descricao: 'Desenvolver dashboard principal com estatísticas',
        estado: EstadoTarefa.PENDENTE,
        relevancia: RelevanciaTarefa.MEDIO,
        dataLimite: new Date('2025-01-20'),
        responsavelId: 2,
        projectoId: projectId,
        responsavel: {
          id: 2,
          nome: 'Maria Santos',
          email: 'maria@exemplo.com',
          telefone: '',
          cargoId: 1,
          nivelHierarquico: 'pleno' as any,
          estado: 'ativo' as any,
          role: 'user' as any
        }
      }
    ];

    this.tarefas = mockTasks;
    this.loadUsuarios();
  }

  loadUsuarios() {
    const usersSub = this.usuarioService.getUsuarios().subscribe({
      next: (response: any) => {
        this.usuarios = response.data || [];
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
        this.loadProjectTasks(this.projeto!.id);
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

  private markFormGroupTouched() {
    Object.keys(this.createTaskForm.controls).forEach(key => {
      const control = this.createTaskForm.get(key);
      control?.markAsTouched();
    });
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.createTaskForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.createTaskForm.get(fieldName);
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

  getFieldClasses(fieldName: string): string {
    const field = this.createTaskForm.get(fieldName);
    if (this.hasFieldError(fieldName)) {
      return 'border-red-500';
    }
    if (field?.valid && field?.touched) {
      return 'border-green-500';
    }
    return 'border-gray-300';
  }

  getEstadoClass(estado: EstadoTarefa): string {
    switch (estado) {
      case EstadoTarefa.PENDENTE: return 'status-pendente';
      case EstadoTarefa.EM_ANDAMENTO: return 'status-andamento';
      case EstadoTarefa.CONCLUIDA: return 'status-concluida';
      case EstadoTarefa.CANCELADA: return 'status-cancelada';
      default: return 'status-pendente';
    }
  }

  getEstadoLabel(estado: EstadoTarefa): string {
    switch (estado) {
      case EstadoTarefa.PENDENTE: return 'Pendente';
      case EstadoTarefa.EM_ANDAMENTO: return 'Em Andamento';
      case EstadoTarefa.CONCLUIDA: return 'Concluída';
      case EstadoTarefa.CANCELADA: return 'Cancelada';
      default: return 'Pendente';
    }
  }

  getRelevanciaClass(relevancia: RelevanciaTarefa): string {
    switch (relevancia) {
      case RelevanciaTarefa.BAIXO: return 'relevancia-baixa';
      case RelevanciaTarefa.MEDIO: return 'relevancia-media';
      case RelevanciaTarefa.ALTO: return 'relevancia-alta';
      default: return 'relevancia-media';
    }
  }

  getRelevanciaLabel(relevancia: RelevanciaTarefa): string {
    switch (relevancia) {
      case RelevanciaTarefa.BAIXO: return 'Baixo';
      case RelevanciaTarefa.MEDIO: return 'Médio';
      case RelevanciaTarefa.ALTO: return 'Alto';
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
}
