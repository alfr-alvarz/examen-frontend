import { useState } from 'react';
import { Link } from 'react-router';
import { Button, Input, Alert } from '../atoms';
import { FormField } from '../molecules';

interface RegisterFormProps {
  onSubmit: (nombre: string, correo: string, contrasena: string, telefono?: string) => Promise<void>;
  isLoading?: boolean;
}

export function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [telefono, setTelefono] = useState('');
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
      'nombre is required': 'El nombre es requerido',
      'password is required': 'La contraseña es requerida',
      'contrasena is required': 'La contraseña es requerida',
      'password must be longer than or equal to': 'La contraseña debe tener al menos',
      'password too short': 'La contraseña es muy corta',
      'email already exists': 'Este correo electrónico ya está registrado',
      'user already exists': 'Este usuario ya existe',
      'invalid credentials': 'Credenciales inválidas',
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

    // Validaciones en el frontend
    if (!nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (!correo) {
      setError('El correo electrónico es requerido');
      return;
    }

    if (correo && !validarCorreo(correo)) {
      setError('Por favor, ingresa un correo electrónico válido');
      return;
    }

    if (!contrasena) {
      setError('La contraseña es requerida');
      return;
    }

    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await onSubmit(nombre, correo, contrasena, telefono || undefined);
    } catch (err: any) {
      const mensajeError = err.message || 'Error al registrarse';
      setError(traducirError(mensajeError));
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-xl shadow-xl p-8 border border-slate-700/50 backdrop-blur-sm">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Registrarse</h2>
      {error && <Alert variant="error" className="mb-4">{error}</Alert>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Nombre Completo" required htmlFor="nombre">
          <Input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </FormField>
        <FormField label="Correo Electrónico" required htmlFor="correo">
          <Input
            id="correo"
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </FormField>
        <FormField label="Teléfono (Opcional)" htmlFor="telefono">
          <Input
            id="telefono"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </FormField>
        <FormField label="Contraseña" required htmlFor="contrasena">
          <Input
            id="contrasena"
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
            minLength={6}
          />
        </FormField>
        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-400">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
}
