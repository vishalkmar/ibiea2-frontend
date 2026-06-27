import { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Pencil, ListChecks, FileUp, Loader2, ExternalLink } from 'lucide-react';
import DataTable from '../../components/dashboard/DataTable';
import { StatusBadge } from '../../components/dashboard/widgets';
import AsyncState from '../../components/dashboard/AsyncState';
import Modal from '../../components/dashboard/Modal';
import { useApi } from '../../hooks/useApi';
import { api } from '../../lib/api';

const STATUSES = ['enquiry', 'confirmed'];
const DELIV_STATUS = ['pending', 'in_progress', 'delivered'];

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

  const [delivFor, setDelivFor] = useState(null); // sponsor row whose deliverables we manage

  const columns = [
    { key: 'company', label: 'Sponsor', render: (r) => <span className="font-semibold text-cream">{r.company}</span> },
    { key: 'tier_name', label: 'Tier', render: (r) => <span className="font-semibold text-gold">{r.tier_name || '—'}</span> },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'deliverables', label: 'Deliverables', render: (r) => (
      !financeOnly ? (
        <button onClick={() => setDelivFor(r)} className="flex items-center gap-1.5 text-cream/80 hover:text-gold" title="Manage branding deliverables">
          <ListChecks size={14} className="text-gold" /> Manage
        </button>
      ) : <span className="text-cream/40 text-xs">—</span>
    )},
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

      {delivFor && <DeliverablesModal sponsor={delivFor} onClose={() => setDelivFor(null)} />}
    </div>
  );
}

function DeliverablesModal({ sponsor, onClose }) {
  const { data, loading, error, reload } = useApi(() => api.adminDeliverables(sponsor.id));
  const items = data || [];
  const [newLabel, setNewLabel] = useState('');
  const [busy, setBusy] = useState(false);
  const proofInput = useRef(null);
  const [proofFor, setProofFor] = useState(null);
  const [proofBusy, setProofBusy] = useState(null);

  const add = async (e) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    setBusy(true);
    try { await api.adminAddDeliverable(sponsor.id, { label: newLabel.trim() }); setNewLabel(''); reload(); }
    finally { setBusy(false); }
  };
  const setStatus = async (id, status) => { await api.adminUpdateDeliverable(id, { status }); reload(); };
  const remove = async (id) => { await api.adminDeleteDeliverable(id); reload(); };
  const pickProof = (id) => { setProofFor(id); proofInput.current?.click(); };
  const onProof = async (e) => {
    const file = e.target.files?.[0]; e.target.value = '';
    if (!file || !proofFor) return;
    setProofBusy(proofFor);
    try { await api.adminUploadDeliverableProof(proofFor, file); reload(); }
    catch (er) { alert(er.message); } finally { setProofBusy(null); setProofFor(null); }
  };

  return (
    <Modal title={`Deliverables — ${sponsor.company}`} onClose={onClose}>
      <input ref={proofInput} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={onProof} />
      <AsyncState loading={loading} error={error} height="min-h-[120px]">
        {items.length === 0 ? (
          <p className="text-cream/60 text-sm py-4 text-center">No deliverables yet. Add the first one below.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-navy-900/40 border border-gold/10">
                <div className="min-w-0">
                  <p className="font-medium text-cream text-sm truncate">{d.label}</p>
                  {d.proof_url && <a href={d.proof_url} target="_blank" rel="noreferrer" className="text-xs text-gold flex items-center gap-1 mt-0.5">Proof <ExternalLink size={11} /></a>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select value={d.status} onChange={(e) => setStatus(d.id, e.target.value)} className="field !py-1.5 !px-2 text-xs w-32">
                    {DELIV_STATUS.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                  <button onClick={() => pickProof(d.id)} disabled={proofBusy === d.id} className="text-cream/60 hover:text-gold" title="Upload proof">
                    {proofBusy === d.id ? <Loader2 size={15} className="animate-spin" /> : <FileUp size={15} />}
                  </button>
                  <button onClick={() => remove(d.id)} className="text-cream/60 hover:text-red-400" title="Remove"><Trash2 size={15} /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AsyncState>
      <form onSubmit={add} className="flex gap-2 mt-5">
        <input className="field flex-1" placeholder="New deliverable (e.g. Stage backdrop logo)" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
        <button type="submit" disabled={busy} className="btn-primary !py-2 disabled:opacity-60"><Plus size={16} /> Add</button>
      </form>
    </Modal>
  );
}
