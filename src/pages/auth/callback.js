import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/ui/Spinner';

// better-auth Google OAuth redirects here with token & user as query params (or a session cookie).
export default function AuthCallback() {
  const router = useRouter();
  const { updateUser } = useAuth();

  useEffect(() => {
    if (!router.isReady) return;
    const { token, name, email, role, photo, id } = router.query;
    if (token) {
      localStorage.setItem('rental_token', token);
      const user = { _id: id, name, email, role, photo };
      localStorage.setItem('rental_user', JSON.stringify(user));
      updateUser(user);
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  );
}
