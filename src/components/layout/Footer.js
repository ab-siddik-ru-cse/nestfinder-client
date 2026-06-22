import Link from 'next/link';
import { FiHome, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <FiHome className="text-white w-4 h-4" />
              </div>
              <span className="font-display font-bold text-xl text-white">NestFinder</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted platform for finding the perfect rental property. From cozy apartments to luxury villas.
            </p>
          </div>
          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/properties', 'Browse Properties'], ['/login', 'Login'], ['/register', 'Register']].map(([href, label]) => (
                <li key={href}><Link href={href} className="hover:text-brand-300 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">For Owners</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/register" className="hover:text-brand-300 transition-colors">List Your Property</Link></li>
              <li><Link href="/dashboard" className="hover:text-brand-300 transition-colors">Owner Dashboard</Link></li>
              <li><a href="#" className="hover:text-brand-300 transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><FiMail className="text-brand-400" /> support@nestfinder.com</li>
              <li className="flex items-center gap-2"><FiPhone className="text-brand-400" /> +880 1700 000000</li>
              <li className="flex items-center gap-2"><FiMapPin className="text-brand-400" /> Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-brand-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} NestFinder. All rights reserved.</p>
          <p>Built with Next.js &amp; Express.js</p>
        </div>
      </div>
    </footer>
  );
}
