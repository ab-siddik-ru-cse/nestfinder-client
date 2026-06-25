import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { withAuth } from '@/lib/withAuth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { FiInbox, FiMapPin, FiCalendar, FiCreditCard } from 'react-icons/fi';

function TenantBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payingId, setPayingId] = useState(null);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/api/bookings/my');
      setBookings(data.bookings || []);
    } catch {
      setError('Failed to load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async (bookingId) => {
    setPayingId(bookingId);
    try {
      const { data } = await api.post('/api/payments/create-checkout-session', { bookingId });
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Could not initiate payment. Please try again.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setPayingId(null);
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">Track the status of your property booking requests.</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="card text-center py-20">
          <FiInbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-700">No bookings yet</h3>
          <p className="text-gray-400 text-sm mt-1">Browse properties and book your first home.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Property</th>
                <th className="px-5 py-3 font-medium">Move-in</th>
                <th className="px-5 py-3 font-medium">Amount Paid</th>
                <th className="px-5 py-3 font-medium">Booking Status</th>
                <th className="px-5 py-3 font-medium">Payment</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-800">{b.property?.title || 'Property removed'}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <FiMapPin className="w-3 h-3" /> {b.property?.location}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiCalendar className="w-3.5 h-3.5 text-brand-400" />
                      {new Date(b.moveInDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-800 font-medium">
                    ৳{b.amountPaid?.toLocaleString() || 0}
                  </td>
                  <td className="px-5 py-4"><Badge status={b.status} /></td>
                  <td className="px-5 py-4"><Badge status={b.paymentStatus} /></td>
                  <td className="px-5 py-4">
                    {b.paymentStatus === 'Pending' && b.status !== 'Rejected' ? (
                      <button
                        onClick={() => handlePayNow(b._id)}
                        disabled={payingId === b._id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium disabled:opacity-60 transition-colors"
                      >
                        <FiCreditCard className="w-3.5 h-3.5" />
                        {payingId === b._id ? 'Redirecting…' : 'Pay Now'}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
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

export default withAuth(TenantBookings, ['Tenant']);
