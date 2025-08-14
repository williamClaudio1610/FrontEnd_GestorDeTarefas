// Configuração da API
export const API_CONFIG = {
  // Base URL da API (ajuste conforme seu ambiente)
  BASE_URL: 'http://localhost:3000/api/v1',
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // Timeout para requisições
  TIMEOUT: 30000,
  
  // Endpoints base
  ENDPOINTS: {
    AUTH: '/auth',
    USUARIOS: '/usuarios',
    CARGOS: '/cargos',
    TAREFAS: '/tarefas',
    PROJECTOS: '/projectos',
    EQUIPES: '/equipes',
  }
};

// Função para construir URL completa
export function buildApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Função para obter headers com token de autenticação
export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  return {
    ...API_CONFIG.DEFAULT_HEADERS,
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}
