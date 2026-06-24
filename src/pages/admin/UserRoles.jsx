import { useState } from 'react';
import { UserPlus, Shield } from 'lucide-react';
import { Panel } from '../../components/dashboard/widgets';
import DataTable from '../../components/dashboard/DataTable';
import AsyncState from '../../components/dashboard/AsyncState';
import Modal from '../../components/dashboard/Modal';
import { useApi } from '../../hooks/useApi';
import { api } from '../../lib/api';

const ROLE_LABEL = {
  super_admin: 'Super Admin', ops_admin: 'Operations Admin', finance_admin: 'Finance Admin',
  exhibitor: 'Exhibitor', sponsor: 'Sponsor', jury: 'Jury', visitor: 'Visitor', delegate: 'Delegate',
};
const ASSIGNABLE = ['super_admin', 'ops_admin', 'finance_admin', 'jury', 'exhibitor', 'sponsor'];

// Role-based access matrix (WRD §14.7)
const MATRIX = [
  ['Registration Management', 'Full', 'Full', 'View Only'],
  ['Exhibitor Management', 'Full', 'Full', 'Payments Only'],
  ['Sponsor Management', 'Full', 'Full', 'Payments Only'],
  ['Awards Management', 'Full', 'Full', 'No Access'],
  ['Finance Reports', 'Full', 'View Only', 'Full'],
  ['Content Management', 'Full', 'Full', 'No Access'],
  ['User & Role Management', 'Full', 'No Access', 'No Access'],
];

const cell = (v) => {
  const map = { Full: 'bg-green-100 text-green-700', 'No Access': 'bg-red-100 text-red-700', 'View Only': 'bg-sky-100 text-sky-700', 'Payments Only': 'bg-amber-100 text-amber-700' };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${map[v] || 'bg-navy-600 text-cream'}`}>{v}</span>;
};

export default function UserRoles() {
  const { data, loading, error, reload } = useApi(() => api.adminUsers());
  const rows = (data || []).map((u) => ({ ...u, roleLabel: ROLE_LABEL[u.role] || u.role }));
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ role: 'ops_admin' });
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState('');
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true); setFormErr('');
    try {
      await api.adminCreateUser(form);
      setShowAdd(false); setForm({ role: 'ops_admin' });
      reload();
    } catch (err) { setFormErr(err.message || 'Failed to create user'); }
    finally { setSaving(false); }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (r) => <span className="font-semibold text-cream">{r.name}</span> },
    { key: 'email', label: 'Email' },
    { key: 'roleLabel', label: 'Role', render: (r) => <span className="font-semibold text-gold">{r.roleLabel}</span> },
    { key: 'status', label: 'Status', render: (r) => <span className="text-green-400 text-sm font-semibold capitalize">{r.status}</span> },
  ];

  return (
    <div className="space-y-6">
      <AsyncState loading={loading} error={error}>
        <DataTable
          title={`Users (${rows.length})`}
          columns={columns}
          rows={rows}
          searchKeys={['name', 'email', 'roleLabel']}
          toolbar={<button onClick={() => setShowAdd(true)} className="btn-primary !py-2 text-sm"><UserPlus size={15} /> Add User</button>}
        />
      </AsyncState>

      {showAdd && (
        <Modal title="Add User" onClose={() => setShowAdd(false)}>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-cream/90 mb-1.5">Full Name *</label>
              <input className="field" required value={form.name || ''} onChange={(e) => setField('name', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-cream/90 mb-1.5">Email *</label>
              <input type="email" className="field" required value={form.email || ''} onChange={(e) => setField('email', e.target.value)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-cream/90 mb-1.5">Role *</label>
                <select className="field" value={form.role} onChange={(e) => setField('role', e.target.value)}>
                  {ASSIGNABLE.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-cream/90 mb-1.5">Company</label>
                <input className="field" value={form.company || ''} onChange={(e) => setField('company', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-cream/90 mb-1.5">Password</label>
              <input type="text" className="field" placeholder="Default: password123" value={form.password || ''} onChange={(e) => setField('password', e.target.value)} />
            </div>
            {formErr && <p className="text-sm text-red-400">{formErr}</p>}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">{saving ? 'Saving…' : 'Create User'}</button>
              <button type="button" onClick={() => setShowAdd(false)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      <Panel title="Role-Based Access Matrix" action={<Shield size={18} className="text-gold" />}>
        <div className="rounded-xl overflow-hidden border border-gold/20 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="bg-gold-gradient text-navy text-left">
                <th className="px-4 py-3 font-bold">Module</th>
                <th className="px-4 py-3 font-bold text-center">Super Admin</th>
                <th className="px-4 py-3 font-bold text-center">Operations</th>
                <th className="px-4 py-3 font-bold text-center">Finance</th>
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((row, i) => (
                <tr key={i} className={`border-t border-gold/10 hover:bg-gold/5 transition-colors ${i % 2 ? 'bg-navy-900/40' : 'bg-transparent'}`}>
                  <td className="px-4 py-3 font-semibold text-cream">{row[0]}</td>
                  <td className="px-4 py-3 text-center">{cell(row[1])}</td>
                  <td className="px-4 py-3 text-center">{cell(row[2])}</td>
                  <td className="px-4 py-3 text-center">{cell(row[3])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
