import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Projecto, CriarProjecto } from '../../../../../Modelos';
import { ProjectoService, EquipeService, NotificacaoService } from '../../../../../Servicos';

@Component({
  selector: 'app-projectos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projectos.html',
  styleUrl: './projectos.css'
})
export class Projectos implements OnInit {
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
    private notificacao: NotificacaoService
  ) {}

  ngOnInit(): void {
    this.loadProjectos();
    this.loadEquipes();
  }

  loadProjectos() {
    this.projectoService.getProjectos().subscribe({
      next: (resp) => {
        const list: any[] = Array.isArray(resp) ? resp as any[] : ((resp as any)?.data ?? []);
        this.projectos = (list as unknown as Projecto[]).map(p => ({
          ...p,
          createdAt: (p as any)?.createdAt ? new Date((p as any).createdAt) : undefined,
          updatedAt: (p as any)?.updatedAt ? new Date((p as any).updatedAt) : undefined,
          dataInicio: (p as any)?.dataInicio ? new Date((p as any).dataInicio) : (p as any)?.dataInicio,
          dataFim: (p as any)?.dataFim ? new Date((p as any).dataFim) : (p as any)?.dataFim,
        }));
        this.filteredProjectos = [...this.projectos];
        this.calculatePagination();
      },
      error: () => this.notificacao.erroGenerico('Falha ao carregar projetos.')
    });
  }

  loadEquipes() {
    this.equipeService.getEquipes().subscribe({
      next: (resp) => {
        const list: any[] = Array.isArray(resp) ? resp as any[] : ((resp as any)?.data ?? []);
        this.equipes = (list as any[]).map((e: any) => ({ id: e.id, nome: e.nome }));
      },
      error: () => {}
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

  saveProjecto() {
    if (!this.newProjecto.nome || !this.newProjecto.descricao || !this.newProjecto.equipeId) {
      this.notificacao.erroValidacao('Preencha nome, descrição e equipe.');
      return;
    }
    this.isSaving = true;
    this.projectoService.criarProjecto(this.newProjecto as CriarProjecto).subscribe({
      next: () => {
        this.isSaving = false;
        this.isAddOpen = false;
        this.notificacao.sucesso('Projeto Criado', 'O projeto foi criado com sucesso.');
        this.loadProjectos();
      },
      error: () => {
        this.isSaving = false;
        this.notificacao.erroGenerico('Não foi possível criar o projeto.');
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
