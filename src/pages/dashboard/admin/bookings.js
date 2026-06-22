import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { withAuth } from '@/lib/withAuth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import { FiInbox } from 'react-icons/fi';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  useEffect(() => { fetchBookings(1); }, []);

  const fetchBookings = async (page) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/api/bookings/admin/all?page=${page}&limit=10`);
      setBookings(data.bookings || []);
      setPagination({ page: data.page || 1, totalPages: data.totalPages || 1 });
    } catch {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">All Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">Platform-wide booking activity.</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="card text-center py-20"><FiInbox className="w-12 h-12 text-gray-300 mx-auto mb-3" /><h3 className="font-semibold text-gray-700">No bookings found</h3></div>
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-5 py-3 font-medium">Tenant</th>
                  <th className="px-5 py-3 font-medium">Property</th>
                  <th className="px-5 py-3 font-medium">Owner</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3 font-medium text-gray-800">{b.tenant?.name}</td>
                    <td className="px-5 py-3 text-gray-600 line-clamp-1">{b.property?.title}</td>
                    <td className="px-5 py-3 text-gray-600">{b.property?.owner?.name}</td>
                    <td className="px-5 py-3 text-gray-700 font-medium">৳{b.amountPaid?.toLocaleString() || 0}</td>
                    <td className="px-5 py-3"><Badge status={b.status} /></td>
                    <td className="px-5 py-3"><Badge status={b.paymentStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={fetchBookings} />
        </>
      )}
    </DashboardLayout>
  );
}

export default withAuth(AdminBookings, ['Admin']);
