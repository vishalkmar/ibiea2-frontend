import { useState } from 'react';
import { Trash2, Plus, Pencil } from 'lucide-react';
import DataTable from '../../components/dashboard/DataTable';
import { StatusBadge } from '../../components/dashboard/widgets';
import AsyncState from '../../components/dashboard/AsyncState';
import Modal from '../../components/dashboard/Modal';
import { useApi } from '../../hooks/useApi';
import { api } from '../../lib/api';

const STATUSES = ['enquiry', 'confirmed'];

export default function SponsorMgmt({ role }) {
  const financeOnly = role === 'finance';
  const { data, loading, error, reload } = useApi(() => api.adminSponsors());
  const { data: tiers } = useApi(() => api.sponsorTiers());
  const rows = data || [];

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const openAdd = () => { setEditing(null); setForm({ status: 'confirmed' }); setErr(''); setOpen(true); };
  const openEdit = (r) => {
    setEditing(r);
    setForm({ company: r.company, tier_id: r.tier_id || '', status: r.status, branding_notes: r.branding_notes || '' });
    setErr(''); setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true); setErr('');
    try {
      if (editing) await api.adminUpdateSponsor(editing.id, form);
      else await api.adminAddSponsor(form);
      setOpen(false); reload();
    } catch (er) { setErr(er.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm('Remove this sponsor?')) return;
    await api.adminDeleteSponsor(id); reload();
  };

  const columns = [
    { key: 'company', label: 'Sponsor', render: (r) => <span className="font-semibold text-cream">{r.company}</span> },
    { key: 'tier_name', label: 'Tier', render: (r) => <span className="font-semibold text-gold">{r.tier_name || '—'}</span> },
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
          title={`Sponsors (${rows.length})`}
          columns={columns}
          rows={rows}
          searchKeys={['company', 'tier_name']}
          toolbar={!financeOnly && <button onClick={openAdd} className="btn-primary !py-2 text-sm"><Plus size={15} /> Add Sponsor</button>}
        />
      </AsyncState>

      {open && (
        <Modal title={editing ? 'Edit Sponsor' : 'Add Sponsor'} onClose={() => setOpen(false)}>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-cream/90 mb-1.5">Company Name *</label>
              <input className="field" required value={form.company || ''} onChange={(e) => setField('company', e.target.value)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-cream/90 mb-1.5">Tier / Category *</label>
                <select className="field" required value={form.tier_id || ''} onChange={(e) => setField('tier_id', e.target.value)}>
                  <option value="">Select…</option>
                  {(tiers || []).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-cream/90 mb-1.5">Status</label>
                <select className="field" value={form.status || 'confirmed'} onChange={(e) => setField('status', e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-cream/90 mb-1.5">Branding Notes</label>
              <textarea rows={2} className="field" value={form.branding_notes || ''} onChange={(e) => setField('branding_notes', e.target.value)} />
            </div>
            {err && <p className="text-sm text-red-400">{err}</p>}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">{saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Sponsor'}</button>
              <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
