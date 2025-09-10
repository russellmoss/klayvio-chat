'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'manager' | 'analyst' | 'viewer';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
        return;
      }

      if (requiredRole && profile) {
        const userRole = profile.role;
        const roleHierarchy = {
          viewer: 0,
          analyst: 1,
          manager: 2,
          admin: 3,
        };

        if (roleHierarchy[userRole] < roleHierarchy[requiredRole]) {
          router.push('/dashboard');
          return;
        }
      }
    }
  }, [user, profile, loading, requiredRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (requiredRole && profile) {
    const userRole = profile.role;
    const roleHierarchy = {
      viewer: 0,
      analyst: 1,
      manager: 2,
      admin: 3,
    };

    if (roleHierarchy[userRole] < roleHierarchy[requiredRole]) {
      return null; // Will redirect to dashboard
    }
  }

  return <>{children}</>;
}
