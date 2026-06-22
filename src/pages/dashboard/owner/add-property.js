import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { withAuth } from '@/lib/withAuth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { FiPlus, FiX } from 'react-icons/fi';

const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Studio', 'Office', 'Shop'];
const RENT_TYPES = ['Monthly', 'Weekly', 'Daily'];
const COMMON_AMENITIES = ['Parking', 'WiFi', 'Air Conditioning', 'Furnished', 'Security', 'Generator', 'Lift', 'Gas Line', 'Water Supply', 'Balcony'];

function AddProperty() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [imageInput, setImageInput] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', location: '', propertyType: 'Apartment',
    rent: '', rentType: 'Monthly', bedrooms: '', bathrooms: '', size: '',
    amenities: [], images: [], extraFeatures: '',
  });

  const toggleAmenity = (a) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }));
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setForm((f) => ({ ...f, images: [...f.images, imageInput.trim()] }));
      setImageInput('');
    }
  };

  const removeImage = (idx) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/properties', {
        ...form,
        rent: Number(form.rent),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        size: form.size ? Number(form.size) : undefined,
      });
      toast.success('Property submitted for approval!');
      router.push('/dashboard/owner/properties');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add property');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Add New Property</h1>
        <p className="text-gray-500 text-sm mt-1">List a new property. It will be reviewed by our admin team before going live.</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="card p-6 max-w-3xl space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Title *</label>
            <input required className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Cozy 2-Bed Apartment in Gulshan" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Description *</label>
            <textarea required rows={4} className="input-field resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the property in detail..." />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Location *</label>
            <input required className="input-field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Gulshan 2, Dhaka" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Property Type *</label>
            <select className="input-field" value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })}>
              {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Rent Type *</label>
            <select className="input-field" value={form.rentType} onChange={(e) => setForm({ ...form, rentType: e.target.value })}>
              {RENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Rent Amount (৳) *</label>
            <input required type="number" min="0" className="input-field" value={form.rent} onChange={(e) => setForm({ ...form, rent: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Size (sqft)</label>
            <input type="number" min="0" className="input-field" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Bedrooms *</label>
            <input required type="number" min="0" className="input-field" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Bathrooms *</label>
            <input required type="number" min="0" className="input-field" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {COMMON_AMENITIES.map((a) => (
              <button
                type="button" key={a} onClick={() => toggleAmenity(a)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${form.amenities.includes(a) ? 'bg-brand-600 text-white border-brand-600' : 'border-gray-200 text-gray-600 hover:border-brand-300'}`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Image URLs</label>
          <div className="flex gap-2 mb-2">
            <input className="input-field" placeholder="https://image-url.com/photo.jpg" value={imageInput} onChange={(e) => setImageInput(e.target.value)} />
            <button type="button" onClick={addImage} className="btn-secondary px-4 flex-shrink-0"><FiPlus /></button>
          </div>
          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt="" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5">
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Extra Features</label>
          <textarea rows={2} className="input-field resize-none" value={form.extraFeatures} onChange={(e) => setForm({ ...form, extraFeatures: e.target.value })} placeholder="Anything else worth mentioning..." />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary px-8 py-3 disabled:opacity-60">
          {submitting ? 'Submitting...' : 'Submit Property for Approval'}
        </button>
      </form>
    </DashboardLayout>
  );
}

export default withAuth(AddProperty, ['Owner']);
