import { Routes, Route, Navigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Overview from './Overview';
import Profile from './Profile';
import Documents from './Documents';
import Passes from './Passes';
import Matchmaking from './Matchmaking';
import { auth } from '../../lib/api';

const NAV = [
  { to: '/exhibitor', label: 'Overview', icon: 'LayoutDashboard', end: true },
  { to: '/exhibitor/profile', label: 'Company Profile', icon: 'Building2' },
  { to: '/exhibitor/matchmaking', label: 'AI Matchmaking', icon: 'Sparkles' },
  { to: '/exhibitor/passes', label: 'Passes', icon: 'Ticket' },
  { to: '/exhibitor/documents', label: 'Documents', icon: 'FileText' },
];

export default function ExhibitorDashboard() {
  const user = auth.user;

  // Only exhibitors may use this portal.
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'exhibitor') {
    const home = ['super_admin', 'ops_admin', 'finance_admin'].includes(user.role) ? '/admin' : user.role === 'sponsor' ? '/sponsor' : '/';
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-gradient p-6">
        <div className="card-base p-10 text-center max-w-md">
          <p className="text-5xl mb-3">🔒</p>
          <h2 className="font-display text-2xl font-bold text-cream">Exhibitor Portal</h2>
          <p className="mt-2 text-cream/70">You're signed in as <span className="text-gold">{user.role.replace('_', ' ')}</span>. This area is for exhibitors only.</p>
          <Link to={home} className="btn-primary mt-6">Go to your dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout role="Exhibitor Portal" navItems={NAV} user={user} title="Exhibitor Dashboard">
      <Routes>
        <Route index element={<Overview />} />
        <Route path="profile" element={<Profile />} />
        <Route path="matchmaking" element={<Matchmaking />} />
        <Route path="passes" element={<Passes />} />
        <Route path="documents" element={<Documents />} />
        <Route path="*" element={<Navigate to="/exhibitor" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
