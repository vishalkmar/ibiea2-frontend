import { useState, useEffect } from 'react';
import { MapPin, Trash2, Plus, Pencil, Ticket } from 'lucide-react';
import DataTable from '../../components/dashboard/DataTable';
import { StatusBadge } from '../../components/dashboard/widgets';
import AsyncState from '../../components/dashboard/AsyncState';
import Modal from '../../components/dashboard/Modal';
import { useApi } from '../../hooks/useApi';
import { api } from '../../lib/api';

const STATUSES = ['enquiry', 'in_progress', 'unpaid', 'confirmed'];

export default function ExhibitorMgmt({ role }) {
  const financeOnly = role === 'finance';
  const { data, loading, error, reload } = useApi(() => api.adminExhibitors());
  const { data: segments } = useApi(() => api.segments());
  const { data: packages } = useApi(() => api.packages());
  const { data: stalls, reload: reloadStalls } = useApi(() => api.adminStalls());
  const rows = data || [];
  const availableStalls = (stalls || []).filter((s) => s.status === 'available');

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // row being edited, or null = add
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const [viewPasses, setViewPasses] = useState(null); // exhibitor row whose passes we're viewing

  const openAdd = () => { setEditing(null); setForm({ status: 'confirmed', pass_quota: 10 }); setErr(''); setOpen(true); };
  const openEdit = (r) => {
    setEditing(r);
    setForm({ company: r.company, segment_id: r.segment_id || '', package_id: r.package_id || '', stall_id: r.stall_id || '', description: r.description || '', status: r.status, pass_quota: r.pass_quota ?? 0 });
    setErr(''); setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true); setErr('');
    try {
      if (editing) await api.adminUpdateExhibitor(editing.id, form);
      else await api.adminAddExhibitor(form);
      setOpen(false);
      reload(); reloadStalls();
    } catch (er) { setErr(er.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm('Remove this exhibitor? Their stall will be freed.')) return;
    await api.adminDeleteExhibitor(id); reload(); reloadStalls();
  };

  // When editing, also allow keeping the currently-assigned stall in the dropdown
  const stallOptions = editing?.stall_id
    ? [{ id: editing.stall_id, tier: 'current', dimensions: 'assigned' }, ...availableStalls.filter((s) => s.id !== editing.stall_id)]
    : availableStalls;

  const columns = [
    { key: 'company', label: 'Company', render: (r) => <span className="font-semibold text-cream">{r.company}</span> },
    { key: 'segment_name', label: 'Segment', render: (r) => r.segment_name || '—' },
    { key: 'stall_id', label: 'Stall', render: (r) => r.stall_id ? <span className="flex items-center gap-1 text-gold"><MapPin size={13} /> {r.stall_id}</span> : '—' },
    { key: 'package_name', label: 'Package', render: (r) => r.package_name || '—' },
    { key: 'passes', label: 'Passes', render: (r) => (
      <button onClick={() => setViewPasses(r)} className="flex items-center gap-1.5 text-cream/80 hover:text-gold" title="View assigned passes">
        <Ticket size={14} className="text-gold" /> {r.passes_used ?? 0} / {r.pass_quota ?? 0}
      </button>
    )},
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'actions', label: 'Actions', render: (r) => (
      !financeOnly ? (
        <div className="flex gap-2">
          <button onClick={() => openEdit(r)} className="text-cream/60 hover:text-gold" title="Edit"><Pencil size={15} /></button>
          <button onClick={() => remove(r.id)} className="text-cream/60 hover:text-red-400" title="Remove"><Trash2 size={15} /></button>
        </div>
      ) : <span className="text-cream/40 text-xs">—</span>
    )},
  ];

  return (
    <div className="space-y-4">
      {financeOnly && <p className="text-sm text-amber-300 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-lg">Finance Admin can verify payments only.</p>}
      <AsyncState loading={loading} error={error}>
        <DataTable
          title={`Exhibitors (${rows.length})`}
          columns={columns}
          rows={rows}
          searchKeys={['company', 'segment_name', 'stall_id']}
          toolbar={!financeOnly && <button onClick={openAdd} className="btn-primary !py-2 text-sm"><Plus size={15} /> Add Exhibitor</button>}
        />
      </AsyncState>

      {open && (
        <Modal title={editing ? 'Edit Exhibitor' : 'Add Exhibitor'} onClose={() => setOpen(false)}>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-cream/90 mb-1.5">Company Name *</label>
              <input className="field" required value={form.company || ''} onChange={(e) => setField('company', e.target.value)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-cream/90 mb-1.5">Industry Category *</label>
                <select className="field" required value={form.segment_id || ''} onChange={(e) => setField('segment_id', e.target.value)}>
                  <option value="">Select…</option>
                  {(segments || []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-cream/90 mb-1.5">Package</label>
                <select className="field" value={form.package_id || ''} onChange={(e) => setField('package_id', e.target.value)}>
                  <option value="">Select…</option>
                  {(packages || []).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-cream/90 mb-1.5">Assign Stall</label>
                <select className="field" value={form.stall_id || ''} onChange={(e) => setField('stall_id', e.target.value)}>
                  <option value="">No stall</option>
                  {stallOptions.map((s) => <option key={s.id} value={s.id}>{s.id}{s.tier !== 'current' ? ` · ${s.tier} · ${s.dimensions}` : ' (current)'}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-cream/90 mb-1.5">Status</label>
                <select className="field" value={form.status || 'confirmed'} onChange={(e) => setField('status', e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-cream/90 mb-1.5">Pass Quota (how many passes this exhibitor can assign)</label>
              <input type="number" min={0} className="field" value={form.pass_quota ?? 0} onChange={(e) => setField('pass_quota', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-cream/90 mb-1.5">Description (public directory)</label>
              <textarea rows={2} className="field" value={form.description || ''} onChange={(e) => setField('description', e.target.value)} />
            </div>
            {err && <p className="text-sm text-red-400">{err}</p>}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">{saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Exhibitor'}</button>
              <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {viewPasses && <PassesModal exhibitor={viewPasses} onClose={() => setViewPasses(null)} />}
    </div>
  );
}

function PassesModal({ exhibitor, onClose }) {
  const [data, setData] = useState(null);
  useEffect(() => { api.adminExhibitorPasses(exhibitor.id).then(setData).catch(() => setData({ assigned: [] })); }, [exhibitor.id]);
  const assigned = data?.assigned || [];
  return (
    <Modal title={`Passes — ${exhibitor.company}`} onClose={onClose}>
      <p className="text-sm text-cream/70 mb-4">{assigned.length} of {data?.quota ?? exhibitor.pass_quota ?? 0} passes assigned.</p>
      {assigned.length === 0 ? (
        <p className="text-cream/60 text-sm py-6 text-center">This exhibitor hasn't assigned any passes yet.</p>
      ) : (
        <ul className="space-y-2">
          {assigned.map((p) => (
            <li key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-navy-900/40 border border-gold/10">
              <div className="w-9 h-9 rounded-full bg-gold text-navy flex items-center justify-center font-bold">{p.name.slice(0, 1)}</div>
              <div>
                <p className="font-semibold text-cream text-sm">{p.name}</p>
                <p className="text-xs text-cream/60">{[p.role, p.email].filter(Boolean).join(' · ') || '—'}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
