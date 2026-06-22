import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Link from 'next/link';
import api from '@/lib/api';
import PropertyCard from '@/components/property/PropertyCard';
import Spinner from '@/components/ui/Spinner';
import { FiSearch, FiShield, FiStar, FiHome, FiKey, FiTrendingUp, FiMapPin } from 'react-icons/fi';

const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Studio', 'Office', 'Shop'];

const REVIEWS = [
  { name: 'Rahim Uddin', rating: 5, role: 'Tenant', comment: 'Found my dream apartment within days! The platform is incredibly easy to use and the listings are accurate.', avatar: 'R' },
  { name: 'Fatema Begum', rating: 5, role: 'Tenant', comment: 'The booking process was seamless. The owner was responsive and the property was exactly as described.', avatar: 'F' },
  { name: 'Karim Hossain', rating: 4, role: 'Property Owner', comment: 'As an owner, NestFinder has made managing my properties so much easier. Great platform for landlords!', avatar: 'K' },
  { name: 'Sadia Islam', rating: 5, role: 'Tenant', comment: 'Moved to Dhaka for work and found a beautiful place within my budget. Highly recommend NestFinder!', avatar: 'S' },
];

const WHY_FEATURES = [
  { icon: FiShield, title: 'Verified Listings', desc: 'Every property is reviewed and approved by our admin team before going live.' },
  { icon: FiKey, title: 'Easy Booking', desc: 'Book your dream property in minutes with our streamlined booking process.' },
  { icon: FiTrendingUp, title: 'Best Prices', desc: 'Compare properties across locations and find the best value for your budget.' },
  { icon: FiHome, title: 'Diverse Options', desc: 'From studio apartments to luxury villas — we have something for everyone.' },
];

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function HomePage() {
  const router = useRouter();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ location: '', propertyType: '', minPrice: '', maxPrice: '' });

  useEffect(() => {
    api.get('/api/properties/featured')
      .then((r) => setFeatured(r.data.properties || r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.location) params.set('location', search.location);
    if (search.propertyType) params.set('propertyType', search.propertyType);
    if (search.minPrice) params.set('minPrice', search.minPrice);
    if (search.maxPrice) params.set('maxPrice', search.maxPrice);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <>
      {/* BANNER */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1600&q=80')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-900/75 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <motion.div
            initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-1 bg-accent/20 text-accent text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
              <FiHome className="w-3 h-3" /> Bangladesh&apos;s #1 Rental Platform
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Find Your <br />
              <span className="text-brand-300">Perfect Home</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-10 leading-relaxed">
              Discover thousands of verified rental properties across Bangladesh. Book your ideal home with confidence and ease.
            </p>

            {/* Search Form */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white rounded-2xl p-4 shadow-2xl"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Location..."
                    className="input-field pl-9"
                    value={search.location}
                    onChange={(e) => setSearch({ ...search, location: e.target.value })}
                  />
                </div>
                <select
                  className="input-field"
                  value={search.propertyType}
                  onChange={(e) => setSearch({ ...search, propertyType: e.target.value })}
                >
                  <option value="">All Types</option>
                  {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
                <input
                  type="number"
                  placeholder="Min Price (৳)"
                  className="input-field"
                  value={search.minPrice}
                  onChange={(e) => setSearch({ ...search, minPrice: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Max Price (৳)"
                  className="input-field"
                  value={search.maxPrice}
                  onChange={(e) => setSearch({ ...search, maxPrice: e.target.value })}
                />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                <FiSearch className="w-4 h-4" /> Search Properties
              </button>
            </motion.form>

            <div className="flex items-center gap-6 mt-8 text-gray-400 text-sm">
              <span className="flex items-center gap-1"><FiHome className="text-brand-400" /> 500+ Listings</span>
              <span className="flex items-center gap-1"><FiStar className="text-accent" /> 4.8/5 Rating</span>
              <span className="flex items-center gap-1"><FiShield className="text-green-400" /> Verified</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-brand-600 text-sm font-bold uppercase tracking-widest">Hand-picked</span>
            <h2 className="section-title mt-2">Featured Properties</h2>
            <p className="section-subtitle">Explore our top-rated, admin-verified rental listings.</p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.slice(0, 6).map((p, i) => <PropertyCard key={p._id} property={p} index={i} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">No featured properties yet.</div>
          )}

          <motion.div {...fadeUp} className="text-center mt-10">
            <Link href="/properties" className="btn-secondary px-8">Browse All Properties</Link>
          </motion.div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-brand-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="text-brand-300 text-sm font-bold uppercase tracking-widest">Why NestFinder</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mt-2">The Smart Way to Rent</h2>
            <p className="text-gray-400 mt-2">We combine technology and trust to make renting simple.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-brand-900/60 rounded-2xl p-6 border border-brand-800 hover:border-brand-600 transition-colors"
              >
                <div className="w-12 h-12 bg-brand-600/30 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-brand-300" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-brand-600 text-sm font-bold uppercase tracking-widest">Testimonials</span>
            <h2 className="section-title mt-2">What Our Users Say</h2>
            <p className="section-subtitle">Real experiences from real people across Bangladesh.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map(({ name, rating, role, comment, avatar }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card p-5"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: rating }).map((_, j) => (
                    <FiStar key={j} className="text-amber-400 fill-amber-400 w-4 h-4" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{comment}&rdquo;</p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                  <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-600">
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{name}</p>
                    <p className="text-xs text-gray-400">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 bg-brand-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[['500+', 'Properties Listed'], ['1,200+', 'Happy Tenants'], ['300+', 'Verified Owners'], ['4.8/5', 'Average Rating']].map(([val, label]) => (
              <motion.div key={label} {...fadeUp}>
                <div className="text-4xl font-display font-bold mb-1">{val}</div>
                <div className="text-brand-200 text-sm">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <h2 className="section-title mb-4">Ready to Find Your Next Home?</h2>
            <p className="section-subtitle mb-8">Join thousands of happy renters and owners on NestFinder today.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/properties" className="btn-primary px-8 py-3">Browse Properties</Link>
              <Link href="/register" className="btn-secondary px-8 py-3">List Your Property</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
