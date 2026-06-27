import { StatCard, Panel } from '../../components/dashboard/widgets';
import AsyncState from '../../components/dashboard/AsyncState';
import { StatBarChart, HBarChart, AreaTrend, DonutStat } from '../../components/ui/Charts';
import { useApi } from '../../hooks/useApi';
import { api } from '../../lib/api';

// Coerce recharts-friendly numeric data (mysql2 COUNT can return strings).
const num = (rows) => (rows || []).map((r) => ({ label: r.label, value: Number(r.value) }));

export default function Analytics() {
  const { data, loading, error } = useApi(() => api.adminAnalytics());
  const a = data || {};
  const t = a.totals || {};
  const floorPct = a.floor?.total ? Math.round((a.floor.booked / a.floor.total) * 100) : 0;

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
          <Panel title="Registration Growth">
            {num(a.regByWeek).length ? <AreaTrend data={num(a.regByWeek)} height={280} />
              : <p className="text-cream/50 text-sm py-12 text-center">No registrations yet.</p>}
          </Panel>
          <Panel title="Exhibitors by Segment">
            {num(a.exBySegment).length ? <StatBarChart data={num(a.exBySegment)} height={280} />
              : <p className="text-cream/50 text-sm py-12 text-center">No exhibitors yet.</p>}
          </Panel>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <Panel title="Package Popularity" className="lg:col-span-1">
            {num(a.pkgPopularity).length ? <HBarChart data={num(a.pkgPopularity)} height={240} />
              : <p className="text-cream/50 text-sm py-12 text-center">No bookings yet.</p>}
          </Panel>
          <Panel title="Floor Occupancy">
            <div className="flex flex-col items-center justify-center py-2">
              <DonutStat value={floorPct} label="Booked" size={190} />
              <p className="text-sm text-cream/70 mt-3">{a.floor?.booked ?? 0} of {a.floor?.total ?? 0} stalls booked</p>
            </div>
          </Panel>
          <Panel title="Nominations by Category">
            {num(a.nomByCategory).length ? <HBarChart data={num(a.nomByCategory)} height={240} />
              : <p className="text-cream/50 text-sm py-12 text-center">No nominations yet.</p>}
          </Panel>
        </div>
      </AsyncState>
    </div>
  );
}
