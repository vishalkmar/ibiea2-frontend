import { Link } from 'react-router-dom';
import { Target, Award, Building2, Plane, MapPin, FileText, Download, ArrowRight, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SectionHeading from '../components/ui/SectionHeading';
import { EVENT } from '../data/siteData';

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About the Event"
        title="Oman's Flagship Real Estate Business & Awards Platform"
        subtitle={`${EVENT.fullName} — the flagship yearly event of ${EVENT.parentBrand}.`}
        image="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=80"
      />

      {/* 9.1 Story & Mission */}
      <section className="bg-transparent section-pad">
        <div className="container-x grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <SectionHeading eyebrow="Our Story" title="Why IBIEA Exists" />
            <div className="space-y-4 text-cream/70 leading-relaxed">
              <p>IBIEA 2026 is conceived as an international-grade business event combining two co-located activities under one banner: the <strong className="text-cream">IBIEA Business Expo</strong> and the <strong className="text-cream">IBIEA Awards Function</strong> — an exhibition floor and a formal recognition ceremony running side by side.</p>
              <p>Hosted in the Sultanate of Oman, IBIEA reflects the nation's rising position as a regional hub for real estate investment, tourism development, and cross-border business between the Gulf, the Indian subcontinent, and East Africa.</p>
              <p>Rather than a one-off event, IBIEA is a recurring flagship platform — returning each year under a fresh annual theme that keeps it commercially and editorially relevant.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Building2, label: 'Business Expo', text: 'A curated exhibition floor for the real estate value chain.' },
              { icon: Award, label: 'Awards Function', text: 'A formal ceremony recognising industry excellence.' },
              { icon: Target, label: 'Networking', text: 'Structured sessions, matchmaking and meetings.' },
              { icon: Plane, label: 'Family Tour', text: 'An optional Oman tour for accompanying families.' },
            ].map((b) => (
              <div key={b.label} className="card-base p-6">
                <b.icon size={28} className="text-gold" />
                <h3 className="mt-3 font-bold text-cream">{b.label}</h3>
                <p className="mt-1 text-sm text-cream/70">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9.2 Organizer Credibility */}
      <section className="bg-navy-900/40 section-pad">
        <div className="container-x">
          <SectionHeading center eyebrow="Organizer Credibility"
            title={`A ${EVENT.parentBrand} Flagship Event`}
            subtitle={`IBIEA is the cornerstone property in ${EVENT.parentBrand}'s events portfolio — returning each year with a fresh annual theme.`} />
          <div className="card-base p-8 md:p-12 max-w-4xl mx-auto text-center">
            <div className="font-serif font-black text-4xl text-gold">{EVENT.parentBrand}</div>
            <p className="mt-4 text-cream/70 leading-relaxed max-w-2xl mx-auto">
              {EVENT.parentBrand} brings a track record of delivering credible international business
              platforms. IBIEA is its flagship yearly event, designed to run on the same trusted
              platform year on year while each edition spotlights a new theme.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gold/15 border border-gold/30">
              <Award className="text-gold" />
              <p className="text-left text-sm">
                <span className="font-bold text-cream">2026 Theme — {EVENT.theme2026}.</span>
                <span className="text-cream/70"> A year placing developers, investors and project buyers at centre stage.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9.3 Why Attend / Why Exhibit */}
      <section className="bg-transparent section-pad">
        <div className="container-x grid md:grid-cols-2 gap-8">
          <div className="card-base p-8 border-t-4 border-gold">
            <h3 className="text-2xl font-bold text-cream">Why Attend</h3>
            <ul className="mt-5 space-y-3">
              {['Access to 150+ exhibitors across 11 segments', 'Direct deal-flow with developers & investors', 'Keynote insight from industry leaders', 'Structured networking & AI matchmaking'].map((t) => (
                <li key={t} className="flex gap-3 text-cream/70"><CheckCircle2 size={20} className="text-gold shrink-0" /> {t}</li>
              ))}
            </ul>
            <Link to="/register" className="btn-secondary mt-7">Register to Attend <ArrowRight size={16} /></Link>
          </div>
          <div className="card-base p-8 border-t-4 border-gold-deep">
            <h3 className="text-2xl font-bold text-cream">Why Exhibit</h3>
            <ul className="mt-5 space-y-3">
              {['Qualified leads from a premium audience', 'Brand visibility on an international stage', 'Developer Projects Showcase for 2026', 'Lead scanning & post-event reporting tools'].map((t) => (
                <li key={t} className="flex gap-3 text-cream/70"><CheckCircle2 size={20} className="text-gold shrink-0" /> {t}</li>
              ))}
            </ul>
            <Link to="/exhibitors" className="btn-secondary mt-7">Explore Packages <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* 9.4 Venue & Logistics */}
      <section className="bg-navy-900/40 section-pad">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading eyebrow="Venue & Logistics" title="Getting to IBIEA 2026" />
            <div className="space-y-4">
              {[
                { icon: MapPin, label: 'Venue', value: `${EVENT.venue}, ${EVENT.city}` },
                { icon: Plane, label: 'Nearest Airport', value: 'Muscat International Airport (MCT)' },
                { icon: Building2, label: 'Accommodation', value: 'Recommended partner hotels to be announced' },
                { icon: FileText, label: 'Visa', value: 'e-Visa / visa-on-arrival guidance for international guests' },
              ].map((row) => (
                <div key={row.label} className="flex gap-4 items-start card-base p-5">
                  <row.icon className="text-gold shrink-0" />
                  <div>
                    <p className="font-bold text-cream text-sm">{row.label}</p>
                    <p className="text-cream/70 text-sm">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-card h-80 lg:h-full min-h-[320px] bg-navy-900">
            <iframe
              title="Oman map"
              className="w-full h-full"
              src="https://www.openstreetmap.org/export/embed.html?bbox=58.0,23.4,58.7,23.7&layer=mapnik"
              style={{ border: 0, filter: 'sepia(0.3) saturate(1.1)' }}
            />
          </div>
        </div>
      </section>

      {/* 9.5 Press & Media Kit */}
      <section className="bg-navy-900 section-pad">
        <div className="container-x text-center">
          <p className="eyebrow text-gold mb-3">Press & Media</p>
          <h2 className="text-3xl md:text-4xl font-bold text-cream">Media Kit & Resources</h2>
          <p className="mt-4 text-cream/70 max-w-xl mx-auto">Logo files, official event description, key statistics and media contact details — everything press partners need.</p>
          <button className="btn-primary mt-8"><Download size={18} /> Download Press Kit</button>
        </div>
      </section>
    </>
  );
}
