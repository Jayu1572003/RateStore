import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === UserRole.ADMIN) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === UserRole.STORE_OWNER) {
      return <Navigate to="/owner/dashboard" replace />;
    } else {
      return <Navigate to="/stores" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
