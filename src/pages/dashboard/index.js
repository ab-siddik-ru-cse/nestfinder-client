import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { withAuth } from '@/lib/withAuth';
import Spinner from '@/components/ui/Spinner';

const VALID_ROLES = ['Tenant', 'Owner', 'Admin'];

function DashboardIndex() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    // If the role is missing or not one of the three known values, we can't
    // safely route anywhere — guessing "Tenant" here is what previously
    // caused an infinite bounce against pages that require a specific role
    // (since `withAuth` would reject the guess and send the user right back
    // to /dashboard). Log out instead and surface the problem clearly.
    if (!VALID_ROLES.includes(user.role)) {
      console.error(`Invalid or missing user role: "${user.role}". Logging out.`);
      logout();
      return;
    }

    if (user.role === 'Admin') router.replace('/dashboard/admin/users');
    else if (user.role === 'Owner') router.replace('/dashboard/owner');
    else router.replace('/dashboard/tenant/bookings');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, user?.role]);

  return <div className="flex items-center justify-center min-h-screen"><Spinner size="lg" /></div>;
}

export default withAuth(DashboardIndex);
