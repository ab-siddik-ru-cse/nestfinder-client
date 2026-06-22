import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { withAuth } from '@/lib/withAuth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { FiCheck, FiX, FiInbox, FiPhone, FiCalendar } from 'react-icons/fi';

function OwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actingId, setActingId] = useState(null);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/api/bookings/owner');
      setBookings(data.bookings || []);
    } catch {
      setError('Failed to load booking requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setActingId(id);
    try {
      await api.patch(`/api/bookings/${id}/${action}`);
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: action === 'approve' ? 'Approved' : 'Rejected' } : b)));
      toast.success(`Booking ${action === 'approve' ? 'approved' : 'rejected'}`);
    } catch {
      toast.error('Action failed');
    } finally {
      setActingId(null);
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Booking Requests</h1>
        <p className="text-gray-500 text-sm mt-1">Review and respond to tenant booking requests.</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="card text-center py-20">
          <FiInbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-700">No booking requests yet</h3>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Tenant</th>
                <th className="px-5 py-3 font-medium">Property</th>
                <th className="px-5 py-3 font-medium">Move-in</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-medium text-gray-800">{b.tenant?.name}</td>
                  <td className="px-5 py-3 text-gray-600 line-clamp-1">{b.property?.title}</td>
                  <td className="px-5 py-3 text-gray-600">
                    <div className="flex items-center gap-1"><FiCalendar className="w-3.5 h-3.5 text-brand-400" /> {new Date(b.moveInDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    <div className="flex items-center gap-1"><FiPhone className="w-3.5 h-3.5 text-brand-400" /> {b.contactNumber}</div>
                  </td>
                  <td className="px-5 py-3"><Badge status={b.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {b.status === 'Pending' ? (
                        <>
                          <button disabled={actingId === b._id} onClick={() => handleAction(b._id, 'approve')} className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 disabled:opacity-50">
                            <FiCheck className="w-4 h-4" />
                          </button>
                          <button disabled={actingId === b._id} onClick={() => handleAction(b._id, 'reject')} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 disabled:opacity-50">
                            <FiX className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">No action needed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}

export default withAuth(OwnerBookings, ['Owner']);
