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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await onSubmit(nombre, correo, contrasena, telefono || undefined);
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Registrarse</h2>
      {error && <Alert variant="error" className="mb-4">{error}</Alert>}
      <form onSubmit={handleSubmit} className="space-y-4">
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
      <p className="mt-4 text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-blue-600 hover:text-blue-700">
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
}
