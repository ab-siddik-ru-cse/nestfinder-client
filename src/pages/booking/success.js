import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import api from '@/lib/api';
import Spinner from '@/components/ui/Spinner';

export default function BookingSuccessPage() {
  const router = useRouter();
  const { session_id, bookingId } = router.query;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;
    // Optionally confirm with backend (webhook usually handles final state)
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [router.isReady]);

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <FiCheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-3">Payment Successful!</h1>
        <p className="text-gray-500 mb-8">
          Your booking has been confirmed and payment received. The property owner will review your request shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/tenant/bookings" className="btn-primary px-6 py-3">View My Bookings</Link>
          <Link href="/properties" className="btn-secondary px-6 py-3">Browse More</Link>
        </div>
      </motion.div>
    </div>
  );
}
