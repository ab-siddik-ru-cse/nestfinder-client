import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('rental_user');
    const token = localStorage.getItem('rental_token');

    if (storedUser && token) {
      // Trust the cached user immediately — this is what role-based routing
      // uses, and it must resolve synchronously on load so pages don't hang
      // on a spinner or bounce between routes while waiting on the network.
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('rental_user');
        localStorage.removeItem('rental_token');
      }
    }
    // `loading` always settles here, regardless of network state — nothing
    // below this line should ever block first paint or routing decisions.
    setLoading(false);

    if (storedUser && token) {
      // Best-effort background refresh: if the server has a different
      // (e.g. newly-changed) role or the token is no longer valid, update
      // silently. This never re-triggers `loading`, so it cannot cause
      // redirect flicker — it only corrects `user` after the fact.
      api
        .get('/api/auth/me')
        .then(({ data }) => {
          setUser(data.user);
          localStorage.setItem('rental_user', JSON.stringify(data.user));
        })
        .catch(() => {
          // Network/auth error on the background check — leave the cached
          // session as-is rather than forcing a logout, so a flaky network
          // or backend restart doesn't kick the user out mid-session.
        });
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('rental_token', data.token);
    localStorage.setItem('rental_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (formData) => {
    const { data } = await api.post('/api/auth/register', formData);
    localStorage.setItem('rental_token', data.token);
    localStorage.setItem('rental_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('rental_token');
    localStorage.removeItem('rental_user');
    setUser(null);
    router.push('/');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('rental_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
