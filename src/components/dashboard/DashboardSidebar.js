import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import {
  FiHome, FiList, FiHeart, FiUser, FiPlusCircle, FiBarChart2,
  FiUsers, FiDollarSign, FiLogOut, FiBookOpen, FiChevronRight
} from 'react-icons/fi';

const tenantLinks = [
  { href: '/dashboard/tenant/bookings', label: 'My Bookings', icon: FiBookOpen },
  { href: '/dashboard/tenant/favorites', label: 'Favorites', icon: FiHeart },
  { href: '/dashboard/tenant/profile', label: 'Profile', icon: FiUser },
];
const ownerLinks = [
  { href: '/dashboard/owner', label: 'Analytics', icon: FiBarChart2 },
  { href: '/dashboard/owner/add-property', label: 'Add Property', icon: FiPlusCircle },
  { href: '/dashboard/owner/properties', label: 'My Properties', icon: FiList },
  { href: '/dashboard/owner/bookings', label: 'Booking Requests', icon: FiBookOpen },
];
const adminLinks = [
  { href: '/dashboard/admin/users', label: 'All Users', icon: FiUsers },
  { href: '/dashboard/admin/properties', label: 'All Properties', icon: FiList },
  { href: '/dashboard/admin/bookings', label: 'All Bookings', icon: FiBookOpen },
  { href: '/dashboard/admin/transactions', label: 'Transactions', icon: FiDollarSign },
];

export default function DashboardSidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const links = user?.role === 'Admin' ? adminLinks : user?.role === 'Owner' ? ownerLinks : tenantLinks;
  const roleColor = { Admin: 'bg-purple-100 text-purple-700', Owner: 'bg-blue-100 text-blue-700', Tenant: 'bg-green-100 text-green-700' };

  return (
    <aside className="w-64 min-h-screen bg-brand-950 text-gray-200 flex flex-col">
      {/* User Card */}
      <div className="p-5 border-b border-brand-900">
        <div className="flex items-center gap-3">
          {user?.photo ? (
            <img src={user.photo} alt={user?.name} className="w-10 h-10 rounded-full object-cover border-2 border-brand-600" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-brand-700 flex items-center justify-center text-white font-bold">
              {user?.name?.[0]}
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${roleColor[user?.role] || 'bg-gray-700 text-gray-300'}`}>{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Home link */}
      <div className="px-3 pt-4">
        <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-brand-800 transition-colors">
          <FiHome className="w-4 h-4" /> Back to Site
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = router.pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group
                ${active ? 'bg-brand-600 text-white' : 'text-gray-400 hover:bg-brand-800 hover:text-white'}`}
            >
              <span className="flex items-center gap-2">
                <Icon className="w-4 h-4" /> {label}
              </span>
              {active && <FiChevronRight className="w-3 h-3" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-brand-900">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors"
        >
          <FiLogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
