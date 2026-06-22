import DashboardSidebar from './DashboardSidebar';
import Navbar from '@/components/layout/Navbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:block flex-shrink-0">
        <DashboardSidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden">
          <Navbar />
        </div>
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
