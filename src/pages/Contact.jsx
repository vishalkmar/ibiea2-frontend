import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageCircle, Loader2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { Reveal } from '../components/ui/Motion';
import { EVENT } from '../data/siteData';
import { api } from '../lib/api';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.enquiry({ kind: 'contact', name: form.name, email: form.email, subject: form.subject, message: form.message });
      setSent(true);
    } catch (err) { setError(err.message || 'Could not send. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <PageHeader
        eyebrow="Get in Touch"
        title="Contact the IBIEA Team"
        subtitle="Questions about exhibiting, sponsoring, awards or attending? We're here to help."
        image="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=2000&q=80"
      />

      <section className="bg-transparent section-pad">
        <div className="container-x grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="text-3xl font-bold text-cream">Let's Talk</h2>
            <div className="gold-divider mt-4 mb-8" />
            <div className="space-y-5">
              {[
                { icon: MapPin, label: 'Location', value: EVENT.city },
                { icon: Mail, label: 'Email', value: EVENT.contactEmail, href: `mailto:${EVENT.contactEmail}` },
                { icon: Phone, label: 'Phone', value: EVENT.contactPhone, href: `tel:${EVENT.contactPhone}` },
                { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with our team', href: '#' },
              ].map((c, i) => (
                <Reveal key={c.label} delay={i * 0.07}>
                  <a href={c.href || '#'} className="card-base p-5 flex items-center gap-4 group">
                    <div className="icon-tile shrink-0 !w-12 !h-12"><c.icon size={22} /></div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-cream/70 font-semibold">{c.label}</p>
                      <p className="font-bold text-cream">{c.value}</p>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Form */}
          <Reveal delay={0.1}>
          <div className="card-base p-7 md:p-9">
            {sent ? (
              <div className="text-center py-12">
                <CheckCircle2 size={56} className="mx-auto text-gold" />
                <h3 className="mt-4 text-2xl font-bold text-cream">Message Sent</h3>
                <p className="mt-2 text-cream/70">Thank you for reaching out. We'll respond shortly.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-5">
                <h3 className="text-2xl font-bold text-cream">Send a Message</h3>
                {[
                  { name: 'name', label: 'Full Name' },
                  { name: 'email', label: 'Email Address', type: 'email' },
                  { name: 'subject', label: 'Subject' },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm font-semibold text-cream mb-1.5">{f.label} *</label>
                    <input type={f.type || 'text'} required value={form[f.name] || ''} onChange={(e) => setField(f.name, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-transparent focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-cream mb-1.5">Message *</label>
                  <textarea required rows={5} value={form.message || ''} onChange={(e) => setField('message', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-transparent focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none" />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto disabled:opacity-60">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : <>Send Message <Send size={16} /></>}
                </button>
              </form>
            )}
          </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
