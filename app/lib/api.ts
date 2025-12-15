// Servicio base para todas las llamadas a la API REST
const API_BASE_URL = 'http://localhost:8080';

export interface ApiError {
  message: string;
  status: number;
}

// Función para obtener el token JWT del localStorage
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Función para guardar el token JWT
export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
};

// Función para eliminar el token
export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
};

// Función genérica para hacer peticiones a la API
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error: ApiError = {
      message: response.statusText,
      status: response.status,
    };

    try {
      const errorData = await response.json();
      error.message = errorData.message || errorData.error || response.statusText;
      // Log del error completo para debugging
      if (import.meta.env.DEV) {
        console.error('API Error:', { endpoint, status: response.status, error: errorData });
      }
    } catch {
      // Si no se puede parsear el JSON, usar el mensaje por defecto
    }

    throw error;
  }

  // Si la respuesta está vacía (status 204, etc.)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T;
  }

  let data = await response.json();
  
  // Log para debugging (solo en desarrollo)
  if (import.meta.env.DEV) {
    console.log('API Response:', { endpoint, status: response.status, data });
  }
  
  // Si la respuesta está envuelta en un objeto 'data', extraerlo
  if (data && typeof data === 'object' && 'data' in data && !Array.isArray(data)) {
    data = data.data;
  }
  
  return data;
}

// Métodos HTTP específicos
export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, data?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  put: <T>(endpoint: string, data?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  patch: <T>(endpoint: string, data?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
  delete: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' }),
};
