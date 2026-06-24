import { useState, useEffect } from 'react';
import { Grid3x3, Loader2, Trash2, CheckCircle2 } from 'lucide-react';
import { Panel, StatCard, StatusBadge } from '../../components/dashboard/widgets';
import AsyncState from '../../components/dashboard/AsyncState';
import { useApi } from '../../hooks/useApi';
import { api } from '../../lib/api';

export default function FloorPlanMgmt() {
  const { data, loading, error, reload } = useApi(() => api.adminStalls());
  const stalls = data || [];
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(8);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const counts = {
    total: stalls.length,
    available: stalls.filter((s) => s.status === 'available').length,
    booked: stalls.filter((s) => s.status === 'booked').length,
  };

  const generate = async () => {
    if (!confirm(`Set the floor plan to ${rows} × ${cols} = ${rows * cols} stalls? Unbooked stalls will be re-laid out.`)) return;
    setBusy(true); setMsg('');
    try {
      const res = await api.adminGenerateStalls(Number(rows), Number(cols));
      setMsg(res.message); reload();
    } catch (e) { setMsg(e.message); }
    finally { setBusy(false); }
  };

  const removeStall = async (id) => {
    try { await api.adminDeleteStall(id); reload(); }
    catch (e) { alert(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-5">
        <StatCard icon="Grid3x3" label="Total Stalls" value={counts.total} />
        <StatCard icon="Check" label="Available" value={counts.available} accentClass="text-green-400 bg-green-500/15" />
        <StatCard icon="MapPin" label="Booked" value={counts.booked} accentClass="text-gold bg-gold/15" />
      </div>

      <Panel title="Configure Floor Plan">
        <p className="text-sm text-cream/70 mb-5">Set how many stalls appear on the public Exhibitor floor plan. Booked stalls are preserved.</p>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-semibold text-cream/90 mb-1.5">Rows</label>
            <input type="number" min={1} max={12} value={rows} onChange={(e) => setRows(e.target.value)} className="field w-28" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-cream/90 mb-1.5">Columns</label>
            <input type="number" min={1} max={12} value={cols} onChange={(e) => setCols(e.target.value)} className="field w-28" />
          </div>
          <div className="text-cream/70 text-sm pb-3">= <span className="font-bold text-gold">{rows * cols}</span> stalls</div>
          <button onClick={generate} disabled={busy} className="btn-primary disabled:opacity-60">
            {busy ? <><Loader2 size={16} className="animate-spin" /> Applying…</> : <><Grid3x3 size={16} /> Apply Layout</>}
          </button>
          {msg && <span className="flex items-center gap-1.5 text-green-400 text-sm font-semibold pb-3"><CheckCircle2 size={15} /> {msg}</span>}
        </div>
      </Panel>

      <Panel title="Stalls">
        <AsyncState loading={loading} error={error}>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-3">
            {stalls.map((s) => (
              <div key={s.id} className="rounded-xl border border-gold/20 bg-navy-900/40 p-3 text-center relative group">
                <p className="font-bold text-cream">{s.id}</p>
                <p className="text-[10px] text-cream/50">{s.tier}</p>
                <div className="mt-1"><StatusBadge status={s.status} /></div>
                {s.status !== 'booked' && (
                  <button onClick={() => removeStall(s.id)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500/80 text-white items-center justify-center hidden group-hover:flex" title="Delete stall">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </AsyncState>
      </Panel>
    </div>
  );
}
