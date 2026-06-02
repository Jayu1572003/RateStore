import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth, UserRole } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUserList from './pages/admin/AdminUserList';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AdminStoreList from './pages/admin/AdminStoreList';
import AdminAddUser from './pages/admin/AdminAddUser';
import UserStoreList from './pages/UserStoreList';
import OwnerDashboard from './pages/owner/OwnerDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === UserRole.ADMIN) return <Navigate to="/admin/dashboard" replace />;
  if (user.role === UserRole.STORE_OWNER) return <Navigate to="/owner/dashboard" replace />;
  return <Navigate to="/stores" replace />;
};

const AppContent = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomeRedirect />} />
        
        {/* Admin Only */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminUserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminUserDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/new"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminAddUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stores"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminStoreList />
            </ProtectedRoute>
          }
        />

        {/* Normal User Only */}
        <Route
          path="/stores"
          element={
            <ProtectedRoute allowedRoles={[UserRole.NORMAL_USER]}>
              <UserStoreList />
            </ProtectedRoute>
          }
        />

        {/* Store Owner Only */}
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute allowedRoles={[UserRole.STORE_OWNER]}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Any Authenticated User */}
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
