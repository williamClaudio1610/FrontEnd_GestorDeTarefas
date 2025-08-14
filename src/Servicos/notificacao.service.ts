import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notificacao {
  id: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
  titulo: string;
  mensagem: string;
  timestamp: Date;
  lida: boolean;
  acao?: () => void;
  duracao?: number; // em milissegundos, undefined = não expira
}

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {
  private notificacoesSubject = new BehaviorSubject<Notificacao[]>([]);
  public notificacoes$ = this.notificacoesSubject.asObservable();

  constructor() { }

  /**
   * Adicionar notificação de sucesso
   */
  sucesso(titulo: string, mensagem: string, duracao?: number): string {
    return this.adicionar({
      tipo: 'success',
      titulo,
      mensagem,
      duracao
    });
  }

  /**
   * Adicionar notificação de erro
   */
  erro(titulo: string, mensagem: string, duracao?: number): string {
    return this.adicionar({
      tipo: 'error',
      titulo,
      mensagem,
      duracao
    });
  }

  /**
   * Adicionar notificação de aviso
   */
  aviso(titulo: string, mensagem: string, duracao?: number): string {
    return this.adicionar({
      tipo: 'warning',
      titulo,
      mensagem,
      duracao
    });
  }

  /**
   * Adicionar notificação informativa
   */
  info(titulo: string, mensagem: string, duracao?: number): string {
    return this.adicionar({
      tipo: 'info',
      titulo,
      mensagem,
      duracao
    });
  }

  /**
   * Adicionar notificação personalizada
   */
  adicionar(notificacao: Partial<Notificacao>): string {
    const novaNotificacao: Notificacao = {
      id: this.gerarId(),
      tipo: 'info',
      titulo: '',
      mensagem: '',
      timestamp: new Date(),
      lida: false,
      ...notificacao
    };

    const notificacoes = [...this.notificacoesSubject.value, novaNotificacao];
    this.notificacoesSubject.next(notificacoes);

    // Configurar expiração automática se especificado
    if (novaNotificacao.duracao) {
      setTimeout(() => {
        this.remover(novaNotificacao.id);
      }, novaNotificacao.duracao);
    }

    return novaNotificacao.id;
  }

  /**
   * Remover notificação por ID
   */
  remover(id: string): void {
    const notificacoes = this.notificacoesSubject.value.filter(n => n.id !== id);
    this.notificacoesSubject.next(notificacoes);
  }

  /**
   * Marcar notificação como lida
   */
  marcarComoLida(id: string): void {
    const notificacoes = this.notificacoesSubject.value.map(n => 
      n.id === id ? { ...n, lida: true } : n
    );
    this.notificacoesSubject.next(notificacoes);
  }

  /**
   * Marcar todas as notificações como lidas
   */
  marcarTodasComoLidas(): void {
    const notificacoes = this.notificacoesSubject.value.map(n => ({ ...n, lida: true }));
    this.notificacoesSubject.next(notificacoes);
  }

  /**
   * Limpar todas as notificações
   */
  limpar(): void {
    this.notificacoesSubject.next([]);
  }

  /**
   * Obter notificações não lidas
   */
  getNotificacoesNaoLidas(): Observable<Notificacao[]> {
    return new Observable(observer => {
      this.notificacoes$.subscribe(notificacoes => {
        const naoLidas = notificacoes.filter(n => !n.lida);
        observer.next(naoLidas);
      });
    });
  }

  /**
   * Obter contagem de notificações não lidas
   */
  getContagemNaoLidas(): Observable<number> {
    return new Observable(observer => {
      this.notificacoes$.subscribe(notificacoes => {
        const contagem = notificacoes.filter(n => !n.lida).length;
        observer.next(contagem);
      });
    });
  }

  /**
   * Executar ação da notificação
   */
  executarAcao(id: string): void {
    const notificacao = this.notificacoesSubject.value.find(n => n.id === id);
    if (notificacao?.acao) {
      notificacao.acao();
    }
  }

  /**
   * Gerar ID único para notificação
   */
  private gerarId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Notificação de tarefa criada
   */
  tarefaCriada(titulo: string): string {
    return this.sucesso(
      'Tarefa Criada',
      `A tarefa "${titulo}" foi criada com sucesso.`,
      5000
    );
  }

  /**
   * Notificação de tarefa atualizada
   */
  tarefaAtualizada(titulo: string): string {
    return this.sucesso(
      'Tarefa Atualizada',
      `A tarefa "${titulo}" foi atualizada com sucesso.`,
      5000
    );
  }

  /**
   * Notificação de tarefa concluída
   */
  tarefaConcluida(titulo: string): string {
    return this.sucesso(
      'Tarefa Concluída',
      `A tarefa "${titulo}" foi marcada como concluída.`,
      5000
    );
  }

  /**
   * Notificação de projeto criado
   */
  projectoCriado(nome: string): string {
    return this.sucesso(
      'Projeto Criado',
      `O projeto "${nome}" foi criado com sucesso.`,
      5000
    );
  }

  /**
   * Notificação de equipe criada
   */
  equipeCriada(nome: string): string {
    return this.sucesso(
      'Equipe Criada',
      `A equipe "${nome}" foi criada com sucesso.`,
      5000
    );
  }

  /**
   * Notificação de usuário adicionado à equipe
   */
  usuarioAdicionadoEquipe(nomeUsuario: string, nomeEquipe: string): string {
    return this.info(
      'Usuário Adicionado',
      `${nomeUsuario} foi adicionado à equipe ${nomeEquipe}.`,
      5000
    );
  }

  /**
   * Notificação de erro genérico
   */
  erroGenerico(mensagem: string = 'Ocorreu um erro inesperado. Tente novamente.'): string {
    return this.erro('Erro', mensagem, 8000);
  }

  /**
   * Notificação de erro de validação
   */
  erroValidacao(mensagem: string): string {
    return this.erro('Erro de Validação', mensagem, 8000);
  }

  /**
   * Notificação de erro de conexão
   */
  erroConexao(): string {
    return this.erro(
      'Erro de Conexão',
      'Não foi possível conectar ao servidor. Verifique sua conexão.',
      10000
    );
  }
}
