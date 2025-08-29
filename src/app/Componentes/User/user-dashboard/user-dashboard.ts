import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, AvatarModule, BadgeModule, ChipModule],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css'
})
export class UserDashboardComponent {
  // Dados mock para o dashboard do usuário
  userStats = {
    totalProjects: 5,
    activeTasks: 12,
    completedTasks: 8,
    teamMembers: 15
  };

  recentActivities = [
    { type: 'task', message: 'Nova tarefa atribuída: "Revisar documentação"', time: '2 horas atrás' },
    { type: 'project', message: 'Projeto "Sistema de Gestão" atualizado', time: '1 dia atrás' },
    { type: 'team', message: 'Novo membro adicionado à equipe', time: '2 dias atrás' }
  ];

  getActivityIcon(type: string): string {
    const icons: {[key: string]: string} = {
      'task': 'pi pi-list-check',
      'project': 'pi pi-briefcase',
      'team': 'pi pi-users'
    };
    return icons[type] || 'pi pi-info-circle';
  }

  getActivityLabel(type: string): string {
    const labels: {[key: string]: string} = {
      'task': 'Tarefa',
      'project': 'Projeto',
      'team': 'Equipe'
    };
    return labels[type] || 'Atividade';
  }
}
