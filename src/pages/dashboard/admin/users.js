import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { withAuth } from '@/lib/withAuth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Spinner from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import { FiInbox, FiUser } from 'react-icons/fi';

const ROLES = ['Tenant', 'Owner', 'Admin'];

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  useEffect(() => { fetchUsers(1); }, []);

  const fetchUsers = async (page) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/api/users?page=${page}&limit=10`);
      setUsers(data.users || []);
      setPagination({ page: data.page || 1, totalPages: data.totalPages || 1 });
    } catch {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (id, role) => {
    try {
      await api.patch(`/api/users/${id}/role`, { role });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">All Users</h1>
        <p className="text-gray-500 text-sm mt-1">Manage user accounts and roles.</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : users.length === 0 ? (
        <div className="card text-center py-20"><FiInbox className="w-12 h-12 text-gray-300 mx-auto mb-3" /><h3 className="font-semibold text-gray-700">No users found</h3></div>
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {u.photo ? (
                          <img src={u.photo} alt={u.name} className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center"><FiUser className="text-brand-600 w-4 h-4" /></div>
                        )}
                        <span className="font-medium text-gray-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{u.email}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u._id, e.target.value)}
                        className="input-field py-1.5 text-xs w-32"
                      >
                        {ROLES.map((r) => <option key={r}>{r}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={fetchUsers} />
        </>
      )}
    </DashboardLayout>
  );
}

export default withAuth(AdminUsers, ['Admin']);
