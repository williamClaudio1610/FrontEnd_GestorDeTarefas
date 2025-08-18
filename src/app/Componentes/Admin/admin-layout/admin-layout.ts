import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SideMenuComponent } from '../side-menu/side-menu';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, SideMenuComponent],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayoutComponent {
  // Este componente serve como layout principal para todas as páginas admin
  // Ele renderiza o side-menu e o conteúdo da rota atual através do router-outlet
}
