
import { Component, HostListener, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ CommonModule, 
    RouterLink, 
    RouterLinkActive, 
    ButtonModule, 
    InputTextModule,
    MenuModule,
    TooltipModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {@ViewChild('menu') menu!: Menu;
  
  isScrolled = false;
  
  menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: '/',
      command: () => this.closeMenu()
    },
    {
      label: 'Sobre Nós',
      icon: 'pi pi-info-circle',
      routerLink: '/sobre-nos',
      command: () => this.closeMenu()
    },
    {
      label: 'Aderir Serviços',
      icon: 'pi pi-plus-circle',
      routerLink: '/aderir-servicos',
      command: () => this.closeMenu()
    },
    {
      separator: true
    },
    {
      label: 'Buscar',
      icon: 'pi pi-search',
      command: () => this.openSearch()
    },
    {
      label: 'Notificações',
      icon: 'pi pi-bell',
      badge: '3',
      command: () => this.openNotifications()
    },
    {
      separator: true
    },
    {
      label: 'Nova Tarefa',
      icon: 'pi pi-plus',
      styleClass: 'menu-primary',
      command: () => this.createNewTask()
    }
  ];

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  onToggleMenu(event: Event) {
    if (this.menu) {
      this.menu.toggle(event);
    }
  }

  closeMenu() {
    if (this.menu) {
      this.menu.hide();
    }
  }

  openSearch() {
    // Implementar lógica de busca
    console.log('Abrindo busca...');
    this.closeMenu();
  }

  openNotifications() {
    // Implementar lógica de notificações
    console.log('Abrindo notificações...');
    this.closeMenu();
  }

  createNewTask() {
    // Implementar lógica de nova tarefa
    console.log('Criando nova tarefa...');
    this.closeMenu();
  }
}