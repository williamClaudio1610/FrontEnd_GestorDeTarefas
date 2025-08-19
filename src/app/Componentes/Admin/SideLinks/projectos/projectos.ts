import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProjectoService } from '../../../../../Servicos/projecto.service';
import { EquipeService } from '../../../../../Servicos/equipe.service';
import { NotificacaoService } from '../../../../../Servicos/notificacao.service';
import { Projecto, CriarProjecto } from '../../../../../Modelos/Projecto';
import { Equipe } from '../../../../../Modelos/Equipe';

@Component({
  selector: 'app-projectos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ToastModule],
  templateUrl: './projectos.html',
  styleUrl: './projectos.css',
  providers: [MessageService]
})
export class ProjectosComponent implements OnInit {
  // Busca e UI
  searchTerm = '';
  showFilters = false;

  // Dados
  projectos: Projecto[] = [];
  filteredProjectos: Projecto[] = [];
  equipes: { id: number; nome: string }[] = [];

  // Paginação
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Modal novo projeto
  isAddOpen = false;
  isSaving = false;
  newProjecto: Partial<CriarProjecto> = {
    nome: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    equipeId: undefined as unknown as number
  };

  constructor(
    private projectoService: ProjectoService,
    private equipeService: EquipeService,
    private notificacao: NotificacaoService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProjectos();
    this.loadEquipes();
  }

  // Carregar projetos
  loadProjectos() {
    this.messageService.add({
      severity: 'info',
      summary: 'Carregando',
      detail: 'Carregando lista de projetos...',
      life: 2000
    });

    this.projectoService.getProjectos().subscribe({
      next: (response: any) => {
        const projectos = response.data;
        this.projectos = (projectos as Projecto[]).map(p => ({
          ...p,
          dataInicio: p.dataInicio ? new Date(p.dataInicio as unknown as string) : new Date(),
          dataFim: p.dataFim ? new Date(p.dataFim as unknown as string) : new Date(),
          createdAt: p.createdAt ? new Date(p.createdAt as unknown as string) : new Date(),
          updatedAt: p.updatedAt ? new Date(p.updatedAt as unknown as string) : new Date()
        }));
        this.filteredProjectos = [...this.projectos];
        this.calculatePagination();
        
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `${this.projectos.length} projetos carregados com sucesso`,
          life: 3000
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar projetos',
          life: 5000
        });
        this.notificacao.erroGenerico('Falha ao carregar projetos.');
      }
    });
  }

  // Carregar equipes
  loadEquipes() {
    this.messageService.add({
      severity: 'info',
      summary: 'Carregando',
      detail: 'Carregando lista de equipes...',
      life: 2000
    });

    this.equipeService.getEquipes().subscribe({
      next: (response: any) => {
        const equipes = response.data;
        this.equipes = equipes as Equipe[];
        
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `${this.equipes.length} equipes carregadas para seleção`,
          life: 2000
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar equipes',
          life: 5000
        });
        this.notificacao.erroGenerico('Falha ao carregar equipes.');
      }
    });
  }

  onSearch() {
    this.currentPage = 1;
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredProjectos = !term ? [...this.projectos] : this.projectos.filter(p =>
      (p.nome || '').toLowerCase().includes(term) ||
      (p.descricao || '').toLowerCase().includes(term)
    );
    this.calculatePagination();
  }

  toggleFilters() { this.showFilters = !this.showFilters; }

  openAddModal() {
    this.newProjecto = {
      nome: '',
      descricao: '',
      dataInicio: new Date().toISOString().slice(0, 10),
      dataFim: '',
      equipeId: this.equipes[0]?.id
    };
    this.isAddOpen = true;
  }

  closeAddModal() { this.isAddOpen = false; }

  // Salvar projeto
  saveProjecto() {
    if (!this.newProjecto.nome?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validação',
        detail: 'Nome do projeto é obrigatório',
        life: 4000
      });
      return;
    }

    this.isSaving = true;
    
    this.messageService.add({
      severity: 'info',
      summary: 'Salvando',
      detail: 'Criando novo projeto...',
      life: 2000
    });

    const projectoData: CriarProjecto = {
      nome: this.newProjecto.nome || '',
      descricao: this.newProjecto.descricao || '',
      dataInicio: this.newProjecto.dataInicio || new Date().toISOString().split('T')[0],
      dataFim: this.newProjecto.dataFim,
      equipeId: this.newProjecto.equipeId || 1
    };

    this.projectoService.criarProjecto(projectoData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Projeto criado com sucesso!',
          life: 4000
        });
        this.closeAddModal();
        this.loadProjectos();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao criar projeto',
          life: 5000
        });
        this.notificacao.erroGenerico('Não foi possível criar o projeto.');
        this.isSaving = false;
      }
    });
  }

  // Paginação utilitários
  getCurrentPageProjectos(): Projecto[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProjectos.slice(startIndex, endIndex);
  }

  get startIndex(): number { return (this.currentPage - 1) * this.itemsPerPage; }
  get endIndex(): number { return Math.min(this.currentPage * this.itemsPerPage, this.filteredProjectos.length); }

  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredProjectos.length / this.itemsPerPage) || 1;
    this.currentPage = Math.min(this.currentPage, this.totalPages);
  }

  previousPage() { if (this.currentPage > 1) this.currentPage--; }
  nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }
  goToPage(page: number) { this.currentPage = page; }
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, start + maxVisible - 1);
      if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  }
}
