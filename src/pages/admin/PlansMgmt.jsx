import { useState } from 'react';
import { Plus, Pencil, Trash2, Star, Package, Crown } from 'lucide-react';
import { Panel, StatusBadge } from '../../components/dashboard/widgets';
import AsyncState from '../../components/dashboard/AsyncState';
import Modal from '../../components/dashboard/Modal';
import { useApi } from '../../hooks/useApi';
import { api } from '../../lib/api';

export default function PlansMgmt() {
  return (
    <div className="space-y-6">
      <Packages />
      <Tiers />
    </div>
  );
}

/* ---- Exhibitor Packages ---- */
function Packages() {
  const { data, loading, error, reload } = useApi(() => api.adminPackages());
  const rows = data || [];
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const featureText = (f) => Array.isArray(f) ? f.join('\n') : (typeof f === 'string' ? safeJoin(f) : '');
  function safeJoin(s) { try { const a = JSON.parse(s); return Array.isArray(a) ? a.join('\n') : s; } catch { return s; } }

  const openAdd = () => { setEditing(null); setForm({ features: '' }); setErr(''); setOpen(true); };
  const openEdit = (p) => { setEditing(p); setForm({ name: p.name, features: featureText(p.features), popular: !!p.popular, themed: !!p.themed }); setErr(''); setOpen(true); };

  const submit = async (e) => {
    e.preventDefault(); setSaving(true); setErr('');
    const payload = { name: form.name, features: form.features, popular: form.popular, themed: form.themed };
    try {
      if (editing) await api.adminUpdatePackage(editing.id, payload);
      else await api.adminAddPackage(payload);
      setOpen(false); reload();
    } catch (er) { setErr(er.message || 'Failed'); } finally { setSaving(false); }
  };
  const remove = async (id) => { if (confirm('Remove this package?')) { await api.adminDeletePackage(id); reload(); } };

  return (
    <Panel title="Exhibitor Packages" action={<button onClick={openAdd} className="btn-primary !py-2 text-sm"><Plus size={15} /> Add Package</button>}>
      <AsyncState loading={loading} error={error}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rows.map((p) => (
            <div key={p.id} className="rounded-xl border border-gold/15 bg-navy-900/40 p-5 relative">
              <div className="flex items-start justify-between">
                <div className="icon-tile !w-10 !h-10"><Package size={18} /></div>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(p)} className="text-cream/60 hover:text-gold"><Pencil size={14} /></button>
                  <button onClick={() => remove(p.id)} className="text-cream/60 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
              <h4 className="mt-3 font-display font-bold text-cream">{p.name}</h4>
              <div className="flex gap-1.5 mt-1">
                {!!p.popular && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold text-navy flex items-center gap-1"><Star size={10} /> Popular</span>}
                {!!p.themed && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-deep text-cream">2026</span>}
              </div>
              <ul className="mt-2 text-xs text-cream/60 space-y-1">
                {arr(p.features).slice(0, 4).map((f, i) => <li key={i}>· {f}</li>)}
              </ul>
            </div>
          ))}
          {rows.length === 0 && <p className="text-cream/50 text-sm py-4">No packages yet.</p>}
        </div>
      </AsyncState>

      {open && (
        <Modal title={editing ? 'Edit Package' : 'Add Package'} onClose={() => setOpen(false)}>
          <form onSubmit={submit} className="space-y-4">
            <div><label className="block text-sm font-semibold text-cream/90 mb-1.5">Package Name *</label>
              <input className="field" required value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="block text-sm font-semibold text-cream/90 mb-1.5">Features (one per line)</label>
              <textarea rows={5} className="field" value={form.features || ''} onChange={(e) => setForm({ ...form, features: e.target.value })} /></div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-cream/80"><input type="checkbox" checked={!!form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} /> Most Popular</label>
              <label className="flex items-center gap-2 text-sm text-cream/80"><input type="checkbox" checked={!!form.themed} onChange={(e) => setForm({ ...form, themed: e.target.checked })} /> 2026 Theme</label>
            </div>
            {err && <p className="text-sm text-red-400">{err}</p>}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">{saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Package'}</button>
              <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </Panel>
  );
}

/* ---- Sponsor Tiers ---- */
function Tiers() {
  const { data, loading, error, reload } = useApi(() => api.adminTiers());
  const rows = data || [];
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const openAdd = () => { setEditing(null); setForm({ sort_order: rows.length + 1 }); setErr(''); setOpen(true); };
  const openEdit = (t) => { setEditing(t); setForm({ name: t.name, scope: t.scope, sort_order: t.sort_order }); setErr(''); setOpen(true); };

  const submit = async (e) => {
    e.preventDefault(); setSaving(true); setErr('');
    try {
      if (editing) await api.adminUpdateTier(editing.id, form);
      else await api.adminAddTier(form);
      setOpen(false); reload();
    } catch (er) { setErr(er.message || 'Failed'); } finally { setSaving(false); }
  };
  const remove = async (id) => { if (confirm('Remove this tier?')) { await api.adminDeleteTier(id); reload(); } };

  return (
    <Panel title="Sponsor Tiers" action={<button onClick={openAdd} className="btn-primary !py-2 text-sm"><Plus size={15} /> Add Tier</button>}>
      <AsyncState loading={loading} error={error}>
        <ul className="space-y-3">
          {rows.map((t) => (
            <li key={t.id} className="flex items-center justify-between p-4 rounded-xl border border-gold/15 bg-navy-900/40">
              <div className="flex items-center gap-3">
                <div className="icon-tile !w-10 !h-10"><Crown size={18} /></div>
                <div>
                  <p className="font-display font-bold text-cream">{t.name} <span className="text-xs text-cream/50">#{t.sort_order}</span></p>
                  <p className="text-sm text-cream/60">{t.scope}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(t)} className="text-cream/60 hover:text-gold"><Pencil size={15} /></button>
                <button onClick={() => remove(t.id)} className="text-cream/60 hover:text-red-400"><Trash2 size={15} /></button>
              </div>
            </li>
          ))}
          {rows.length === 0 && <p className="text-cream/50 text-sm py-4 text-center">No tiers yet.</p>}
        </ul>
      </AsyncState>

      {open && (
        <Modal title={editing ? 'Edit Tier' : 'Add Tier'} onClose={() => setOpen(false)}>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2"><label className="block text-sm font-semibold text-cream/90 mb-1.5">Tier Name *</label>
                <input className="field" required value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><label className="block text-sm font-semibold text-cream/90 mb-1.5">Order</label>
                <input type="number" className="field" value={form.sort_order ?? ''} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} /></div>
            </div>
            <div><label className="block text-sm font-semibold text-cream/90 mb-1.5">Scope / Description</label>
              <textarea rows={3} className="field" value={form.scope || ''} onChange={(e) => setForm({ ...form, scope: e.target.value })} /></div>
            {err && <p className="text-sm text-red-400">{err}</p>}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">{saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Tier'}</button>
              <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </Panel>
  );
}

function arr(f) {
  if (Array.isArray(f)) return f;
  try { const a = JSON.parse(f); return Array.isArray(a) ? a : []; } catch { return []; }
}
