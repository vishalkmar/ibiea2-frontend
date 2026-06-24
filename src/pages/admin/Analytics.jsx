import { StatCard, Panel } from '../../components/dashboard/widgets';
import AsyncState from '../../components/dashboard/AsyncState';
import { useApi } from '../../hooks/useApi';
import { api } from '../../lib/api';

function BarChart({ data, label }) {
  if (!data || data.length === 0) return <p className="text-cream/50 text-sm py-8 text-center">No data yet.</p>;
  const max = Math.max(...data.map((d) => Number(d.value)), 1);
  return (
    <div>
      <p className="text-sm font-semibold text-cream mb-4">{label}</p>
      <div className="flex items-end gap-2 h-44">
        {data.map((d) => (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-gold-gradient rounded-t-lg transition-all hover:opacity-80" style={{ height: `${(Number(d.value) / max) * 100}%`, minHeight: '4px' }} title={d.value} />
            <span className="text-[10px] text-cream/70 text-center leading-tight">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Analytics() {
  const { data, loading, error } = useApi(() => api.adminAnalytics());
  const a = data || {};
  const t = a.totals || {};
  const floorPct = a.floor?.total ? Math.round((a.floor.booked / a.floor.total) * 100) : 0;
  const pkgMax = Math.max(...(a.pkgPopularity || []).map((p) => Number(p.value)), 1);

  return (
    <div className="space-y-6">
      <AsyncState loading={loading} error={error}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard icon="Users" label="Total Registrations" value={t.registrations ?? 0} />
          <StatCard icon="ScanLine" label="Leads Captured" value={t.leads ?? 0} />
          <StatCard icon="Calendar" label="Meetings Booked" value={t.meetings ?? 0} />
          <StatCard icon="Trophy" label="Nominations" value={t.nominations ?? 0} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <Panel title="Registration Growth"><BarChart data={a.regByWeek} label="Registrations by week" /></Panel>
          <Panel title="Exhibitors by Segment"><BarChart data={a.exBySegment} label="Top industry segments" /></Panel>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <Panel title="Package Popularity">
            {(a.pkgPopularity || []).length === 0 ? <p className="text-cream/50 text-sm py-4 text-center">No data.</p> :
              a.pkgPopularity.map((p) => (
                <div key={p.label} className="mb-3">
                  <div className="flex justify-between text-sm mb-1"><span className="text-cream">{p.label}</span><span className="text-cream/70">{p.value}</span></div>
                  <div className="h-2 rounded-full bg-navy-900/50 overflow-hidden"><div className="h-full bg-gold-gradient" style={{ width: `${(Number(p.value) / pkgMax) * 100}%` }} /></div>
                </div>
              ))}
          </Panel>
          <Panel title="Floor Occupancy">
            <div className="text-center py-4">
              <div className="relative w-32 h-32 mx-auto rounded-full" style={{ background: `conic-gradient(#D4AF37 0% ${floorPct}%, #101D4A ${floorPct}% 100%)` }}>
                <div className="absolute inset-4 bg-navy-800 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gold">{floorPct}%</span>
                </div>
              </div>
              <p className="text-sm text-cream/70 mt-3">{a.floor?.booked ?? 0} of {a.floor?.total ?? 0} stalls booked</p>
            </div>
          </Panel>
          <Panel title="Nominations by Category">
            {(a.nomByCategory || []).length === 0 ? <p className="text-cream/50 text-sm py-4 text-center">No nominations yet.</p> :
              a.nomByCategory.map((n) => (
                <div key={n.label} className="flex justify-between py-2 border-b border-gold/15 text-sm">
                  <span className="text-cream truncate pr-2">{n.label}</span><span className="font-bold text-gold">{n.value}</span>
                </div>
              ))}
          </Panel>
        </div>
      </AsyncState>
    </div>
  );
}
