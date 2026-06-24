import { useState } from 'react';
import { Check, X, Loader2, Plus } from 'lucide-react';
import { StatCard, Panel, StatusBadge } from '../../components/dashboard/widgets';
import DataTable from '../../components/dashboard/DataTable';
import AsyncState from '../../components/dashboard/AsyncState';
import Modal from '../../components/dashboard/Modal';
import { useApi } from '../../hooks/useApi';
import { api } from '../../lib/api';
import { openCashfreeCheckout } from '../../lib/cashfree';

export default function FinanceReports({ role }) {
  const canVerify = role !== 'ops'; // finance + super can verify; ops view-only
  const { data, loading, error, reload } = useApi(() => api.adminFinance());
  const [busy, setBusy] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const omr = (n) => `OMR ${Number(n || 0).toLocaleString()}`;

  const txns = (data?.txns || []).map((t) => ({
    ...t,
    amountLabel: `${t.currency} ${Number(t.amount).toLocaleString()}`,
    statusLabel: t.status === 'pending_verification' ? 'pending verification' : t.status,
  }));
  const totals = data?.totals || {};

  const verify = async (ref, action) => {
    setBusy(ref + action);
    try { await api.adminVerifyPayment(ref, action); reload(); }
    catch (err) { alert(err.message); }
    finally { setBusy(null); }
  };

  const columns = [
    { key: 'ref', label: 'Txn Ref', render: (r) => <span className="font-semibold text-cream">{r.ref}</span> },
    { key: 'module', label: 'Module', render: (r) => <span className="capitalize">{r.module}</span> },
    { key: 'method', label: 'Method', render: (r) => <span className="capitalize">{r.method.replace('_', ' ')}</span> },
    { key: 'amountLabel', label: 'Amount', render: (r) => <span className="font-semibold text-cream">{r.amountLabel}</span> },
    { key: 'statusLabel', label: 'Status', render: (r) => <StatusBadge status={r.statusLabel} /> },
    { key: 'actions', label: 'Actions', render: (r) => (
      r.status === 'pending_verification' && canVerify ? (
        <div className="flex gap-2">
          <button onClick={() => verify(r.ref, 'approve')} disabled={busy} className="w-7 h-7 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center hover:bg-green-500/30" title="Approve">
            {busy === r.ref + 'approve' ? <Loader2 size={13} className="animate-spin" /> : <Check size={14} />}
          </button>
          <button onClick={() => verify(r.ref, 'reject')} disabled={busy} className="w-7 h-7 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30" title="Reject">
            <X size={14} />
          </button>
        </div>
      ) : <span className="text-cream/40 text-xs">—</span>
    )},
  ];

  return (
    <div className="space-y-6">
      {role === 'ops' && <p className="text-sm text-amber-300 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-lg">Operations Admin has view-only access to finance reports.</p>}
      <AsyncState loading={loading} error={error}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard icon="DollarSign" label="Total Collected" value={omr(totals.collected)} accentClass="text-green-400 bg-green-500/15" />
          <StatCard icon="CreditCard" label="Outstanding" value={omr(totals.outstanding)} accentClass="text-amber-300 bg-amber-500/15" />
          <StatCard icon="Download" label="Via Cashfree" value={omr(totals.cashfree)} />
          <StatCard icon="Landmark" label="Via Bank Transfer" value={omr(totals.bank_transfer)} />
        </div>

        <DataTable
          title={`Transactions (${txns.length})`}
          columns={columns}
          rows={txns}
          searchKeys={['ref', 'module']}
          onExport={() => {}}
          toolbar={canVerify && <button onClick={() => setShowNew(true)} className="btn-primary !py-2 text-sm"><Plus size={15} /> New Payment</button>}
        />
      </AsyncState>

      {showNew && <NewPaymentModal onClose={() => setShowNew(false)} onDone={reload} />}
    </div>
  );
}

