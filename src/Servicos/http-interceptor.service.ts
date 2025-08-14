import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';
import { NotificacaoService } from './notificacao.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  
  constructor(
    private authService: AuthService,
    private notificacaoService: NotificacaoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Adicionar token de autenticação apenas no browser
    if (isPlatformBrowser(this.platformId)) {
      const token = this.authService.getToken();
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error, request, next);
      })
    );
  }

  private handleError(error: HttpErrorResponse, request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (isPlatformBrowser(this.platformId)) {
      switch (error.status) {
        case 401: // Unauthorized
          // Tentar renovar token
          return this.authService.refreshToken().pipe(
            switchMap(response => {
              if (response.token) {
                // Reenviar request com novo token
                const newRequest = request.clone({
                  setHeaders: {
                    Authorization: `Bearer ${response.token}`
                  }
                });
                return next.handle(newRequest);
              } else {
                // Falha na renovação, fazer logout
                this.authService.logout();
                this.notificacaoService.erro('Sessão Expirada', 'Sua sessão expirou. Faça login novamente.');
                return throwError(() => error);
              }
            }),
            catchError(refreshError => {
              this.authService.logout();
              this.notificacaoService.erro('Erro na Renovação', 'Erro na renovação da sessão. Faça login novamente.');  
              return throwError(() => error);
            })
          );

        case 403: // Forbidden
          this.notificacaoService.erro('Acesso Negado', 'Você não tem permissão para esta ação.');
          break;

        case 404: // Not Found
          this.notificacaoService.erro('Recurso Não Encontrado', 'O recurso solicitado não foi encontrado.');
          break;

        case 500: // Internal Server Error
          this.notificacaoService.erro('Erro do Servidor', 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.');
          break;

        case 0: // Network Error
          this.notificacaoService.erroConexao();
          break;

        default:
          if (error.status >= 400 && error.status < 500) {
            this.notificacaoService.erroValidacao(error.error?.message || 'Erro de validação.');
          } else {
            this.notificacaoService.erroGenerico();
          }
          break;
      }
    }

    return throwError(() => error);
  }
}
