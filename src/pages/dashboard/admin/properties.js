import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { withAuth } from '@/lib/withAuth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import Modal from '@/components/ui/Modal';
import { FiCheck, FiX, FiTrash2, FiInbox, FiEye } from 'react-icons/fi';

const FALLBACK = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&q=80';

function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [rejectModal, setRejectModal] = useState({ open: false, property: null });
  const [feedback, setFeedback] = useState('');
  const [acting, setActing] = useState(false);

  useEffect(() => { fetchProperties(1); }, []);

  const fetchProperties = async (page) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/api/properties/admin/all?page=${page}&limit=10`);
      setProperties(data.properties || []);
      setPagination({ page: data.page || 1, totalPages: data.totalPages || 1 });
    } catch {
      setError('Failed to load properties.');
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    try {
      await api.patch(`/api/properties/${id}/approve`);
      setProperties((prev) => prev.map((p) => (p._id === id ? { ...p, status: 'Approved' } : p)));
      toast.success('Property approved');
    } catch {
      toast.error('Action failed');
    }
  };

  const submitReject = async () => {
    if (!feedback.trim()) { toast.error('Feedback is required to reject a property'); return; }
    setActing(true);
    try {
      await api.patch(`/api/properties/${rejectModal.property._id}/reject`, { rejectionFeedback: feedback });
      setProperties((prev) => prev.map((p) => (p._id === rejectModal.property._id ? { ...p, status: 'Rejected', rejectionFeedback: feedback } : p)));
      toast.success('Property rejected');
      setRejectModal({ open: false, property: null });
      setFeedback('');
    } catch {
      toast.error('Action failed');
    } finally {
      setActing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this property permanently?')) return;
    try {
      await api.delete(`/api/properties/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id));
      toast.success('Property deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">All Properties</h1>
        <p className="text-gray-500 text-sm mt-1">Review, approve, or reject property listings.</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : properties.length === 0 ? (
        <div className="card text-center py-20"><FiInbox className="w-12 h-12 text-gray-300 mx-auto mb-3" /><h3 className="font-semibold text-gray-700">No properties found</h3></div>
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-5 py-3 font-medium">Property</th>
                  <th className="px-5 py-3 font-medium">Owner</th>
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
                        <img src={p.images?.[0] || FALLBACK} alt="" className="w-12 h-12 rounded-lg object-cover" onError={(e) => { e.target.src = FALLBACK; }} />
                        <div>
                          <div className="font-medium text-gray-800 line-clamp-1">{p.title}</div>
                          <div className="text-xs text-gray-400">{p.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{p.owner?.name}</td>
                    <td className="px-5 py-3 text-gray-700 font-medium">৳{p.rent?.toLocaleString()}</td>
                    <td className="px-5 py-3"><Badge status={p.status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <a href={`/property/${p._id}`} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-brand-50 text-brand-600"><FiEye className="w-4 h-4" /></a>
                        {p.status !== 'Approved' && (
                          <button onClick={() => approve(p._id)} className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-600"><FiCheck className="w-4 h-4" /></button>
                        )}
                        {p.status !== 'Rejected' && (
                          <button onClick={() => setRejectModal({ open: true, property: p })} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500"><FiX className="w-4 h-4" /></button>
                        )}
                        <button onClick={() => handleDelete(p._id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><FiTrash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={fetchProperties} />
        </>
      )}

      <Modal isOpen={rejectModal.open} onClose={() => setRejectModal({ open: false, property: null })} title="Reject Property" size="sm">
        <p className="text-sm text-gray-600 mb-3">Provide feedback explaining why <strong>{rejectModal.property?.title}</strong> is being rejected. This will be shown to the owner.</p>
        <textarea
          rows={4} className="input-field resize-none mb-4" placeholder="e.g. Images are unclear, please re-upload..."
          value={feedback} onChange={(e) => setFeedback(e.target.value)}
        />
        <button onClick={submitReject} disabled={acting} className="btn-danger w-full py-2.5 disabled:opacity-60">
          {acting ? 'Rejecting...' : 'Confirm Rejection'}
        </button>
      </Modal>
    </DashboardLayout>
  );
}

export default withAuth(AdminProperties, ['Admin']);
