import { useState } from 'react';
import { Ticket, Crown, Check, QrCode, Mail, ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { Reveal } from '../components/ui/Motion';
import { INDUSTRY_SEGMENTS } from '../data/siteData';
import { api } from '../lib/api';

const TYPES = [
  { id: 'visitor', name: 'Visitor', icon: Ticket, tagline: 'General access to the exhibition floor',
    perks: ['Exhibition floor access', 'Networking lounge', 'Digital QR ticket', 'Lead exchange enabled'] },
  { id: 'delegate', name: 'Delegate', icon: Crown, premium: true, tagline: 'Premium access incl. sessions & awards',
    perks: ['Everything in Visitor', 'Structured session access', 'Awards ceremony entry', 'Priority networking & meetings'] },
];

export default function Register() {
  const [step, setStep] = useState(1);
  const [type, setType] = useState('visitor');
  const [familyTour, setFamilyTour] = useState(false);
  const [done, setDone] = useState(false);
  const [details, setDetails] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedType = TYPES.find((t) => t.id === type);
  const setField = (k, v) => setDetails((d) => ({ ...d, [k]: v }));

  const submitRegistration = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.register({
        ...details,
        reg_type: type,
        family_tour: familyTour,
      });
      setResult(res);
      setDone(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Participation Pillar"
        title="Register for IBIEA 2026"
        subtitle="Fast, mobile-friendly registration with an instant digital QR ticket."
        image="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=2000&q=80"
      />

      <section className="bg-transparent section-pad">
        <div className="container-x max-w-4xl">
          {done ? (
            <Success type={selectedType} familyTour={familyTour} result={result} />
          ) : (
            <>
              {/* Steps indicator */}
              <div className="flex items-center justify-center gap-2 mb-12">
                {['Ticket Type', 'Your Details', 'Confirm'].map((label, i) => (
                  <div key={label} className="flex items-center">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${step >= i + 1 ? 'bg-gold-gradient text-navy' : 'bg-navy-700/50 text-cream/70'}`}>
                      <span className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-xs">{i + 1}</span>
                      <span className="hidden sm:inline">{label}</span>
                    </div>
                    {i < 2 && <div className={`w-6 h-0.5 ${step > i + 1 ? 'bg-gold' : 'bg-navy-600'}`} />}
                  </div>
                ))}
              </div>

              {step === 1 && (
                <div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {TYPES.map((t, i) => (
                      <Reveal key={t.id} delay={i * 0.1}>
                        <button onClick={() => setType(t.id)}
                          className={`card-base p-7 text-left relative w-full h-full group ${type === t.id ? 'ring-2 ring-gold shadow-gold-lg' : ''}`}>
                          {t.premium && <span className="absolute top-4 right-4 text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-gold text-navy">Premium</span>}
                          <div className="icon-tile !w-14 !h-14 !rounded-2xl"><t.icon size={26} /></div>
                          <h3 className="mt-4 font-display text-xl font-bold text-cream">{t.name}</h3>
                          <p className="text-sm text-cream/70">{t.tagline}</p>
                          <ul className="mt-4 space-y-2">
                            {t.perks.map((p) => <li key={p} className="flex gap-2 text-sm text-cream/70"><Check size={16} className="text-gold shrink-0" /> {p}</li>)}
                          </ul>
                        </button>
                      </Reveal>
                    ))}
                  </div>

                  {/* Family tour add-on */}
                  <button onClick={() => setFamilyTour(!familyTour)}
                    className={`w-full mt-6 card-base p-6 flex items-center gap-4 text-left ${familyTour ? 'ring-2 ring-gold' : ''}`}>
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 ${familyTour ? 'bg-gold border-gold' : 'border-gold/20'}`}>
                      {familyTour && <Check size={16} className="text-cream" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-cream">Add the 3–4 Day Oman Family Tour</h4>
                      <p className="text-sm text-cream/70">Bring your family along — enquiry-based, our team follows up with a tailored quote.</p>
                    </div>
                  </button>

                  <div className="flex justify-end mt-8">
                    <button onClick={() => setStep(2)} className="btn-primary">Continue <ArrowRight size={18} /></button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="card-base p-7 md:p-9">
                  <h3 className="text-2xl font-bold text-cream mb-6">Your Details — {selectedType.name}</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {[
                      { name: 'name', label: 'Full Name', full: true },
                      { name: 'company', label: 'Company' },
                      { name: 'designation', label: 'Designation' },
                      { name: 'email', label: 'Email Address', type: 'email' },
                      { name: 'phone', label: 'Phone Number', type: 'tel' },
                    ].map((f) => (
                      <div key={f.name} className={f.full ? 'sm:col-span-2' : ''}>
                        <label className="block text-sm font-semibold text-cream mb-1.5">{f.label} *</label>
                        <input type={f.type || 'text'} value={details[f.name] || ''} onChange={(e) => setField(f.name, e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-transparent focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none" />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-cream mb-1.5">Industry Segment of Interest</label>
                      <select value={details.segment_id || ''} onChange={(e) => setField('segment_id', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-transparent focus:border-gold outline-none">
                        <option value="">Select…</option>
                        {INDUSTRY_SEGMENTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    {type === 'delegate' && (
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-cream mb-1.5">Dietary Requirements (for seated functions)</label>
                        <input value={details.dietary || ''} onChange={(e) => setField('dietary', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-transparent focus:border-gold outline-none" />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between mt-8">
                    <button onClick={() => setStep(1)} className="btn-ghost"><ArrowLeft size={18} /> Back</button>
                    <button onClick={() => setStep(3)} className="btn-primary">Review <ArrowRight size={18} /></button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="card-base p-7 md:p-9">
                  <h3 className="text-2xl font-bold text-cream mb-6">Confirm Your Registration</h3>
                  <div className="space-y-4">
                    <Row label="Ticket Type" value={selectedType.name} />
                    <Row label="Family Tour Add-On" value={familyTour ? 'Yes — enquiry will be raised' : 'No'} />
                    <Row label="Confirmation" value="Email" />
                  </div>
                  <div className="mt-6 p-4 rounded-xl bg-navy-700/50 text-sm text-cream/70 flex gap-3">
                    <QrCode size={20} className="text-gold shrink-0" />
                    A unique QR-coded digital ticket will be generated and sent to you on confirmation.
                  </div>
                  {error && <p className="text-sm text-red-400 mt-4">{error}</p>}
                  <div className="flex justify-between mt-8">
                    <button onClick={() => setStep(2)} className="btn-ghost"><ArrowLeft size={18} /> Back</button>
                    <button onClick={submitRegistration} disabled={loading} className="btn-primary disabled:opacity-60">
                      {loading ? <><Loader2 size={18} className="animate-spin" /> Submitting…</> : <>Complete Registration <Check size={18} /></>}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between py-3 border-b border-gold/20">
      <span className="text-cream/70">{label}</span>
      <span className="font-semibold text-cream">{value}</span>
    </div>
  );
}

function Success({ type, familyTour, result }) {
  const regCode = result?.reg_code || 'IBIEA-XXXXXX';
  // QR image from the reg code via a public QR service (swap for server-rendered later)
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(regCode)}`;
  return (
    <div className="text-center max-w-lg mx-auto">
      <CheckCircle2 size={64} className="mx-auto text-gold" />
      <h2 className="mt-5 text-3xl font-bold text-cream">You're Registered!</h2>
      <p className="mt-3 text-cream/70">Welcome to IBIEA 2026 as a {type.name}. Your digital QR ticket is on its way.</p>

      {/* Ticket */}
      <div className="mt-8 card-base p-7 text-left bg-gradient-to-br from-navy-700 to-navy-700 border-2 border-gold/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold font-bold">IBIEA 2026 · {type.name}</p>
            <p className="font-serif font-black text-2xl text-cream mt-1">Digital Pass</p>
            <p className="mt-1 text-sm font-mono text-cream/70">{regCode}</p>
          </div>
          <div className="w-20 h-20 rounded-xl bg-white p-1.5 flex items-center justify-center overflow-hidden">
            <img src={qrSrc} alt="QR ticket" className="w-full h-full object-contain" />
          </div>
        </div>
        <div className="mt-5 pt-5 border-t border-gold/30 flex gap-4 text-sm text-cream/70">
          <span className="flex items-center gap-1.5"><Mail size={15} className="text-gold" /> Ticket emailed to you</span>
        </div>
      </div>

      {familyTour && (
        <p className="mt-5 text-sm text-cream/70">Our team will contact you shortly about the Family Tour Programme.</p>
      )}
    </div>
  );
}
