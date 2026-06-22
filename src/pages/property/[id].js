import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { withAuth } from '@/lib/withAuth';
import Spinner from '@/components/ui/Spinner';
import BookingModal from '@/components/property/BookingModal';
import {
  FiMoon, FiDroplet, FiMapPin, FiHeart, FiCheck, FiStar, FiCalendar, FiMaximize
} from 'react-icons/fi';

const FALLBACK = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80';

function PropertyDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImg, setActiveImg] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      api.get(`/api/properties/${id}`),
      api.get(`/api/reviews/${id}`).catch(() => ({ data: { reviews: [] } })),
    ])
      .then(([propRes, reviewRes]) => {
        setProperty(propRes.data.property || propRes.data);
        setReviews(reviewRes.data.reviews || []);
      })
      .catch(() => setError('Property not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || !user) return;
    api.get('/api/favorites')
      .then((r) => {
        const favs = r.data.favorites || [];
        setIsFavorite(favs.some((f) => f.property?._id === id));
      })
      .catch(() => {});
  }, [id, user]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/api/favorites/${id}`);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await api.post(`/api/favorites/${id}`);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><Spinner size="lg" /></div>;
  if (error || !property) return <div className="text-center py-24 text-red-500">{error || 'Not found.'}</div>;

  const images = property.images?.length ? property.images : [FALLBACK];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Images + Details */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl overflow-hidden mb-3 h-96">
            <img src={images[activeImg]} alt={property.title} className="w-full h-full object-cover" onError={(e) => { e.target.src = FALLBACK; }} />
          </motion.div>
          {images.length > 1 && (
            <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${activeImg === i ? 'border-brand-600' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="badge-approved mb-2 inline-block">{property.propertyType}</span>
              <h1 className="text-3xl font-display font-bold text-gray-900">{property.title}</h1>
              <p className="flex items-center gap-1 text-gray-500 mt-1"><FiMapPin className="text-brand-400" /> {property.location}</p>
            </div>
            {user?.role === 'Tenant' && (
              <button onClick={toggleFavorite} className="p-3 rounded-full border border-gray-200 hover:border-red-300 transition-colors">
                <FiHeart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mb-6 mt-4">
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl text-sm"><FiMoon className="text-brand-500" /> {property.bedrooms} Bedrooms</div>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl text-sm"><FiDroplet className="text-brand-500" /> {property.bathrooms} Bathrooms</div>
            {property.size && <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl text-sm"><FiMaximize className="text-brand-500" /> {property.size} sqft</div>}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
          </div>

          {property.amenities?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2 text-sm text-gray-600">
                    <FiCheck className="text-green-500 flex-shrink-0" /> {a}
                  </div>
                ))}
              </div>
            </div>
          )}

          {property.extraFeatures && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Additional Features</h2>
              <p className="text-gray-600">{property.extraFeatures}</p>
            </div>
          )}

          {/* Reviews */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-sm">No reviews yet for this property.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rv) => (
                  <div key={rv._id} className="card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800 text-sm">{rv.tenant?.name || 'Anonymous'}</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: rv.rating }).map((_, i) => <FiStar key={i} className="text-amber-400 fill-amber-400 w-3.5 h-3.5" />)}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{rv.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Booking Card */}
        <div>
          <div className="card p-6 sticky top-24">
            <div className="flex items-end gap-1 mb-1">
              <span className="text-3xl font-display font-bold text-brand-700">৳{property.rent?.toLocaleString()}</span>
              <span className="text-gray-400 text-sm mb-1">/ {property.rentType}</span>
            </div>
            <p className="text-xs text-gray-400 mb-6">Excludes utility & service charges</p>

            {user?.role === 'Tenant' ? (
              <button onClick={() => setBookingOpen(true)} className="btn-accent w-full py-3 flex items-center justify-center gap-2">
                <FiCalendar /> Book This Property
              </button>
            ) : user ? (
              <p className="text-sm text-gray-400 text-center bg-gray-50 rounded-xl p-3">Only tenants can book properties.</p>
            ) : (
              <button onClick={() => router.push(`/login?redirect=/property/${id}`)} className="btn-accent w-full py-3">
                Login to Book
              </button>
            )}

            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Listed by</span><span className="font-medium text-gray-800">{property.owner?.name || 'Owner'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Property Type</span><span className="font-medium text-gray-800">{property.propertyType}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="font-medium text-green-600">Available</span></div>
            </div>
          </div>
        </div>
      </div>

      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} property={property} />
    </div>
  );
}

export default withAuth(PropertyDetailPage);
