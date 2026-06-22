import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiXCircle } from 'react-icons/fi';

export default function BookingCancelPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiXCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-3">Payment Cancelled</h1>
        <p className="text-gray-500 mb-8">
          Your payment was not completed. Your booking is saved as pending — you can try paying again from your bookings page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/tenant/bookings" className="btn-primary px-6 py-3">Go to My Bookings</Link>
          <Link href="/properties" className="btn-secondary px-6 py-3">Browse Properties</Link>
        </div>
      </motion.div>
    </div>
  );
}
