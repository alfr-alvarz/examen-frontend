import { useNavigate } from 'react-router';
import { useAuth } from '~/contexts/AuthContext';
import { MainLayout } from '~/components/templates';
import { LoginForm } from '~/components/organisms';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (correo: string, contrasena: string) => {
    await login(correo, contrasena);
    navigate('/');
  };

  return (
    <MainLayout>
      <LoginForm onSubmit={handleLogin} />
    </MainLayout>
  );
}
