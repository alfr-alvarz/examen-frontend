export function decodeJWT(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error al decodificar JWT:', error);
    return null;
  }
}

export function getUserFromToken(token: string | null): { id?: number; rol?: string; correo?: string } | null {
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  if (!decoded) return null;
  
  return {
    id: decoded.sub || decoded.id || decoded.userId,
    rol: decoded.rol || decoded.role,
    correo: decoded.correo || decoded.email,
  };
}