function NewPaymentModal({ onClose, onDone }) {
  const { data: exhibitors } = useApi(() => api.adminExhibitors());
  const { data: sponsors } = useApi(() => api.adminSponsors());
  const [form, setForm] = useState({ module: 'exhibitor', method: 'cashfree', currency: 'INR' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [created, setCreated] = useState(null);
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const entities = form.module === 'exhibitor' ? (exhibitors || []) : form.module === 'sponsor' ? (sponsors || []) : [];

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    try {
      if (form.method === 'cashfree') {
        const order = await api.createCashfreeOrder({
          module: form.module, entity_id: form.entity_id || null,
          amount: Number(form.amount), currency: form.currency || 'INR',
        });
        setCreated(order);
      } else {
        await api.createBankTransfer({ module: form.module, entity_id: form.entity_id || null, amount: Number(form.amount), currency: 'OMR' });
        onDone(); onClose();
      }
    } catch (er) { setErr(er.message || 'Failed'); }
    finally { setBusy(false); }
  };

  const pay = async () => {
    setErr('');
    try {
      const cfg = await api.paymentConfig();
      await openCashfreeCheckout(created.paymentSessionId, cfg.mode);
      // Poll status after checkout closes
      const status = await api.paymentStatus(created.ref);
      onDone();
      if (status.status === 'paid') { alert('Payment successful — booking confirmed.'); onClose(); }
    } catch (er) { setErr(er.message || 'Checkout error'); }
  };

  return (
    <Modal title="New Payment" onClose={onClose}>
      {created ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-navy-900/40 border border-gold/15">
            <p className="text-sm text-cream/70">Cashfree order created (TEST mode)</p>
            <p className="font-mono text-gold mt-1">{created.ref}</p>
          </div>
          <p className="text-sm text-cream/70">Open the secure checkout to complete payment. Use Cashfree test cards in sandbox.</p>
          {err && <p className="text-sm text-red-400">{err}</p>}
          <div className="flex gap-3">
            <button onClick={pay} className="btn-primary flex-1">Open Checkout</button>
            <button onClick={() => { onDone(); onClose(); }} className="btn-ghost">Done</button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-cream/90 mb-1.5">Module</label>
              <select className="field" value={form.module} onChange={(e) => setField('module', e.target.value)}>
                <option value="exhibitor">Exhibitor</option>
                <option value="sponsor">Sponsor</option>
                <option value="registration">Registration</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-cream/90 mb-1.5">Method</label>
              <select className="field" value={form.method} onChange={(e) => setField('method', e.target.value)}>
                <option value="cashfree">Cashfree (card/UPI/net-banking)</option>
                <option value="bank_transfer">Bank Transfer (manual)</option>
              </select>
            </div>
          </div>
          {entities.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-cream/90 mb-1.5">{form.module === 'exhibitor' ? 'Exhibitor' : 'Sponsor'}</label>
              <select className="field" value={form.entity_id || ''} onChange={(e) => setField('entity_id', e.target.value)}>
                <option value="">Select…</option>
                {entities.map((en) => <option key={en.id} value={en.id}>{en.company}</option>)}
              </select>
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-cream/90 mb-1.5">Agreed Amount *</label>
              <input type="number" min="1" step="0.01" className="field" required value={form.amount || ''} onChange={(e) => setField('amount', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-cream/90 mb-1.5">Currency</label>
              <select className="field" value={form.currency} onChange={(e) => setField('currency', e.target.value)} disabled={form.method === 'bank_transfer'}>
                <option value="INR">INR (Cashfree test)</option>
                <option value="OMR">OMR</option>
              </select>
            </div>
          </div>
          {err && <p className="text-sm text-red-400">{err}</p>}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={busy} className="btn-primary flex-1 disabled:opacity-60">{busy ? 'Creating…' : form.method === 'cashfree' ? 'Create Order' : 'Record Transfer'}</button>
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          </div>
        </form>
      )}
    </Modal>
  );
}
