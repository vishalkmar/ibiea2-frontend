import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import AdminOverview from './AdminOverview';
import Registrations from './Registrations';
import ExhibitorMgmt from './ExhibitorMgmt';
import SponsorMgmt from './SponsorMgmt';
import AwardsMgmt from './AwardsMgmt';
import AwardeesMgmt from './AwardeesMgmt';
import FloorPlanMgmt from './FloorPlanMgmt';
import PlansMgmt from './PlansMgmt';
import FinanceReports from './FinanceReports';
import CMS from './CMS';
import UserRoles from './UserRoles';
import Analytics from './Analytics';
import RoleSwitcher from './RoleSwitcher';
import { auth } from '../../lib/api';

// Role-based nav (per WRD §14.7). Each item lists which roles may see it.
const ALL_NAV = [
  { to: '/admin', label: 'Overview', icon: 'LayoutDashboard', end: true, roles: ['super', 'ops', 'finance'] },
  { to: '/admin/registrations', label: 'Registrations', icon: 'Users', roles: ['super', 'ops', 'finance'] },
  { to: '/admin/exhibitors', label: 'Exhibitors', icon: 'Building2', roles: ['super', 'ops', 'finance'] },
  { to: '/admin/floor-plan', label: 'Floor Plan', icon: 'Grid3x3', roles: ['super', 'ops'] },
  { to: '/admin/plans', label: 'Plans & Tiers', icon: 'ListChecks', roles: ['super', 'ops'] },
  { to: '/admin/sponsors', label: 'Sponsors', icon: 'Megaphone', roles: ['super', 'ops', 'finance'] },
  { to: '/admin/awards', label: 'Awards', icon: 'Trophy', roles: ['super', 'ops'] },
  { to: '/admin/awardees', label: 'Awardees', icon: 'Award', roles: ['super', 'ops'] },
  { to: '/admin/finance', label: 'Finance Reports', icon: 'DollarSign', roles: ['super', 'ops', 'finance'] },
  { to: '/admin/analytics', label: 'Event Analytics', icon: 'BarChart3', roles: ['super', 'ops', 'finance'] },
  { to: '/admin/cms', label: 'Content (CMS)', icon: 'FileText', roles: ['super', 'ops'] },
  { to: '/admin/users', label: 'Users & Roles', icon: 'UserCog', roles: ['super'] },
];

const ROLE_LABELS = { super: 'Super Admin', ops: 'Operations Admin', finance: 'Finance Admin' };
const JWT_TO_SHORT = { super_admin: 'super', ops_admin: 'ops', finance_admin: 'finance' };

export default function AdminDashboard() {
  // Real role from JWT; super admins may preview other tiers via the switcher.
  const realRole = JWT_TO_SHORT[auth.user?.role] || 'super';
  const [role, setRole] = useState(realRole);
  const navItems = ALL_NAV.filter((n) => n.roles.includes(role));
  const user = { name: auth.user?.name || ROLE_LABELS[role], company: 'IBIEA Organizing Committee' };

  return (
    <DashboardLayout role="Admin Panel" navItems={navItems} user={user} title="Admin Panel">
      {realRole === 'super' && <RoleSwitcher role={role} setRole={setRole} labels={ROLE_LABELS} />}
      <Routes>
        <Route index element={<AdminOverview role={role} />} />
        <Route path="registrations" element={<Registrations role={role} />} />
        <Route path="exhibitors" element={<ExhibitorMgmt role={role} />} />
        <Route path="floor-plan" element={<RoleGuard role={role} allow={['super', 'ops']}><FloorPlanMgmt /></RoleGuard>} />
        <Route path="plans" element={<RoleGuard role={role} allow={['super', 'ops']}><PlansMgmt /></RoleGuard>} />
        <Route path="sponsors" element={<SponsorMgmt role={role} />} />
        <Route path="awards" element={<RoleGuard role={role} allow={['super', 'ops']}><AwardsMgmt /></RoleGuard>} />
        <Route path="awardees" element={<RoleGuard role={role} allow={['super', 'ops']}><AwardeesMgmt /></RoleGuard>} />
        <Route path="finance" element={<FinanceReports role={role} />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="cms" element={<RoleGuard role={role} allow={['super', 'ops']}><CMS /></RoleGuard>} />
        <Route path="users" element={<RoleGuard role={role} allow={['super']}><UserRoles /></RoleGuard>} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

function RoleGuard({ role, allow, children }) {
  if (!allow.includes(role)) {
    return (
      <div className="card-base p-12 text-center">
        <p className="text-5xl mb-3">🔒</p>
        <h2 className="text-xl font-bold text-umber">Access Restricted</h2>
        <p className="text-umber-light mt-2">Your role does not have permission to view this module.</p>
      </div>
    );
  }
  return children;
}
