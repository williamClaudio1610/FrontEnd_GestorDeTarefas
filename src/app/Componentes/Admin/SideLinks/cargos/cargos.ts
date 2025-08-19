import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CargoService } from '../../../../../Servicos/cargo.service';
import { NotificacaoService } from '../../../../../Servicos/notificacao.service';
import { Cargo, CriarCargo } from '../../../../../Modelos/Cargo';

@Component({
  selector: 'app-cargos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ToastModule],
  templateUrl: './cargos.html',
  styleUrl: './cargos.css',
  providers: [MessageService]
})
export class CargosComponent implements OnInit {
  searchTerm = '';
  cargos: Cargo[] = [];
  filteredCargos: Cargo[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  totalCargos = 0;

  // Modal
  isAddOpen = false;
  isSaving = false;
  newCargo: CriarCargo = { nome: '', descricao: '' };

  constructor(
    private cargoService: CargoService,
    private notificacao: NotificacaoService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadCargos();
  }

  // Carregar cargos
  loadCargos() {
    this.messageService.add({
      severity: 'info',
      summary: 'Carregando',
      detail: 'Carregando lista de cargos...',
      life: 2000
    });

    this.cargoService.getCargos().subscribe({
      next: (response: any) => {
        const cargos = response.data;
        this.cargos = (cargos as Cargo[]).map(c => ({
          ...c,
          createdAt: c.createdAt ? new Date(c.createdAt as unknown as string) : new Date(),
          updatedAt: c.updatedAt ? new Date(c.updatedAt as unknown as string) : new Date()
        }));
        this.filteredCargos = [...this.cargos];
        this.totalCargos = this.cargos.length;
        this.calculatePagination();
        
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `${this.cargos.length} cargos carregados com sucesso`,
          life: 3000
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar cargos',
          life: 5000
        });
        this.notificacao.erroGenerico('Falha ao carregar cargos.');
      }
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

  // Salvar cargo
  saveCargo() {
    if (!this.newCargo.nome?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validação',
        detail: 'Nome do cargo é obrigatório',
        life: 4000
      });
      return;
    }

    this.isSaving = true;
    
    this.messageService.add({
      severity: 'info',
      summary: 'Salvando',
      detail: 'Criando novo cargo...',
      life: 2000
    });

    const cargoData: CriarCargo = {
      nome: this.newCargo.nome,
      descricao: this.newCargo.descricao || ''
    };

    this.cargoService.criarCargo(cargoData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Cargo criado com sucesso!',
          life: 4000
        });
        this.closeAddModal();
        this.loadCargos();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao criar cargo',
          life: 5000
        });
        this.notificacao.erroGenerico('Falha ao criar cargo.');
        this.isSaving = false;
      }
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
