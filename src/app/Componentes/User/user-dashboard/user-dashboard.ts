import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
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
}
