import { useState } from 'react';
import { RefreshCw, Pencil, Trash2, Loader2, Check } from 'lucide-react';
import DataTable from '../../components/dashboard/DataTable';
import { StatusBadge } from '../../components/dashboard/widgets';
import AsyncState from '../../components/dashboard/AsyncState';
import Modal from '../../components/dashboard/Modal';
import { useApi } from '../../hooks/useApi';
import { api } from '../../lib/api';

const REG_STATUS = ['pending', 'confirmed', 'paid', 'cancelled'];

export default function Registrations({ role }) {
  const readOnly = role === 'finance';
  const { data, loading, error, reload } = useApi(() => api.adminRegistrations());
  const rows = (data || []).map((r) => ({ ...r, date: r.created_at ? new Date(r.created_at).toLocaleDateString() : '' }));

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [resending, setResending] = useState(null);
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const openEdit = (r) => { setEditing(r); setForm({ name: r.name, email: r.email, phone: r.phone || '', company: r.company || '', reg_type: r.reg_type, status: r.status }); };

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await api.adminUpdateRegistration(editing.id, form); setEditing(null); reload(); }
    catch (er) { alert(er.message); }
    finally { setSaving(false); }
  };

  const resend = async (id) => {
    setResending(id);
    try { await api.adminResendTicket(id); }
    catch (er) { alert(er.message); }
    finally { setResending(null); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this registration?')) return;
    await api.adminDeleteRegistration(id); reload();
  };

  const columns = [
    { key: 'name', label: 'Name', render: (r) => <span className="font-semibold text-cream">{r.name}</span> },
    { key: 'email', label: 'Email' },
    { key: 'reg_type', label: 'Type', render: (r) => <span className="capitalize">{r.reg_type}</span> },
    { key: 'company', label: 'Company', render: (r) => r.company || '—' },
    { key: 'date', label: 'Registered' },
    { key: 'family_tour', label: 'Family Tour', render: (r) => (r.family_tour ? 'Yes' : '—') },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex gap-2">
        <button onClick={() => resend(r.id)} disabled={resending === r.id} className="text-cream/70 hover:text-gold" title="Resend ticket">
          {resending === r.id ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
        </button>
        {!readOnly && <button onClick={() => openEdit(r)} className="text-cream/70 hover:text-gold" title="Edit"><Pencil size={15} /></button>}
        {!readOnly && <button onClick={() => remove(r.id)} className="text-cream/70 hover:text-red-400" title="Delete"><Trash2 size={15} /></button>}
      </div>
    )},
  ];

  return (
    <div className="space-y-4">
      {readOnly && <p className="text-sm text-amber-300 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-lg">Finance Admin has view-only access to registrations.</p>}
      <AsyncState loading={loading} error={error}>
        <DataTable title={`Registrations (${rows.length})`} columns={columns} rows={rows} searchKeys={['name', 'email', 'company']} onExport={() => {}} />
      </AsyncState>

      {editing && (
        <Modal title="Edit Registration" onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold text-cream/90 mb-1.5">Name</label><input className="field" value={form.name || ''} onChange={(e) => setField('name', e.target.value)} /></div>
              <div><label className="block text-sm font-semibold text-cream/90 mb-1.5">Email</label><input type="email" className="field" value={form.email || ''} onChange={(e) => setField('email', e.target.value)} /></div>
              <div><label className="block text-sm font-semibold text-cream/90 mb-1.5">Phone</label><input className="field" value={form.phone || ''} onChange={(e) => setField('phone', e.target.value)} /></div>
              <div><label className="block text-sm font-semibold text-cream/90 mb-1.5">Company</label><input className="field" value={form.company || ''} onChange={(e) => setField('company', e.target.value)} /></div>
              <div>
                <label className="block text-sm font-semibold text-cream/90 mb-1.5">Type</label>
                <select className="field" value={form.reg_type} onChange={(e) => setField('reg_type', e.target.value)}>
                  <option value="visitor">visitor</option><option value="delegate">delegate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-cream/90 mb-1.5">Status</label>
                <select className="field" value={form.status} onChange={(e) => setField('status', e.target.value)}>
                  {REG_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">{saving ? 'Saving…' : <>Save Changes <Check size={16} /></>}</button>
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
