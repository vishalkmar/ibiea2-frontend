import { StatCard, Panel } from '../../components/dashboard/widgets';
import AsyncState from '../../components/dashboard/AsyncState';
import { useApi } from '../../hooks/useApi';
import { api } from '../../lib/api';

export default function AdminOverview({ role }) {
  const { data, loading, error } = useApi(() => api.adminOverview());
  const o = data || {};
  const omr = (n) => `OMR ${Number(n || 0).toLocaleString()}`;

  return (
    <div className="space-y-6">
      <AsyncState loading={loading} error={error} height="min-h-[120px]">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard icon="Users" label="Registrations" value={o.registrations ?? 0} />
          <StatCard icon="Building2" label="Exhibitors" value={o.exhibitors ?? 0} />
          <StatCard icon="Megaphone" label="Sponsors" value={o.sponsors ?? 0} />
          <StatCard icon="Trophy" label="Nominations" value={o.nominations ?? 0} />
        </div>
      </AsyncState>

      {role !== 'ops' && o.revenueCollected !== undefined && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard icon="DollarSign" label="Revenue Collected" value={omr(o.revenueCollected)} accentClass="text-green-700 bg-green-100" />
          <StatCard icon="CreditCard" label="Outstanding" value={omr(o.outstanding)} accentClass="text-amber-700 bg-amber-100" />
          <StatCard icon="Download" label="Cashfree" value={omr(o.cashfree)} />
          <StatCard icon="Landmark" label="Bank Transfer" value={omr(o.bankTransfer)} />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel title="Pending Actions">
          <ul className="space-y-3">
            {[
              { label: 'Bank transfers awaiting verification', tone: 'amber' },
              { label: 'Exhibitor profiles to approve', tone: 'amber' },
              { label: 'Sponsor deliverables to fulfil', tone: 'red' },
              { label: 'Awards shortlist ready to publish', tone: 'green' },
            ].map((p, i) => (
              <li key={i} className={`p-4 rounded-xl border-l-4 bg-navy-700/40 ${p.tone === 'red' ? 'border-red-400' : p.tone === 'green' ? 'border-green-400' : 'border-amber-400'}`}>
                <span className="text-sm font-medium text-cream">{p.label}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Event Snapshot">
          <div className="space-y-3 text-sm">
            <Row label="Total registrations" value={o.registrations ?? 0} />
            <Row label="Confirmed exhibitors" value={o.exhibitors ?? 0} />
            <Row label="Active sponsors" value={o.sponsors ?? 0} />
            <Row label="Award nominations" value={o.nominations ?? 0} />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-gold/20">
      <span className="text-cream/70">{label}</span>
      <span className="font-bold text-cream">{value}</span>
    </div>
  );
}
