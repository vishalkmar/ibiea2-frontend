import { useState, useEffect } from 'react';
import { Check, X, Crown, ArrowRight } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SectionHeading from '../components/ui/SectionHeading';
import EnquiryForm from '../components/ui/EnquiryForm';
import { Reveal } from '../components/ui/Motion';
import { SPONSOR_TIERS, BENEFITS_MATRIX } from '../data/siteData';
import { api } from '../lib/api';

export default function Sponsors() {
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [tiers, setTiers] = useState(SPONSOR_TIERS);
  useEffect(() => {
    api.sponsorTiers()
      .then((rows) => {
        if (rows && rows.length) {
          setTiers(rows.map((t) => ({ ...t, highlight: t.sort_order === 1, accent: '#D4AF37' })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Partnership Pillar"
        title="Align Your Brand with Excellence"
        subtitle="Sponsorship at IBIEA 2026 is about visibility, prestige and brand association on an international stage."
        image="https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=2000&q=80"
      />

      {/* 11.1 Packages */}
      <section className="bg-transparent section-pad">
        <div className="container-x">
          <SectionHeading center eyebrow="Sponsorship Tiers" title="Choose Your Level of Association"
            subtitle="Investment amounts are shared privately by our sponsorship team — request a proposal to begin the conversation." />
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {tiers.map((tier, i) => (
              <Reveal key={tier.id} delay={i * 0.08} className="h-full">
                <div className={`card-base p-7 flex flex-col relative h-full ${tier.highlight ? 'ring-2 ring-gold shadow-gold-lg' : ''}`}>
                  {tier.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gold text-navy text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                      <Crown size={12} /> Flagship
                    </span>
                  )}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${tier.accent}25` }}>
                    <Crown size={24} style={{ color: tier.accent }} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-cream">{tier.name}</h3>
                  <p className="mt-3 text-sm text-cream/70 flex-1">{tier.scope}</p>
                  <button onClick={() => setShowEnquiry(true)} className={`mt-6 ${tier.highlight ? 'btn-primary' : 'btn-secondary'} w-full`}>Request a Proposal</button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 11.2 Benefits Matrix */}
      <section className="bg-navy-900/40 section-pad">
        <div className="container-x">
          <SectionHeading center eyebrow="Compare Tiers" title="Benefits Matrix"
            subtitle="A clear side-by-side of what each tier delivers." />
          <div className="rounded-2xl overflow-hidden border border-gold/25 shadow-card bg-navy-800/60 backdrop-blur overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="bg-gold-gradient text-navy">
                  <th className="text-left px-6 py-4 font-bold tracking-wide">Benefit</th>
                  {BENEFITS_MATRIX.tiers.map((t) => (
                    <th key={t} className={`px-6 py-4 font-bold text-center ${t === 'Title' ? 'bg-navy text-gold' : ''}`}>{t}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BENEFITS_MATRIX.rows.map((row, i) => (
                  <tr key={row.benefit} className={`border-t border-gold/10 transition-colors hover:bg-gold/5 ${i % 2 ? 'bg-navy-900/40' : 'bg-transparent'}`}>
                    <td className="px-6 py-4 font-semibold text-cream">{row.benefit}</td>
                    {row.values.map((v, j) => (
                      <td key={j} className="px-6 py-4 text-center">
                        {v === 'Yes' ? <Check size={18} className="mx-auto text-gold" />
                          : v === 'No' ? <X size={18} className="mx-auto text-cream/30" />
                          : <span className="text-cream/80 font-medium">{v}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 11.3 Registration */}
      <section className="bg-transparent section-pad">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading eyebrow="Become a Sponsor" title="Start the Conversation"
              subtitle="Share your details and preferred tier. Our sponsorship team will follow up directly with a tailored proposal." />
            <ul className="space-y-3">
              {['Bespoke packages & co-branding', 'Milestone-based payment options', 'Dedicated account management', 'Branding deliverables tracking'].map((t) => (
                <li key={t} className="flex gap-3 text-cream/70"><Check size={20} className="text-gold shrink-0" /> {t}</li>
              ))}
            </ul>
          </div>
          <EnquiryForm
            kind="sponsor"
            title="Request a Sponsorship Proposal"
            subtitle="No public pricing — we'll share tier details privately."
            submitLabel="Talk to Our Team"
            extraFields={[
              { name: 'tier', label: 'Preferred Tier', type: 'select', options: SPONSOR_TIERS.map((t) => t.name), full: true },
              { name: 'branding', label: 'Branding Requirements / Notes', type: 'textarea', full: true },
            ]}
          />
        </div>
      </section>

      {showEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/90 backdrop-blur-md overflow-y-auto" onClick={() => setShowEnquiry(false)}>
          <div className="w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <EnquiryForm
              kind="sponsor"
              title="Request a Sponsorship Proposal"
              subtitle="Our team will share tier pricing and tailored terms privately."
              submitLabel="Request a Proposal"
              extraFields={[
                { name: 'tier', label: 'Preferred Tier', type: 'select', options: SPONSOR_TIERS.map((t) => t.name), full: true },
                { name: 'branding', label: 'Branding Requirements / Notes', type: 'textarea', full: true },
              ]}
            />
          </div>
        </div>
      )}
    </>
  );
}
