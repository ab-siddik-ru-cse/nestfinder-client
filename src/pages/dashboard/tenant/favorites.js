import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { withAuth } from '@/lib/withAuth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Spinner from '@/components/ui/Spinner';
import { FiHeart, FiTrash2, FiMapPin, FiEye } from 'react-icons/fi';

const FALLBACK = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&q=80';

function TenantFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchFavorites(); }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/api/favorites');
      setFavorites(data.favorites || []);
    } catch {
      setError('Failed to load favorites.');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId) => {
    try {
      await api.delete(`/api/favorites/${propertyId}`);
      setFavorites((prev) => prev.filter((f) => f.property?._id !== propertyId));
      toast.success('Removed from favorites');
    } catch {
      toast.error('Failed to remove');
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">My Favorites</h1>
        <p className="text-gray-500 text-sm mt-1">Properties you've saved for later.</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : favorites.length === 0 ? (
        <div className="card text-center py-20">
          <FiHeart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-700">No favorites yet</h3>
          <p className="text-gray-400 text-sm mt-1">Tap the heart icon on any property to save it here.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Property</th>
                <th className="px-5 py-3 font-medium">Rent</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {favorites.map((f) => f.property && (
                <tr key={f._id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={f.property.images?.[0] || FALLBACK} alt="" className="w-14 h-14 rounded-lg object-cover" onError={(e) => { e.target.src = FALLBACK; }} />
                      <div>
                        <div className="font-medium text-gray-800">{f.property.title}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-400"><FiMapPin className="w-3 h-3" /> {f.property.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-700 font-medium">৳{f.property.rent?.toLocaleString()}/{f.property.rentType}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/property/${f.property._id}`} className="p-2 rounded-lg hover:bg-brand-50 text-brand-600"><FiEye className="w-4 h-4" /></Link>
                      <button onClick={() => removeFavorite(f.property._id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500"><FiTrash2 className="w-4 h-4" /></button>
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

export default withAuth(TenantFavorites, ['Tenant']);
