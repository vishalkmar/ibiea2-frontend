import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { StatCard, StatusBadge, Panel } from '../../components/dashboard/widgets';
import AsyncState from '../../components/dashboard/AsyncState';
import { useApi } from '../../hooks/useApi';
import { api } from '../../lib/api';

export default function Overview() {
  const { data: me, loading, error } = useApi(() => api.exhibitorMe());
  const { data: passes } = useApi(() => api.exhibitorPasses());
  const { data: projects } = useApi(() => api.exhibitorProjects());
  const { data: matches } = useApi(() => api.exhibitorMatches());

  const paid = me?.status === 'confirmed';
  const quota = passes?.quota ?? 0;
  const used = passes?.assigned?.length ?? 0;

  const openInvoice = () => window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/exhibitor/invoice`, '_blank');

  return (
    <div className="space-y-6">
      {/* Booking summary banner */}
      <AsyncState loading={loading} error={error} height="min-h-[120px]">
        <div className="card-base p-6 !bg-gradient-to-r !from-navy-700 !to-navy-600">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-gold text-sm">Your Booking</p>
              <h2 className="font-display text-2xl font-bold mt-1 text-cream">{me?.package_name || 'No package yet'}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-cream/70">
                {me?.stall_id && <span className="flex items-center gap-1.5"><MapPin size={15} className="text-gold" /> Stall {me.stall_id} · {me.dimensions}</span>}
                <StatusBadge status={me?.status || 'enquiry'} />
              </div>
            </div>
          </div>
        </div>
      </AsyncState>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard icon="Ticket" label="Passes Used" value={`${used} / ${quota}`} />
        <StatCard icon="Building2" label="Developer Projects" value={projects?.length ?? 0} />
        <StatCard icon="Sparkles" label="AI Matches" value={matches?.length ?? 0} accentClass="text-gold bg-gold/15" />
      </div>

      {/* Payment status note */}
      <div className={`card-base p-5 flex items-start gap-3 border-l-4 ${paid ? '!border-l-green-500' : '!border-l-amber-500'}`}>
        <AlertCircle size={20} className={`${paid ? 'text-green-400' : 'text-amber-300'} shrink-0 mt-0.5`} />
        <div>
          <p className="font-semibold text-cream">{paid ? 'Booking Confirmed' : 'Awaiting Confirmation'}</p>
          <p className="text-sm text-cream/70">{paid ? 'Your booking is confirmed. Download your invoice anytime.' : 'Your booking is being processed.'}</p>
        </div>
      </div>

      {/* Quick actions */}
      <Panel title="Quick Actions">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/exhibitor/profile" className="p-4 rounded-xl bg-navy-900/40 border border-gold/15 hover:border-gold/40 transition text-center">
            <p className="font-semibold text-cream text-sm">Edit Profile</p>
          </Link>
          <Link to="/exhibitor/passes" className="p-4 rounded-xl bg-navy-900/40 border border-gold/15 hover:border-gold/40 transition text-center">
            <p className="font-semibold text-cream text-sm">Assign Passes</p>
          </Link>
          <button onClick={openInvoice} className="p-4 rounded-xl bg-navy-900/40 border border-gold/15 hover:border-gold/40 transition text-center">
            <p className="font-semibold text-cream text-sm flex items-center justify-center gap-1.5"><Download size={14} /> Invoice</p>
          </button>
          <Link to="/exhibitor/matchmaking" className="p-4 rounded-xl bg-navy-900/40 border border-gold/15 hover:border-gold/40 transition text-center">
            <p className="font-semibold text-cream text-sm">View Matches</p>
          </Link>
        </div>
      </Panel>
    </div>
  );
}
