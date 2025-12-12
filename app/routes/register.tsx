import { useNavigate } from 'react-router';
import { useAuth } from '~/contexts/AuthContext';
import { MainLayout } from '~/components/templates';
import { RegisterForm } from '~/components/organisms';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (nombre: string, correo: string, contrasena: string, telefono?: string) => {
    await register(nombre, correo, contrasena, telefono);
    navigate('/');
  };

  return (
    <MainLayout>
      <RegisterForm onSubmit={handleRegister} />
    </MainLayout>
  );
}
