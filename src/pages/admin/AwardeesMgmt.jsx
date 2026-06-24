import { useState } from 'react';
import { Trophy, Trash2, Plus, Pencil } from 'lucide-react';
import DataTable from '../../components/dashboard/DataTable';
import AsyncState from '../../components/dashboard/AsyncState';
import Modal from '../../components/dashboard/Modal';
import { useApi } from '../../hooks/useApi';
import { api } from '../../lib/api';

export default function AwardeesMgmt() {
  const { data, loading, error, reload } = useApi(() => api.adminAwardees());
  const { data: categories } = useApi(() => api.awardCategories());
  const rows = data || [];

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ edition: '2026' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const openAdd = () => { setEditing(null); setForm({ edition: '2026' }); setErr(''); setOpen(true); };
  const openEdit = (r) => {
    setEditing(r);
    setForm({ nominee: r.nominee, company: r.company || '', category_id: r.category_id || '', citation: r.citation || '', edition: r.edition || '2026' });
    setErr(''); setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true); setErr('');
    try {
      if (editing) await api.adminUpdateAwardee(editing.id, form);
      else await api.adminAddAwardee(form);
      setOpen(false); reload();
    } catch (er) { setErr(er.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm('Remove this awardee from the Hall of Fame?')) return;
    await api.adminDeleteAwardee(id); reload();
  };

  const columns = [
    { key: 'nominee', label: 'Winner', render: (r) => <span className="font-semibold text-cream flex items-center gap-2"><Trophy size={15} className="text-gold" /> {r.nominee}</span> },
    { key: 'company', label: 'Company', render: (r) => r.company || '—' },
    { key: 'category', label: 'Award Category', render: (r) => <span className="text-gold">{r.category}</span> },
    { key: 'edition', label: 'Edition' },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex gap-2">
        <button onClick={() => openEdit(r)} className="text-cream/60 hover:text-gold" title="Edit"><Pencil size={15} /></button>
        <button onClick={() => remove(r.id)} className="text-cream/60 hover:text-red-400" title="Remove"><Trash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-4">
      <AsyncState loading={loading} error={error}>
        <DataTable
          title={`Awardees / Hall of Fame (${rows.length})`}
          columns={columns}
          rows={rows}
          searchKeys={['nominee', 'company', 'category']}
          toolbar={<button onClick={openAdd} className="btn-primary !py-2 text-sm"><Plus size={15} /> Add Awardee</button>}
        />
      </AsyncState>

      {open && (
        <Modal title={editing ? 'Edit Awardee' : 'Add Awardee'} onClose={() => setOpen(false)}>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-cream/90 mb-1.5">Winner Name *</label>
                <input className="field" required value={form.nominee || ''} onChange={(e) => setField('nominee', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-cream/90 mb-1.5">Company</label>
                <input className="field" value={form.company || ''} onChange={(e) => setField('company', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-cream/90 mb-1.5">Award Category *</label>
              <select className="field" required value={form.category_id || ''} onChange={(e) => setField('category_id', e.target.value)}>
                <option value="">Select…</option>
                {(categories || []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-cream/90 mb-1.5">Citation</label>
                <input className="field" placeholder="Why they won…" value={form.citation || ''} onChange={(e) => setField('citation', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-cream/90 mb-1.5">Edition</label>
                <input className="field" value={form.edition || ''} onChange={(e) => setField('edition', e.target.value)} />
              </div>
            </div>
            {err && <p className="text-sm text-red-400">{err}</p>}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">{saving ? 'Saving…' : editing ? 'Save Changes' : 'Add to Hall of Fame'}</button>
              <button type="button" onClick={() => setOpen(false)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
