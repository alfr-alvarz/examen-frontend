import { useState } from 'react';
import { Link } from 'react-router';
import { Button, Input, Alert } from '../atoms';
import { FormField } from '../molecules';

interface LoginFormProps {
  onSubmit: (correo: string, contrasena: string) => Promise<void>;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  // Función para traducir mensajes de error comunes del backend al español
  const traducirError = (mensaje: string): string => {
    const traducciones: Record<string, string> = {
      'must be a valid email': 'Debe ser un correo electrónico válido',
      'must be an email': 'Debe ser un correo electrónico válido',
      'email must be an email': 'El correo electrónico debe ser válido',
      'correo must be an email': 'El correo debe ser un correo electrónico válido',
      'correo must be a valid email': 'El correo debe ser un correo electrónico válido',
      'invalid email': 'Correo electrónico inválido',
      'email is required': 'El correo electrónico es requerido',
      'correo is required': 'El correo es requerido',
      'password is required': 'La contraseña es requerida',
      'contrasena is required': 'La contraseña es requerida',
      'invalid credentials': 'Credenciales inválidas',
      'unauthorized': 'Credenciales inválidas',
      'user not found': 'Usuario no encontrado',
      'incorrect password': 'Contraseña incorrecta',
    };

    // Buscar traducción exacta
    if (traducciones[mensaje.toLowerCase()]) {
      return traducciones[mensaje.toLowerCase()];
    }

    // Buscar si el mensaje contiene alguna de las frases clave
    for (const [key, value] of Object.entries(traducciones)) {
      if (mensaje.toLowerCase().includes(key)) {
        return value;
      }
    }

    return mensaje; // Devolver el mensaje original si no hay traducción
  };

  const validarCorreo = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar correo en el frontend antes de enviar
    if (correo && !validarCorreo(correo)) {
      setError('Por favor, ingresa un correo electrónico válido');
      return;
    }

    if (!correo) {
      setError('El correo electrónico es requerido');
      return;
    }

    if (!contrasena) {
      setError('La contraseña es requerida');
      return;
    }

    try {
      await onSubmit(correo, contrasena);
    } catch (err: any) {
      const mensajeError = err.message || 'Error al iniciar sesión';
      setError(traducirError(mensajeError));
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Iniciar Sesión</h2>
      {error && <Alert variant="error" className="mb-4">{error}</Alert>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Correo Electrónico" required htmlFor="correo">
          <Input
            id="correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </FormField>
        <FormField label="Contraseña" required htmlFor="contrasena">
          <Input
            id="contrasena"
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </FormField>
        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="text-blue-600 hover:text-blue-700">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}
