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

    if (traducciones[mensaje.toLowerCase()]) {
      return traducciones[mensaje.toLowerCase()];
    }

    for (const [key, value] of Object.entries(traducciones)) {
      if (mensaje.toLowerCase().includes(key)) {
        return value;
      }
    }

    return mensaje;
  };

  const validarCorreo = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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
    <div className="max-w-md mx-auto bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-8 border border-slate-700/50 backdrop-blur-sm">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Iniciar Sesión</h2>
      {error && <Alert variant="error" className="mb-4">{error}</Alert>}
      <form onSubmit={handleSubmit} className="space-y-5">
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
      <p className="mt-6 text-center text-sm text-gray-400">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}
