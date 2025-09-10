import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../../../Servicos/usuario.service';
import { EquipeService } from '../../../../../Servicos/equipe.service';
import { ProjectoService } from '../../../../../Servicos/projecto.service';
import { TarefaService } from '../../../../../Servicos/tarefa.service';
import { CargoService } from '../../../../../Servicos/cargo.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  providers: [
    UsuarioService,
    EquipeService,
    ProjectoService,
    TarefaService,
    CargoService
  ]
})
export class Dashboard implements OnInit {
  // Dados reais do sistema
  totalUsuarios = 0;
  totalProjetos = 0;
  totalTarefasPendentes = 0;
  totalEquipes = 0;
  totalCargos = 0;
  
  // Estados de carregamento
  isLoadingUsuarios = true;
  isLoadingProjetos = true;
  isLoadingTarefas = true;
  isLoadingEquipes = true;
  isLoadingCargos = true;
  
  // Atividades recentes (será implementado futuramente)
  atividadesRecentes: any[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private equipeService: EquipeService,
    private projectoService: ProjectoService,
    private tarefaService: TarefaService,
    private cargoService: CargoService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  // Carregar todos os dados do dashboard
  loadDashboardData(): void {
    console.log('=== INICIANDO CARREGAMENTO DO DASHBOARD ===');
    console.log('Serviços disponíveis:', {
      usuarioService: !!this.usuarioService,
      equipeService: !!this.equipeService,
      projectoService: !!this.projectoService,
      tarefaService: !!this.tarefaService,
      cargoService: !!this.cargoService
    });
    
    this.loadUsuarios();
    this.loadProjetos();
    this.loadTarefas();
    this.loadEquipes();
    this.loadCargos();
  }

  // Carregar dados de usuários
  loadUsuarios(): void {
    console.log('Iniciando carregamento de usuários...');
    this.usuarioService.getUsuarios().subscribe({
      next: (response: any) => {
        console.log('=== RESPOSTA COMPLETA USUÁRIOS ===');
        console.log('Response:', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', Object.keys(response));
        console.log('Response.data:', response.data);
        console.log('Response.data type:', typeof response.data);
        console.log('Response.data length:', response.data?.length);
        
        const usuarios = response.data || [];
        this.totalUsuarios = usuarios.length;
        console.log('Total usuários calculado:', this.totalUsuarios);
        this.isLoadingUsuarios = false;
      },
      error: (error) => {
        console.error('=== ERRO AO CARREGAR USUÁRIOS ===');
        console.error('Error:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        this.totalUsuarios = 0;
        this.isLoadingUsuarios = false;
      }
    });
  }

  // Carregar dados de projetos
  loadProjetos(): void {
    this.projectoService.getProjectos().subscribe({
      next: (response: any) => {
        console.log('Resposta projetos:', response);
        console.log('Data projetos:', response.data);
        const projetos = response.data || [];
        this.totalProjetos = projetos.length;
        this.isLoadingProjetos = false;
      },
      error: (error) => {
        console.error('Erro ao carregar projetos:', error);
        this.totalProjetos = 0;
        this.isLoadingProjetos = false;
      }
    });
  }

  // Carregar dados de tarefas
  loadTarefas(): void {
    this.tarefaService.getTarefas().subscribe({
      next: (response: any) => {
        console.log('Resposta tarefas:', response);
        console.log('Data tarefas:', response.data);
        const tarefas = response.data || [];
        // Filtrar apenas tarefas pendentes
        this.totalTarefasPendentes = tarefas.filter((tarefa: any) => 
          tarefa.estado === 'pendente' || tarefa.estado === 'em_andamento'
        ).length;
        this.isLoadingTarefas = false;
      },
      error: (error) => {
        console.error('Erro ao carregar tarefas:', error);
        this.totalTarefasPendentes = 0;
        this.isLoadingTarefas = false;
      }
    });
  }

  // Carregar dados de equipes
  loadEquipes(): void {
    this.equipeService.getEquipes().subscribe({
      next: (response: any) => {
        console.log('Resposta equipes:', response);
        console.log('Data equipes:', response.data);
        const equipes = response.data || [];
        this.totalEquipes = equipes.length;
        this.isLoadingEquipes = false;
      },
      error: (error) => {
        console.error('Erro ao carregar equipes:', error);
        this.totalEquipes = 0;
        this.isLoadingEquipes = false;
      }
    });
  }

  // Carregar dados de cargos
  loadCargos(): void {
    this.cargoService.getCargos().subscribe({
      next: (response: any) => {
        console.log('Resposta cargos:', response);
        console.log('Data cargos:', response.data);
        const cargos = response.data || [];
        this.totalCargos = cargos.length;
        this.isLoadingCargos = false;
      },
      error: (error) => {
        console.error('Erro ao carregar cargos:', error);
        this.totalCargos = 0;
        this.isLoadingCargos = false;
      }
    });
  }

  // Verificar se todos os dados foram carregados
  get isDataLoaded(): boolean {
    return !this.isLoadingUsuarios && !this.isLoadingProjetos && 
           !this.isLoadingTarefas && !this.isLoadingEquipes && !this.isLoadingCargos;
  }
}
