import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import PropertyCard from '@/components/property/PropertyCard';
import Pagination from '@/components/ui/Pagination';
import Spinner from '@/components/ui/Spinner';
import { FiSearch, FiFilter, FiX, FiInbox } from 'react-icons/fi';

const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Studio', 'Office', 'Shop'];

export default function PropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    location: '', propertyType: '', minPrice: '', maxPrice: '', sort: '',
  });

  // Sync filters from URL query on first load / query change
  useEffect(() => {
    if (!router.isReady) return;
    const { location = '', propertyType = '', minPrice = '', maxPrice = '', sort = '', page = '1' } = router.query;
    setFilters({ location, propertyType, minPrice, maxPrice, sort });
    fetchProperties({ location, propertyType, minPrice, maxPrice, sort, page });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query]);

  const fetchProperties = async (params) => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => { if (v) query.set(k, v); });
      query.set('limit', '9');
      const { data } = await api.get(`/api/properties?${query.toString()}`);
      setProperties(data.properties || []);
      setPagination({
        page: data.page || 1,
        totalPages: data.totalPages || 1,
        total: data.total || 0,
      });
    } catch (err) {
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (e) => {
    e?.preventDefault();
    const query = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) query[k] = v; });
    router.push({ pathname: '/properties', query });
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({ location: '', propertyType: '', minPrice: '', maxPrice: '', sort: '' });
    router.push('/properties');
  };

  const goToPage = (page) => {
    router.push({ pathname: '/properties', query: { ...router.query, page } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="section-title">Browse Properties</h1>
        <p className="section-subtitle">{pagination.total} properties available for rent</p>
      </motion.div>

      {/* Filter Bar */}
      <div className="card p-4 mb-8">
        <div className="flex items-center justify-between mb-3 lg:hidden">
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 text-sm font-medium text-brand-600">
            <FiFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        <form onSubmit={applyFilters} className={`${showFilters ? 'grid' : 'hidden lg:grid'} grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3`}>
          <input
            type="text" placeholder="Location"
            className="input-field lg:col-span-2"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
          <select className="input-field" value={filters.propertyType} onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}>
            <option value="">All Types</option>
            {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <input
            type="number" placeholder="Min Price"
            className="input-field"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <input
            type="number" placeholder="Max Price"
            className="input-field"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
          <select className="input-field" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
            <option value="">Sort: Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          <div className="flex gap-2 lg:col-span-6">
            <button type="submit" className="btn-primary flex items-center gap-2 text-sm">
              <FiSearch className="w-4 h-4" /> Apply Filters
            </button>
            <button type="button" onClick={clearFilters} className="btn-secondary flex items-center gap-2 text-sm">
              <FiX className="w-4 h-4" /> Clear
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : error ? (
        <div className="text-center py-24 text-red-500">{error}</div>
      ) : properties.length === 0 ? (
        <div className="text-center py-24">
          <FiInbox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No properties found</h3>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search a different location.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p, i) => <PropertyCard key={p._id} property={p} index={i} />)}
          </div>
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={goToPage} />
        </>
      )}
    </div>
  );
}
