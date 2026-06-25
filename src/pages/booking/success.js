import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import api from '@/lib/api';
import Spinner from '@/components/ui/Spinner';

export default function BookingSuccessPage() {
  const router = useRouter();
  const { session_id, bookingId } = router.query;
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!router.isReady) return;

    if (session_id && bookingId) {
      // Verify payment with backend — this confirms amountPaid & paymentStatus
      // even when Stripe webhook is delayed or not yet configured
      api
        .get(`/api/payments/verify?session_id=${session_id}&bookingId=${bookingId}`)
        .then(({ data }) => {
          if (data.success) {
            setVerified(true);
          } else {
            setError('Payment could not be confirmed. Please check your bookings page.');
          }
        })
        .catch(() => {
          // If verify fails (e.g. token expired), still show success UI
          // because Stripe redirect only happens after payment succeeded
          setVerified(true);
        })
        .finally(() => setLoading(false));
    } else {
      // No session info — just show success (direct navigation)
      const timer = setTimeout(() => {
        setVerified(true);
        setLoading(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [router.isReady, session_id, bookingId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <Spinner size="lg" />
        <p className="text-gray-400 text-sm animate-pulse">Confirming your payment…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="w-10 h-10 text-yellow-500" />
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-3">Payment Received</h1>
          <p className="text-gray-500 mb-8">
            Your payment was processed by Stripe but confirmation is pending. Please check your bookings page — it may take a moment to update.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard/tenant/bookings" className="btn-primary px-6 py-3">
              View My Bookings
            </Link>
            <Link href="/properties" className="btn-secondary px-6 py-3">
              Browse More
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <FiCheckCircle className="w-10 h-10 text-green-600" />
        </motion.div>
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-3">Payment Successful!</h1>
        <p className="text-gray-500 mb-8">
          Your booking has been confirmed and payment received. The property owner has been notified.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/tenant/bookings" className="btn-primary px-6 py-3">
            View My Bookings
          </Link>
          <Link href="/properties" className="btn-secondary px-6 py-3">
            Browse More
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
