import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Download, Check, Crown } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { StatCard, StatusBadge, Panel } from '../../components/dashboard/widgets';
import AsyncState from '../../components/dashboard/AsyncState';
import { useApi } from '../../hooks/useApi';
import { api, auth } from '../../lib/api';

const NAV = [
  { to: '/sponsor', label: 'Overview', icon: 'LayoutDashboard', end: true },
  { to: '/sponsor/deliverables', label: 'Branding Deliverables', icon: 'ListChecks' },
  { to: '/sponsor/payments', label: 'Payments', icon: 'CreditCard' },
  { to: '/sponsor/passes', label: 'Passes', icon: 'Ticket' },
];

function useSponsor() {
  return useApi(() => api.sponsorMe());
}

const TIER_PASSES = { 'Title Sponsor': 20, Platinum: 10, Gold: 5, Silver: 2 };

function Overview() {
  const { data, loading, error } = useSponsor();
  const s = data?.sponsor;
  const dels = data?.deliverables || [];
  const pays = data?.payments || [];
  const done = dels.filter((d) => d.status === 'delivered').length;
  const paidCount = pays.filter((p) => p.status === 'paid').length;
  const includedPasses = TIER_PASSES[s?.tier_name] ?? 0;

  return (
    <div className="space-y-6">
      <AsyncState loading={loading} error={error} height="min-h-[120px]">
        <div className="card-base p-6 !bg-gradient-to-r !from-navy-700 !to-navy-600 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gold/15 flex items-center justify-center"><Crown size={28} className="text-gold" /></div>
            <div>
              <p className="text-cream/70 text-sm">Your Sponsorship</p>
              <h2 className="font-display text-2xl font-bold text-cream">{s?.tier_name || 'No tier'} Tier</h2>
            </div>
          </div>
          <StatusBadge status={s?.status || 'enquiry'} />
        </div>
      </AsyncState>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon="ListChecks" label="Deliverables Done" value={`${done} / ${dels.length}`} />
        <StatCard icon="Ticket" label="Included Passes" value={includedPasses} />
        <StatCard icon="CreditCard" label="Payments Made" value={paidCount} />
        <StatCard icon="Megaphone" label="Tier" value={s?.tier_name || '—'} accentClass="text-gold bg-gold/15" />
      </div>
      <Panel title="Outstanding Items">
        <AsyncState loading={loading} error={error}>
          <ul className="space-y-3">
            {dels.filter((d) => d.status !== 'delivered').map((it) => (
              <li key={it.id} className="flex items-center justify-between p-4 rounded-xl bg-navy-700/40">
                <span className="font-medium text-cream">{it.label}</span>
                <StatusBadge status={it.status} />
              </li>
            ))}
            {dels.filter((d) => d.status !== 'delivered').length === 0 && <p className="text-cream/70 text-sm py-4 text-center">All deliverables complete 🎉</p>}
          </ul>
        </AsyncState>
      </Panel>
    </div>
  );
}

function Deliverables() {
  const { data, loading, error } = useSponsor();
  const dels = data?.deliverables || [];
  return (
    <Panel title="Branding Deliverables Tracker">
      <p className="text-sm text-cream/70 mb-5">Track what's been promised and delivered against your package.</p>
      <AsyncState loading={loading} error={error}>
        <ul className="space-y-3">
          {dels.map((d) => (
            <li key={d.id} className="flex items-center justify-between p-4 rounded-xl border border-gold/20 bg-navy-700/40">
              <span className="flex items-center gap-3 font-medium text-cream">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center ${d.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-navy-600 text-cream/70'}`}>
                  {d.status === 'delivered' && <Check size={14} />}
                </span>
                {d.label}
              </span>
              <StatusBadge status={d.status} />
            </li>
          ))}
        </ul>
      </AsyncState>
    </Panel>
  );
}

function Payments() {
  const { data, loading, error } = useSponsor();
  const pays = data?.payments || [];
  return (
    <div className="space-y-6">
      <Panel title="Payment History">
        <AsyncState loading={loading} error={error}>
          {pays.length === 0 ? (
            <p className="text-cream/70 text-sm py-4 text-center">No payments recorded yet.</p>
          ) : (
            <ul className="divide-y divide-gold/15">
              {pays.map((p) => (
                <li key={p.ref} className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-semibold text-cream">{p.ref} · {p.currency} {Number(p.amount).toLocaleString()}</p>
                    <p className="text-sm text-cream/70 capitalize">{p.method.replace('_', ' ')}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={p.status === 'pending_verification' ? 'pending verification' : p.status} />
                    <button className="btn-ghost !py-2 text-sm"><Download size={15} /> Invoice</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AsyncState>
        <div className="mt-5 p-4 rounded-xl bg-navy-700/50 text-sm text-cream/70">
          Pay via Cashfree (card/UPI/net-banking/wallet) or bank transfer. Milestone-based instalments supported.
        </div>
      </Panel>
    </div>
  );
}

function Passes() {
  const { data, loading, error } = useSponsor();
  const tier = data?.sponsor?.tier_name;
  const included = TIER_PASSES[tier] ?? 0;
  return (
    <Panel title="Complimentary Passes">
      <AsyncState loading={loading} error={error} height="min-h-[80px]">
        <div className="flex items-center gap-4">
          <div className="icon-tile !w-12 !h-12"><Crown size={24} /></div>
          <div>
            <p className="font-display text-2xl font-bold text-cream">{included} passes</p>
            <p className="text-sm text-cream/70">Included with your {tier || 'sponsorship'} tier</p>
          </div>
        </div>
        <p className="mt-5 text-sm text-cream/60">To allocate these passes to your team, contact the organising committee with your delegate details.</p>
      </AsyncState>
    </Panel>
  );
}

export default function SponsorDashboard() {
  const user = auth.user;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'sponsor') {
    const home = ['super_admin', 'ops_admin', 'finance_admin'].includes(user.role) ? '/admin' : user.role === 'exhibitor' ? '/exhibitor' : '/';
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-gradient p-6">
        <div className="card-base p-10 text-center max-w-md">
          <p className="text-5xl mb-3">🔒</p>
          <h2 className="font-display text-2xl font-bold text-cream">Sponsor Portal</h2>
          <p className="mt-2 text-cream/70">You're signed in as <span className="text-gold">{user.role.replace('_', ' ')}</span>. This area is for sponsors only.</p>
          <Link to={home} className="btn-primary mt-6">Go to your dashboard</Link>
        </div>
      </div>
    );
  }
  return (
    <DashboardLayout role="Sponsor Portal" navItems={NAV} user={user} title="Sponsor Dashboard">
      <Routes>
        <Route index element={<Overview />} />
        <Route path="deliverables" element={<Deliverables />} />
        <Route path="payments" element={<Payments />} />
        <Route path="passes" element={<Passes />} />
        <Route path="*" element={<Navigate to="/sponsor" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
