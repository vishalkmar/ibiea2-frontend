import { useState } from 'react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

// Generic enquiry / quote-request form. No pricing — routes to sales team (per WRD).
// `kind` maps to the backend enquiry type (exhibitor|sponsor|family_tour|contact|developer_showcase).
export default function EnquiryForm({ title = 'Request a Quote', subtitle, extraFields = [], submitLabel = 'Submit Enquiry', kind = 'contact' }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.enquiry({ kind, ...form });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="card-base p-10 text-center">
        <CheckCircle2 size={56} className="mx-auto text-gold" />
        <h3 className="mt-4 font-display text-2xl font-bold text-cream">Enquiry Received</h3>
        <p className="mt-2 text-cream/60">
          Thank you. Our team will be in touch shortly with the details you requested.
        </p>
      </div>
    );
  }

  const base = [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'company', label: 'Company', type: 'text', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
  ];
  const fields = [...base, ...extraFields];

  return (
    <div className="card-base p-7 md:p-9">
      <h3 className="font-display text-2xl font-bold text-cream">{title}</h3>
      {subtitle && <p className="mt-2 text-cream/60 text-sm">{subtitle}</p>}
      <form onSubmit={handleSubmit} className="mt-6 grid sm:grid-cols-2 gap-5">
        {fields.map((f) => (
          <div key={f.name} className={f.full ? 'sm:col-span-2' : ''}>
            <label className="block text-sm font-semibold text-cream/90 mb-1.5">{f.label}{f.required && ' *'}</label>
            {f.type === 'textarea' ? (
              <textarea name={f.name} required={f.required} rows={4} onChange={handleChange} className="field" />
            ) : f.type === 'select' ? (
              <select name={f.name} required={f.required} onChange={handleChange} className="field">
                <option value="">Select…</option>
                {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input name={f.name} type={f.type} required={f.required} onChange={handleChange} className="field" />
            )}
          </div>
        ))}
        <div className="sm:col-span-2">
          {error && <p className="text-sm text-red-400 mb-3">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto disabled:opacity-60">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : <>{submitLabel} <Send size={16} /></>}
          </button>
        </div>
      </form>
    </div>
  );
}
