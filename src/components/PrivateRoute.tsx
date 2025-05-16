import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import { UserRole } from '@/context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, hasPermission, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Você pode criar um componente de loading mais elaborado
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0 && !hasPermission(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;