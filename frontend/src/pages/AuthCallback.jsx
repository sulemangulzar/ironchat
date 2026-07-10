import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    
    if (accessToken) {
      login(accessToken);
      navigate('/chat');
    } else {
      navigate('/login');
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="auth-callback">
      <div className="spinner"></div>
      <p>Logging you in...</p>
    </div>
  );
};

export default AuthCallback;
