import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHome } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl font-display font-bold text-brand-100 mb-2">404</div>
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-3">Page not found</h1>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          <FiHome /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
