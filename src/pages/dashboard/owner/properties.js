import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { withAuth } from '@/lib/withAuth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import RejectionFeedbackModal from '@/components/property/RejectionFeedbackModal';
import { FiEye, FiEdit2, FiTrash2, FiPlusCircle, FiInbox } from 'react-icons/fi';

const FALLBACK = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&q=80';

function MyProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedbackModal, setFeedbackModal] = useState({ open: false, property: null });

  useEffect(() => { fetchProperties(); }, []);

  const fetchProperties = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/api/properties/owner/mine');
      setProperties(data.properties || []);
    } catch {
      setError('Failed to load your properties.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
      await api.delete(`/api/properties/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id));
      toast.success('Property deleted');
    } catch {
      toast.error('Failed to delete property');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold text-gray-900">My Properties</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your property listings.</p>
        </motion.div>
        <Link href="/dashboard/owner/add-property" className="btn-primary flex items-center gap-2 text-sm">
          <FiPlusCircle className="w-4 h-4" /> Add Property
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : properties.length === 0 ? (
        <div className="card text-center py-20">
          <FiInbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-700">No properties listed yet</h3>
          <p className="text-gray-400 text-sm mt-1 mb-4">Start by adding your first property.</p>
          <Link href="/dashboard/owner/add-property" className="btn-primary inline-flex">Add Property</Link>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Property</th>
                <th className="px-5 py-3 font-medium">Rent</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {properties.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0] || FALLBACK} alt="" className="w-14 h-14 rounded-lg object-cover" onError={(e) => { e.target.src = FALLBACK; }} />
                      <div>
                        <div className="font-medium text-gray-800 line-clamp-1">{p.title}</div>
                        <div className="text-xs text-gray-400">{p.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-700 font-medium">৳{p.rent?.toLocaleString()}/{p.rentType}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Badge status={p.status} />
                      {p.status === 'Rejected' && (
                        <button onClick={() => setFeedbackModal({ open: true, property: p })} className="text-red-500 hover:text-red-700">
                          <FiEye className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/property/${p._id}`} className="p-2 rounded-lg hover:bg-brand-50 text-brand-600"><FiEye className="w-4 h-4" /></Link>
                      <Link href={`/dashboard/owner/edit-property/${p._id}`} className="p-2 rounded-lg hover:bg-amber-50 text-amber-600"><FiEdit2 className="w-4 h-4" /></Link>
                      <button onClick={() => handleDelete(p._id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500"><FiTrash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RejectionFeedbackModal
        isOpen={feedbackModal.open}
        onClose={() => setFeedbackModal({ open: false, property: null })}
        feedback={feedbackModal.property?.rejectionFeedback}
        propertyTitle={feedbackModal.property?.title}
      />
    </DashboardLayout>
  );
}

export default withAuth(MyProperties, ['Owner']);
