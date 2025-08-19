import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Equipe, CriarEquipe } from '../../../../../Modelos';
import { EquipeService, NotificacaoService } from '../../../../../Servicos';

@Component({
  selector: 'app-equipes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './equipes.html',
  styleUrl: './equipes.css'
})
export class Equipes implements OnInit {
  // Busca e UI
  searchTerm = '';
  showFilters = false;

  // Dados
  equipes: Equipe[] = [];
  filteredEquipes: Equipe[] = [];

  // Paginação
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Modal de nova equipe
  isAddOpen = false;
  isSaving = false;
  newEquipe: CriarEquipe = {
    nome: '',
    descricao: ''
  };

  constructor(
    private equipeService: EquipeService,
    private notificacao: NotificacaoService
  ) {}

  ngOnInit(): void {
    this.loadEquipes();
  }

  loadEquipes() {
    this.equipeService.getEquipes().subscribe({
      next: (resp) => {
        const list: any[] = Array.isArray(resp) ? resp as any[] : ((resp as any)?.data ?? []);
        this.equipes = (list as unknown as Equipe[]).map(e => ({
          ...e,
          createdAt: (e as any)?.createdAt ? new Date((e as any).createdAt) : undefined,
          updatedAt: (e as any)?.updatedAt ? new Date((e as any).updatedAt) : undefined,
        }));
        this.filteredEquipes = [...this.equipes];
        this.calculatePagination();
      },
      error: () => this.notificacao.erroGenerico('Falha ao carregar equipes.')
    });
  }

  onSearch() {
    this.currentPage = 1;
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredEquipes = [...this.equipes];
    } else {
      this.filteredEquipes = this.equipes.filter(e =>
        (e.nome || '').toLowerCase().includes(term) ||
        (e.descricao || '').toLowerCase().includes(term)
      );
    }
    this.calculatePagination();
  }

  toggleFilters() { this.showFilters = !this.showFilters; }

  openAddModal() {
    this.newEquipe = { nome: '', descricao: '' };
    this.isAddOpen = true;
  }

  closeAddModal() { this.isAddOpen = false; }

  saveEquipe() {
    if (!this.newEquipe.nome) {
      this.notificacao.erroValidacao('Informe o nome da equipe.');
      return;
    }
    this.isSaving = true;
    this.equipeService.criarEquipe(this.newEquipe).subscribe({
      next: () => {
        this.isSaving = false;
        this.isAddOpen = false;
        this.notificacao.sucesso('Equipe Criada', 'A equipe foi criada com sucesso.');
        this.loadEquipes();
      },
      error: () => {
        this.isSaving = false;
        this.notificacao.erroGenerico('Não foi possível criar a equipe.');
      }
    });
  }

  // Paginação utilitários
  getCurrentPageEquipes(): Equipe[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredEquipes.slice(startIndex, endIndex);
  }

  get startIndex(): number { return (this.currentPage - 1) * this.itemsPerPage; }
  get endIndex(): number { return Math.min(this.currentPage * this.itemsPerPage, this.filteredEquipes.length); }

  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredEquipes.length / this.itemsPerPage) || 1;
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
