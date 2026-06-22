import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/ui/Spinner';

const VALID_ROLES = ['Tenant', 'Owner', 'Admin'];

export function withAuth(Component, allowedRoles = []) {
  return function ProtectedRoute(props) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (loading) return; // wait until auth state settles

      if (!user) {
        router.replace(`/login?redirect=${encodeURIComponent(router.asPath)}`);
        return;
      }

      // A user with no role, or a role outside the known set, can never
      // satisfy any `allowedRoles` check and can never be correctly routed
      // by /dashboard either — sending them to /dashboard would just bounce
      // straight back here. Break the cycle by logging out instead.
      if (!VALID_ROLES.includes(user.role)) {
        console.error(`withAuth: invalid user role "${user.role}" — logging out to avoid a redirect loop.`);
        logout();
        return;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        router.replace('/dashboard');
      }
      // Only re-run when loading finishes or the user/role actually changes —
      // NOT on every `router` object identity change.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, user?._id, user?.role]);

    if (loading) return <div className="flex items-center justify-center h-screen"><Spinner /></div>;
    if (!user) return null;
    if (!VALID_ROLES.includes(user.role)) return null;
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return <div className="flex items-center justify-center h-screen"><Spinner /></div>;
    }

    return <Component {...props} />;
  };
}
