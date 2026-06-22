import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { FiHome, FiMenu, FiX, FiUser, FiLogOut, FiGrid, FiChevronDown } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const router = useRouter();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/properties', label: 'Properties' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <FiHome className="text-white w-4 h-4" />
            </div>
            <span className="font-display font-bold text-xl text-brand-800">NestFinder</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors ${router.pathname === l.href ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {user.photo ? (
                    <img src={user.photo} alt={user.name} className="w-8 h-8 rounded-full object-cover border-2 border-brand-200" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                      <FiUser className="text-brand-600 w-4 h-4" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">{user.name?.split(' ')[0]}</span>
                  <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {dropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-hover border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                        <span className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full">{user.role}</span>
                      </div>
                      <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropOpen(false)}>
                        <FiGrid className="w-4 h-4" /> Dashboard
                      </Link>
                      <button onClick={() => { logout(); setDropOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                        <FiLogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn-secondary text-sm px-4 py-2">Login</Link>
                <Link href="/register" className="btn-primary text-sm px-4 py-2">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile burger */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="md:hidden border-t border-gray-100 overflow-hidden bg-white"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href} className="block py-2 text-sm text-gray-700" onClick={() => setMenuOpen(false)}>{l.label}</Link>
              ))}
              {user ? (
                <>
                  <Link href="/dashboard" className="block py-2 text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full text-left py-2 text-sm text-red-500">Logout</button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link href="/login" className="btn-secondary text-sm flex-1 text-center" onClick={() => setMenuOpen(false)}>Login</Link>
                  <Link href="/register" className="btn-primary text-sm flex-1 text-center" onClick={() => setMenuOpen(false)}>Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
