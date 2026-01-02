import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import AuthPage from '../domains/auth/AuthPage';

interface ProtectedRouteProps {
  children?: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const isSSO = localStorage.getItem('isSsoUsed');

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isSSO) {
    return <AuthPage />;
  }

  // Support both usage styles:
  // 1) <ProtectedRoute><SomeComponent /></ProtectedRoute>
  // 2) <Route element={<ProtectedRoute />}><Route ... /></Route>
  return <>{children ?? <Outlet />}</>;
}