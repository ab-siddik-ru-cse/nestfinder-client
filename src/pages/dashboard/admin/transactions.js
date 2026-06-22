import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { withAuth } from '@/lib/withAuth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Spinner from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import { FiInbox, FiDollarSign } from 'react-icons/fi';

function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => { fetchTransactions(1); }, []);

  const fetchTransactions = async (page) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/api/transactions?page=${page}&limit=10`);
      setTransactions(data.transactions || []);
      setPagination({ page: data.page || 1, totalPages: data.totalPages || 1 });
      setTotalRevenue(data.totalRevenue || 0);
    } catch {
      setError('Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-500 text-sm mt-1">All completed payments across the platform.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-5 mb-6 max-w-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center"><FiDollarSign className="text-green-600 w-5 h-5" /></div>
          <div>
            <div className="text-xl font-display font-bold text-gray-900">৳{totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Total Platform Revenue</div>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : transactions.length === 0 ? (
        <div className="card text-center py-20"><FiInbox className="w-12 h-12 text-gray-300 mx-auto mb-3" /><h3 className="font-semibold text-gray-700">No transactions yet</h3></div>
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-5 py-3 font-medium">Transaction ID</th>
                  <th className="px-5 py-3 font-medium">Tenant</th>
                  <th className="px-5 py-3 font-medium">Owner</th>
                  <th className="px-5 py-3 font-medium">Property</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3 text-gray-500 text-xs font-mono">{t.stripeSessionId?.slice(0, 18)}...</td>
                    <td className="px-5 py-3 font-medium text-gray-800">{t.tenant?.name}</td>
                    <td className="px-5 py-3 text-gray-600">{t.owner?.name}</td>
                    <td className="px-5 py-3 text-gray-600 line-clamp-1">{t.property?.title}</td>
                    <td className="px-5 py-3 text-green-600 font-semibold">৳{t.amount?.toLocaleString()}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{new Date(t.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={fetchTransactions} />
        </>
      )}
    </DashboardLayout>
  );
}

export default withAuth(AdminTransactions, ['Admin']);
