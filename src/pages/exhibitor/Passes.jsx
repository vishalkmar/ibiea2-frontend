import { useState } from 'react';
import { UserPlus, BadgeCheck, Trash2, Loader2 } from 'lucide-react';
import { Panel } from '../../components/dashboard/widgets';
import AsyncState from '../../components/dashboard/AsyncState';
import { useApi } from '../../hooks/useApi';
import { api } from '../../lib/api';

export default function Passes() {
  const { data, loading, error, reload } = useApi(() => api.exhibitorPasses());
  const quota = data?.quota ?? 0;
  const passes = data?.assigned ?? [];
  const remaining = quota - passes.length;

  const [form, setForm] = useState({ name: '', email: '', role: '' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const assign = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true); setErr('');
    try {
      await api.exhibitorAddPass(form);
      setForm({ name: '', email: '', role: '' });
      reload();
    } catch (er) { setErr(er.message || 'Failed to assign pass'); }
    finally { setSaving(false); }
  };

  const revoke = async (id) => {
    await api.exhibitorDeletePass(id); reload();
  };

  return (
    <div className="space-y-6">
      <Panel title="Pass Allocation">
        <AsyncState loading={loading} error={error} height="min-h-[80px]">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold text-cream">{passes.length} of {quota} passes assigned</span>
            <span className="text-cream/60">{Math.max(0, remaining)} remaining</span>
          </div>
          <div className="h-3 rounded-full bg-navy-900/60 overflow-hidden border border-gold/15">
            <div className="h-full bg-gold-gradient transition-all" style={{ width: quota ? `${Math.min(100, (passes.length / quota) * 100)}%` : '0%' }} />
          </div>
          {quota === 0 && <p className="mt-3 text-sm text-amber-300">Your pass quota hasn't been set yet. The organisers allocate passes per package.</p>}
        </AsyncState>
      </Panel>

      <div className="grid lg:grid-cols-3 gap-6">
        <Panel title="Assign a Pass" className="lg:col-span-1">
          <form onSubmit={assign} className="space-y-4">
            {[['name', 'Staff Name'], ['email', 'Email'], ['role', 'Role / Designation']].map(([k, label]) => (
              <div key={k}>
                <label className="block text-sm font-semibold text-cream/90 mb-1.5">{label}{k === 'name' ? ' *' : ''}</label>
                <input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="field" required={k === 'name'} />
              </div>
            ))}
            {err && <p className="text-sm text-red-400">{err}</p>}
            <button type="submit" disabled={saving || remaining <= 0} className="btn-primary w-full disabled:opacity-50">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Assigning…</> : <><UserPlus size={16} /> Assign Pass</>}
            </button>
            {remaining <= 0 && quota > 0 && <p className="text-xs text-cream/50 text-center">All passes assigned. Contact organisers to add more.</p>}
          </form>
        </Panel>

        <Panel title="Assigned Passes" className="lg:col-span-2">
          <AsyncState loading={loading} error={error} height="min-h-[120px]">
            {passes.length === 0 ? (
              <p className="text-cream/60 text-sm py-6 text-center">No passes assigned yet.</p>
            ) : (
              <ul className="space-y-3">
                {passes.map((p) => (
                  <li key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-navy-900/40 border border-gold/15">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold text-navy flex items-center justify-center font-bold">{p.name.slice(0, 1)}</div>
                      <div>
                        <p className="font-semibold text-cream flex items-center gap-1.5">{p.name} <BadgeCheck size={15} className="text-green-400" /></p>
                        <p className="text-sm text-cream/60">{[p.role, p.email].filter(Boolean).join(' · ') || '—'}</p>
                      </div>
                    </div>
                    <button onClick={() => revoke(p.id)} className="text-cream/50 hover:text-red-400" title="Revoke"><Trash2 size={16} /></button>
                  </li>
                ))}
              </ul>
            )}
          </AsyncState>
        </Panel>
      </div>
    </div>
  );
}
