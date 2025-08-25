export const environment = {
  production: true,
  apiUrl: 'https://api.gestorescolar.com/api/v1', // URL de produção
  appName: 'Gestor Escolar',
  version: '1.0.0',
  defaultLanguage: 'pt-BR',
  supportedLanguages: ['pt-BR', 'en-US'],
  theme: {
    default: 'light',
    available: ['light', 'dark']
  },
  auth: {
    tokenKey: 'auth_token',
    userKey: 'currentUser',
    refreshTokenKey: 'refresh_token',
    tokenExpiry: 3600, // 1 hora em segundos
    refreshTokenExpiry: 86400 // 24 horas em segundos
  },
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50, 100]
  },
  notifications: {
    defaultDuration: 5000,
    maxVisible: 5
  }
};
