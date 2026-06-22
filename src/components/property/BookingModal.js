import { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function BookingModal({ isOpen, onClose, property }) {
  const { user } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    moveInDate: '',
    contactNumber: '',
    additionalNotes: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.moveInDate || !form.contactNumber) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const { data: bookingData } = await api.post('/api/bookings', {
        propertyId: property._id,
        moveInDate: form.moveInDate,
        contactNumber: form.contactNumber,
        additionalNotes: form.additionalNotes,
        userInfo: { name: user.name, email: user.email },
      });

      const { data: checkoutData } = await api.post('/api/payments/create-checkout-session', {
        bookingId: bookingData.booking._id,
      });

      if (checkoutData.url) {
        window.location.href = checkoutData.url;
      } else {
        toast.success('Booking request submitted!');
        onClose();
        router.push('/dashboard/tenant/bookings');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Book ${property?.title || 'Property'}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-brand-50 rounded-xl p-3 text-sm text-brand-700">
          Rent: <span className="font-bold">৳{property?.rent?.toLocaleString()}</span> / {property?.rentType}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Move-in Date *</label>
          <input
            type="date"
            required
            min={new Date().toISOString().split('T')[0]}
            className="input-field"
            value={form.moveInDate}
            onChange={(e) => setForm({ ...form, moveInDate: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Contact Number *</label>
          <input
            type="tel"
            required
            placeholder="01XXXXXXXXX"
            className="input-field"
            value={form.contactNumber}
            onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Additional Notes</label>
          <textarea
            rows={3}
            placeholder="Any special requests or information for the owner..."
            className="input-field resize-none"
            value={form.additionalNotes}
            onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })}
          />
        </div>
        <button type="submit" disabled={submitting} className="btn-accent w-full py-3 disabled:opacity-60">
          {submitting ? 'Processing...' : 'Confirm & Proceed to Payment'}
        </button>
      </form>
    </Modal>
  );
}
