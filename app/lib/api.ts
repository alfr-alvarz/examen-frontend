const API_BASE_URL = 'http://localhost:8080';

export interface ApiError {
  message: string;
  status: number;
}

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
};

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
    if (response.status === 401) {
      removeToken();
    }

    const error: ApiError = {
      message: response.statusText,
      status: response.status,
    };

    try {
      const errorData = await response.json();
      error.message = errorData.message || errorData.error || response.statusText;
      if (import.meta.env.DEV) {
        console.error('API Error:', { endpoint, status: response.status, error: errorData });
      }
    } catch {
    }

    throw error;
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T;
  }

  let data = await response.json();
  
  if (import.meta.env.DEV) {
    console.log('API Response:', { endpoint, status: response.status, data });
  }
  
  if (data && typeof data === 'object' && 'data' in data && !Array.isArray(data)) {
    data = data.data;
  }
  
  return data;
}

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
