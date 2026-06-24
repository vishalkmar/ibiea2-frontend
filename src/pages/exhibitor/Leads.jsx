import { useState } from 'react';
import { Download, Search, ScanLine, StickyNote } from 'lucide-react';
import { Panel, StatusBadge, StatCard } from '../../components/dashboard/widgets';
import AsyncState from '../../components/dashboard/AsyncState';
import { useApi } from '../../hooks/useApi';
import { api } from '../../lib/api';

function timeAgo(ts) {
  if (!ts) return '';
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Leads() {
  const [q, setQ] = useState('');
  const { data, loading, error } = useApi(() => api.exhibitorLeads());
  const leads = data || [];
  const filtered = leads.filter((l) => (`${l.visitor_name} ${l.company}`).toLowerCase().includes(q.toLowerCase()));
  const hot = leads.filter((l) => l.status === 'hot').length;

  const exportCsv = () => {
    const header = 'Name,Company,Designation,Email,Phone,Status,Tag\n';
    const rows = leads.map((l) => [l.visitor_name, l.company, l.designation, l.email, l.phone, l.status, l.tag].map((v) => `"${v ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'ibiea-leads.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-5">
        <StatCard icon="Users" label="Total Leads" value={leads.length} />
        <StatCard icon="Flame" label="Hot Leads" value={hot} accentClass="text-red-400 bg-red-100" />
        <StatCard icon="ScanLine" label="Captured via Scan" value={leads.filter((l) => l.source === 'scan').length} />
      </div>

      <Panel
        title="Lead Management"
        action={
          <div className="flex gap-2">
            <button className="btn-ghost !py-2 text-sm"><ScanLine size={16} /> Scan Badge</button>
            <button onClick={exportCsv} className="btn-primary !py-2 text-sm"><Download size={16} /> Export CSV</button>
          </div>
        }
      >
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/70" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search leads…"
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gold/20 bg-transparent focus:border-gold outline-none" />
        </div>

        <AsyncState loading={loading} error={error}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="text-left text-cream/70 border-b border-gold/20">
                  <th className="py-3 font-semibold">Name</th>
                  <th className="py-3 font-semibold">Company</th>
                  <th className="py-3 font-semibold">Designation</th>
                  <th className="py-3 font-semibold">Captured</th>
                  <th className="py-3 font-semibold">Status</th>
                  <th className="py-3 font-semibold">Tag</th>
                  <th className="py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/15">
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-navy-700/40">
                    <td className="py-3 font-semibold text-cream">{l.visitor_name}</td>
                    <td className="py-3 text-cream/70">{l.company}</td>
                    <td className="py-3 text-cream/70">{l.designation}</td>
                    <td className="py-3 text-cream/70">{timeAgo(l.captured_at)}</td>
                    <td className="py-3"><StatusBadge status={l.status} /></td>
                    <td className="py-3 text-cream/70">{l.tag || '—'}</td>
                    <td className="py-3"><button className="text-cream/70 hover:text-gold"><StickyNote size={16} /></button></td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-cream/70">No leads found.</td></tr>}
              </tbody>
            </table>
          </div>
        </AsyncState>
      </Panel>
    </div>
  );
}
