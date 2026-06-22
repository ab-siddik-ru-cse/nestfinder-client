import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '@/lib/api';
import { withAuth } from '@/lib/withAuth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Spinner from '@/components/ui/Spinner';
import { FiDollarSign, FiHome, FiBookOpen, FiTrendingUp } from 'react-icons/fi';

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="card p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl font-display font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </motion.div>
  );
}

function OwnerAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/owner/analytics')
      .then((r) => setData(r.data))
      .catch(() => setError('Failed to load analytics.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><div className="flex justify-center py-20"><Spinner size="lg" /></div></DashboardLayout>;
  if (error) return <DashboardLayout><div className="text-center py-20 text-red-500">{error}</div></DashboardLayout>;

  const monthly = data?.monthlyEarnings || [];

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Owner Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your property portfolio performance.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FiDollarSign} label="Total Earnings" value={`৳${(data?.totalEarnings || 0).toLocaleString()}`} color="bg-green-100 text-green-600" delay={0} />
        <StatCard icon={FiHome} label="Total Properties" value={data?.totalProperties || 0} color="bg-brand-100 text-brand-600" delay={0.05} />
        <StatCard icon={FiBookOpen} label="Total Bookings" value={data?.totalBookings || 0} color="bg-purple-100 text-purple-600" delay={0.1} />
        <StatCard icon={FiTrendingUp} label="Approved Bookings" value={data?.approvedBookings || 0} color="bg-orange-100 text-orange-600" delay={0.15} />
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Monthly Earnings (Last 12 Months)</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}
                formatter={(value) => [`৳${value.toLocaleString()}`, 'Earnings']}
              />
              <Line type="monotone" dataKey="earnings" stroke="#007bc7" strokeWidth={3} dot={{ r: 4, fill: '#007bc7' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

export default withAuth(OwnerAnalytics, ['Owner']);
