import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService, DadosConsolidadosUsuario } from '../../../../Servicos/usuario.service';

@Component({
  selector: 'app-user-equipes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-equipes.html',
  styleUrl: './user-equipes.css'
})
export class UserEquipesComponent implements OnInit {
  equipes: DadosConsolidadosUsuario['equipes'] = [];
  loading = true;
  error = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.carregarEquipes();
  }

  carregarEquipes(): void {
    this.loading = true;
    
    this.usuarioService.getDadosConsolidados().subscribe({
      next: (response) => {
        if (response.success) {
          this.equipes = response.data.equipes;
        } else {
          this.error = response.message || 'Erro ao carregar equipes';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao conectar com o servidor';
        this.loading = false;
        console.error('Erro ao carregar equipes:', err);
      }
    });
  }
}
