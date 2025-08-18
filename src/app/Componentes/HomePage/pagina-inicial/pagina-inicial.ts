import { Component, OnInit, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

@Component({
  selector: 'app-pagina-inicial',
  standalone: true,
  imports: [CommonModule, RouterModule, Footer, Header],
  templateUrl: './pagina-inicial.html',
  styleUrl: './pagina-inicial.css'
})
export class PaginaInicial implements OnInit, AfterViewInit, OnDestroy {
  // Imagens para o carousel
  carouselImages: string[] = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  ];

  currentSlide = 0;
  private intervalId: any;

  services = [
    {
      icon: 'pi pi-users',
      title: 'Gestão de Equipa',
      desc: 'Organize e coordene sua equipe de forma eficiente com ferramentas colaborativas.',
    },
    {
      icon: 'pi pi-calendar',
      title: 'Agendamento Inteligente',
      desc: 'Planeje e organize suas tarefas com um sistema de calendário intuitivo.',
    },
    {
      icon: 'pi pi-chart-line',
      title: 'Relatórios Avançados',
      desc: 'Acompanhe o progresso com métricas detalhadas e análises em tempo real.',
    },
    {
      icon: 'pi pi-mobile',
      title: 'Acesso Multiplataforma',
      desc: 'Acesse suas tarefas de qualquer dispositivo, sempre sincronizado.',
    }
  ];

  funcionalidades = [
    {
      titulo: 'Kanban Board Avançado',
      descricao: 'Visualize e organize suas tarefas com quadros Kanban intuitivos e personalizáveis.',
      imagem: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
      alt: 'Quadro Kanban',
      badges: ['Drag & Drop', 'Personalizável', 'Colaborativo']
    },
    {
      titulo: 'Time Tracking Inteligente',
      descricao: 'Controle o tempo gasto em cada tarefa e projeto com relatórios detalhados.',
      imagem: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      alt: 'Controle de tempo',
      badges: ['Relatórios', 'Análises', 'Produtividade']
    },
    {
      titulo: 'Gestão de Projetos',
      descricao: 'Planeje, execute e acompanhe projetos com ferramentas profissionais integradas.',
      imagem: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      alt: 'Gestão de projetos',
      badges: ['Planejamento', 'Execução', 'Monitoramento']
    },
    {
      titulo: 'Integrações e API',
      descricao: 'Conecte com suas ferramentas favoritas e automatize fluxos de trabalho.',
      imagem: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
      alt: 'Integrações',
      badges: ['API REST', 'Webhooks', 'Automação']
    }
  ];

  demoFeatures = [
    'Interface intuitiva e responsiva',
    'Sincronização em tempo real',
    'Backup automático na nuvem',
    'Suporte técnico 24/7',
    'Atualizações regulares',
    'Integração com ferramentas populares'
  ];

  ngOnInit() {
    // Inicialização do componente
  }

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startCarousel();
    }
  }

  startCarousel() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.carouselImages.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  updateCarousel() {
    // Atualiza o carousel
  }

  criarNovaTarefa() {
    // Lógica para criar nova tarefa
    console.log('Criando nova tarefa...');
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
