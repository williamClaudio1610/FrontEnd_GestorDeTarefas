import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cargo, CriarCargo, AtualizarCargo } from '../../../../../Modelos';
import { CargoService, NotificacaoService } from '../../../../../Servicos';

@Component({
  selector: 'app-cargos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cargos.html',
  styleUrl: './cargos.css'
})
export class CargosComponent implements OnInit {
  searchTerm = '';
  cargos: Cargo[] = [];
  filteredCargos: Cargo[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Modal
  isAddOpen = false;
  isSaving = false;
  newCargo: CriarCargo = { nome: '', descricao: '' };

  constructor(private cargoService: CargoService, private notificacao: NotificacaoService) {}

  ngOnInit(): void { this.loadCargos(); }

  loadCargos() {
    this.cargoService.getCargos().subscribe({
      next: (resp) => {
        const list: any[] = Array.isArray(resp) ? resp as any[] : ((resp as any)?.data ?? []);
        this.cargos = list as Cargo[];
        this.filteredCargos = [...this.cargos];
        this.calculatePagination();
      },
      error: () => this.notificacao.erroGenerico('Falha ao carregar cargos.')
    });
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredCargos = !term ? [...this.cargos] : this.cargos.filter(c =>
      (c.nome || '').toLowerCase().includes(term) || (c.descricao || '').toLowerCase().includes(term)
    );
    this.currentPage = 1;
    this.calculatePagination();
  }

  openAddModal() { this.newCargo = { nome: '', descricao: '' }; this.isAddOpen = true; }
  closeAddModal() { this.isAddOpen = false; }

  saveCargo() {
    if (!this.newCargo.nome) { this.notificacao.erroValidacao('Informe o nome do cargo.'); return; }
    this.isSaving = true;
    this.cargoService.criarCargo(this.newCargo).subscribe({
      next: () => { this.isSaving = false; this.isAddOpen = false; this.notificacao.sucesso('Cargo Criado', 'Cargo criado com sucesso.'); this.loadCargos(); },
      error: () => { this.isSaving = false; this.notificacao.erroGenerico('Não foi possível criar o cargo.'); }
    });
  }

  getCurrentPageCargos(): Cargo[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCargos.slice(startIndex, endIndex);
  }

  get startIndex(): number { return (this.currentPage - 1) * this.itemsPerPage; }
  get endIndex(): number { return Math.min(this.currentPage * this.itemsPerPage, this.filteredCargos.length); }
  calculatePagination() { this.totalPages = Math.ceil(this.filteredCargos.length / this.itemsPerPage) || 1; this.currentPage = Math.min(this.currentPage, this.totalPages); }
  previousPage() { if (this.currentPage > 1) this.currentPage--; }
  nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }
  goToPage(page: number) { this.currentPage = page; }
  getPageNumbers(): number[] { const pages: number[] = []; const max = 5; let start = Math.max(1, this.currentPage - 2); let end = Math.min(this.totalPages, start + max - 1); if (end - start + 1 < max) start = Math.max(1, end - max + 1); for (let i = start; i <= end; i++) pages.push(i); return pages; }
}
