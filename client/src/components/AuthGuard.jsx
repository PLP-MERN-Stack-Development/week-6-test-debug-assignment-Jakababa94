import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/api';

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();

  useEffect(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const result = await authService.validateToken(token);
        if (!result.valid) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        navigate('/login');
      }
   checkAuth();
   // Listen for logout events
    const handleUserLogout = () => {
      navigate('/login');
    };

    window.addEventListener('userLoggedOut', handleUserLogout);

    return () => {
      window.removeEventListener('userLoggedOut', handleUserLogout);
    };
  }, [navigate]);

  return children;
};

export default AuthGuard; 