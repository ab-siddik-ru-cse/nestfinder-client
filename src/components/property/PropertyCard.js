import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMoon, FiDroplet, FiMapPin, FiHeart } from 'react-icons/fi';

const FALLBACK = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80';

export default function PropertyCard({ property, index = 0 }) {
  const img = property.images?.[0] || FALLBACK;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="card group overflow-hidden flex flex-col"
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={img}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = FALLBACK; }}
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 text-brand-700 text-xs font-bold px-3 py-1 rounded-full shadow">
            {property.propertyType}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            ৳{property.rent?.toLocaleString()}/{property.rentType === 'Monthly' ? 'mo' : property.rentType === 'Weekly' ? 'wk' : 'day'}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-bold text-gray-900 text-lg mb-1 line-clamp-1">{property.title}</h3>
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <FiMapPin className="w-3 h-3 flex-shrink-0 text-brand-400" />
          <span className="line-clamp-1">{property.location}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1"><FiMoon className="text-brand-400" />{property.bedrooms} beds</span>
          <span className="flex items-center gap-1"><FiDroplet className="text-brand-400" />{property.bathrooms} baths</span>
          {property.size && <span className="text-xs">{property.size} sqft</span>}
        </div>
        <div className="mt-auto pt-3 border-t border-gray-50">
          <Link
            href={`/property/${property._id}`}
            className="block text-center btn-primary text-sm w-full py-2"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
