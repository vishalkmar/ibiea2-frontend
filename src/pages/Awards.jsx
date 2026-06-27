import { useState } from 'react';
import { Award, Clock, FileCheck, Gavel, Trophy, ArrowRight, Send, CheckCircle2, Loader2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SectionHeading from '../components/ui/SectionHeading';
import { Reveal } from '../components/ui/Motion';
import { AWARD_CATEGORIES } from '../data/siteData';
import { api } from '../lib/api';

const PROCESS = [
  { icon: FileCheck, title: 'Nominate', desc: 'Submit a self or third-party nomination via a category-specific form.' },
  { icon: Gavel, title: 'Jury Review', desc: 'An expert jury scores nominations against published criteria.' },
  { icon: Clock, title: 'Shortlist', desc: 'Aggregated scores produce a ranked shortlist per category.' },
  { icon: Trophy, title: 'Winners', desc: 'Winners are announced at the Gala and enter the Hall of Fame.' },
];

export default function Awards() {
  const [selectedCat, setSelectedCat] = useState(null);

  // Group categories preserving order; themed group first
  const groups = AWARD_CATEGORIES.reduce((acc, c) => {
    (acc[c.group] = acc[c.group] || []).push(c);
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        eyebrow="Recognition Pillar"
        title="The IBIEA Awards 2026"
        subtitle="Honouring the developers, projects and innovators defining the future of real estate."
        image="https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=2000&q=80"
      />

      {/* Process */}
      <section className="bg-transparent section-pad">
        <div className="container-x">
          <SectionHeading center eyebrow="How It Works" title="The Awards Journey" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="card-base p-6 text-center relative h-full group">
                  <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gold-gradient text-navy text-sm font-bold flex items-center justify-center">{i + 1}</span>
                  <div className="icon-tile mx-auto !rounded-2xl"><p.icon size={26} /></div>
                  <h3 className="mt-4 font-display font-bold text-lg text-cream">{p.title}</h3>
                  <p className="mt-2 text-sm text-cream/70">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-navy-900/40 section-pad">
        <div className="container-x">
          <SectionHeading center eyebrow="Award Categories" title="Recognising Excellence Across the Board"
            subtitle="For 2026, developer-led categories take centre stage, followed by industry and special recognition awards." />
          <div className="space-y-12">
            {Object.entries(groups).map(([group, cats]) => (
              <div key={group}>
                <h3 className="font-serif font-bold text-2xl text-gold mb-6 flex items-center gap-3">
                  <span className="gold-divider" /> {group}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cats.map((cat, i) => (
                    <Reveal key={cat.id} delay={(i % 3) * 0.07}>
                      <button onClick={() => setSelectedCat(cat)}
                        className="group relative w-full text-left rounded-2xl overflow-hidden h-60 border border-gold/15 hover:border-gold/50 transition-all duration-300 shadow-card">
                        <img src={cat.img} alt={cat.name} loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/15" />
                        {cat.themed && <span className="absolute top-3 right-3 text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-gold text-navy">2026</span>}
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                          <div className="w-11 h-11 rounded-full bg-gold flex items-center justify-center text-navy mb-3 shadow-gold"><Award size={20} /></div>
                          <h4 className="font-display font-bold text-lg text-gold">{cat.name}</h4>
                          <p className="mt-1.5 text-sm text-cream/80 leading-relaxed line-clamp-2">{cat.desc}</p>
                          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gold group-hover:gap-2 transition-all">Nominate <ArrowRight size={14} /></span>
                        </div>
                      </button>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nomination CTA / deadline */}
      <section className="bg-navy-900 section-pad">
        <div className="container-x text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 border border-gold/40 text-gold-light text-sm font-semibold mb-5">
            <Clock size={15} /> Nomination Deadline — To Be Announced
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-cream max-w-2xl mx-auto">Ready to Be Recognised?</h2>
          <p className="mt-4 text-cream/70 max-w-xl mx-auto">Submit a nomination for yourself or a peer. Self and third-party nominations are both welcome.</p>
          <button onClick={() => setSelectedCat(AWARD_CATEGORIES[0])} className="btn-primary mt-8">Start a Nomination <ArrowRight size={18} /></button>
        </div>
      </section>

      {selectedCat && <NominationModal category={selectedCat} onClose={() => setSelectedCat(null)} />}
    </>
  );
}

function NominationModal({ category, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState('self');
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.nominate({
        category_id: category.id,
        nominee: form.nominee,
        email: form.email,
        phone: form.phone,
        nom_type: type === 'self' ? 'self' : 'third_party',
        submission: form.submission,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/90 backdrop-blur-md overflow-y-auto" onClick={onClose}>
      <div className="bg-navy-800 border border-gold/25 rounded-2xl shadow-card-hover w-full max-w-2xl my-8 p-7 md:p-9 relative" onClick={(e) => e.stopPropagation()}>
        <span className="absolute top-0 inset-x-0 h-[3px] bg-gold-gradient rounded-t-2xl" />
        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle2 size={56} className="mx-auto text-gold" />
            <h3 className="mt-4 text-2xl font-bold text-cream">Nomination Submitted</h3>
            <p className="mt-2 text-cream/70">A confirmation email with next steps and key dates is on its way.</p>
            <button onClick={onClose} className="btn-primary mt-6">Close</button>
          </div>
        ) : (
          <>
            <p className="eyebrow mb-1">Nomination Form</p>
            <h3 className="text-2xl font-bold text-cream">{category.name}</h3>
            <p className="mt-1 text-sm text-cream/70">{category.desc}</p>

            <div className="flex gap-3 mt-5">
              {[['self', 'Self-Nomination'], ['third', 'Nominate Someone']].map(([v, l]) => (
                <button key={v} onClick={() => setType(v)} className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition ${type === v ? 'border-gold bg-gold/10 text-gold' : 'border-gold/20 text-cream/70'}`}>{l}</button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid sm:grid-cols-2 gap-5">
              {[
                { name: 'nominee', label: type === 'self' ? 'Your Name / Company' : 'Nominee Name / Company', full: true },
                { name: 'email', label: 'Email Address', type: 'email' },
                { name: 'phone', label: 'Phone Number', type: 'tel' },
              ].map((f) => (
                <div key={f.name} className={f.full ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-semibold text-cream mb-1.5">{f.label} *</label>
                  <input type={f.type || 'text'} required value={form[f.name] || ''} onChange={(e) => setField(f.name, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-transparent focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none" />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-cream mb-1.5">Submission — address the judging criteria *</label>
                <textarea required rows={4} value={form.submission || ''} onChange={(e) => setField('submission', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-transparent focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-cream mb-1.5">Supporting attachments</label>
                <input type="file" multiple className="w-full text-sm text-cream/70 file:mr-3 file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-navy-700/50 file:text-cream file:font-semibold" />
              </div>
              {error && <p className="sm:col-span-2 text-sm text-red-400">{error}</p>}
              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-60">
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : <>Submit Nomination <Send size={16} /></>}
                </button>
                <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
