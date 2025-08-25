import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UserSidebarComponent } from '../user-sidebar/user-sidebar';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, UserSidebarComponent],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.css'
})
export class UserLayoutComponent {
  isSidebarCollapsed = false;

  onSidebarCollapsedChange(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}
