import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import {
  ChevronDown, ArrowRight, Calendar, MapPin, Clock, Download, Award, Users,
  Quote, Plus, Minus, Star, ExternalLink, Play, Phone, Mail, Navigation, Check, Loader2,
} from 'lucide-react';
import {
  EVENT, HERO_CTAS, HIGHLIGHT_STATS, WHY_ATTEND, WHY_EXHIBIT, INDUSTRY_SEGMENTS,
  AWARD_CATEGORIES, SPEAKERS, SPONSOR_CATEGORIES, PREVIOUS_STATS,
  GALLERY, TESTIMONIALS, FAQS,
} from '../data/siteData';
import StatCounter from '../components/ui/StatCounter';
import SectionHeading from '../components/ui/SectionHeading';
import DynamicIcon from '../components/ui/DynamicIcon';
import { Reveal } from '../components/ui/Motion';
import { StatBarChart, DonutStat, HBarChart } from '../components/ui/Charts';
import Countdown from '../components/ui/StateCard';

/* ---------- 1. HERO (premium Dubai real-estate) ---------- */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background — Dubai skyline */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2400&q=80')" }} />
        {/* Keep image visible: light top, fade to navy at the bottom + soft side vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/55 via-navy-900/35 to-navy-900" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(8,18,47,0.65) 100%)' }} />
        <div className="absolute inset-0 hero-glow" />
        <div className="absolute inset-0 lux-dots opacity-15" />
      </div>

      <div className="container-x relative z-10 text-center pt-28 pb-24">
        {/* Eyebrow badge */}
        <p className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-gold/40 text-gold text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-sm animate-fade-in-up">
          <Star size={14} /> International Business &amp; Infrastructure Expo &amp; Awards
        </p>

        {/* Brand */}
        <h1 className="font-display font-black text-cream leading-none mt-7 animate-fade-in-up text-6xl sm:text-7xl lg:text-8xl xl:text-9xl" style={{ animationDelay: '0.08s' }}>
          IBIEA <span className="gold-shine">2.0</span>
        </h1>

        <div className="gold-divider mx-auto mt-6 animate-fade-in-up" style={{ animationDelay: '0.14s' }} />

        {/* Purpose headline */}
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-cream mt-6 max-w-4xl mx-auto leading-snug animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Building the Future of <span className="text-gradient-gold">Real Estate</span> &amp; Infrastructure
        </h2>

        {/* Tagline */}
        <p className="mt-5 text-base md:text-lg text-cream/75 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.26s' }}>
          {EVENT.tagline}
        </p>

        {/* Meta pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in-up" style={{ animationDelay: '0.32s' }}>
          {[
            { icon: Calendar, text: EVENT.dates },
            { icon: MapPin, text: EVENT.city },
            { icon: Clock, text: EVENT.time },
          ].map((m, i) => (
            <div key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-gold/20 backdrop-blur-sm text-cream">
              <m.icon size={16} className="text-gold" />
              <span className="font-semibold text-sm">{m.text}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-3 mt-9 animate-fade-in-up" style={{ animationDelay: '0.38s' }}>
          {HERO_CTAS.map((c) => (
            <Link key={c.label} to={c.to} className={c.primary ? 'btn-primary' : 'btn-secondary !backdrop-blur-sm'}>
              {c.label} {c.primary && <ArrowRight size={18} />}
            </Link>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold/70 animate-bounce">
        <ChevronDown size={28} />
      </div>
    </section>
  );
}

/* ---------- 2. COUNTDOWN — now imported from components/ui/StateCard.jsx ---------- */

/* ---------- 3. EVENT HIGHLIGHTS (recharts + motion) ---------- */
function Highlights() {
  return (
    <section className="section-pad relative overflow-hidden bg-navy-900">
      {/* Dubai skyline backdrop (faint) */}
      <div className="absolute inset-0 bg-cover bg-center opacity-[0.12]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=2000&q=80')" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-900/70 to-navy-900" />
      <div className="absolute inset-0 lux-pattern" />

      <div className="container-x relative z-10">
        <SectionHeading center eyebrow="Event Highlights" title="IBIEA 2.0 By The Numbers"
          subtitle="A premium convergence of the entire real estate and infrastructure ecosystem." />

        <Reveal>
          <div className="rounded-3xl border border-gold/15 bg-navy-800/40 backdrop-blur-sm shadow-card p-5 sm:p-8">
            <StatBarChart data={HIGHLIGHT_STATS} height={340} balanced />
          </div>
        </Reveal>

        <div className="text-center mt-12">
          <Link to="/register" className="btn-primary">Join the Biggest Real Estate Gathering <ArrowRight size={18} /></Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- 5 & 6. WHY ATTEND / EXHIBIT ---------- */
function WhyCards({ eyebrow, title, items, ctas }) {
  return (
    <section className="section-pad">
      <div className="container-x">
        <SectionHeading center eyebrow={eyebrow} title={title} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={(i % 5) * 0.06}>
              <div className="card-base p-6 h-full text-center group relative overflow-hidden">
                <span className="absolute top-0 inset-x-0 h-[3px] bg-gold-gradient scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                <div className="icon-tile mx-auto"><DynamicIcon name={it.icon} size={26} /></div>
                <h3 className="mt-4 font-display font-bold text-lg text-cream">{it.title}</h3>
                <p className="mt-2 text-sm text-cream/60 leading-relaxed">{it.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          {ctas.map((c) => (
            <Link key={c.label} to={c.to} className={c.primary ? 'btn-primary' : 'btn-secondary'}>{c.label}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 7. EXPO CATEGORIES (photo cards) ---------- */
function ExpoCategories() {
  return (
    <section className="section-pad bg-navy-900/50">
      <div className="container-x">
        <SectionHeading center eyebrow="Expo Categories" title="Who Exhibits at IBIEA 2.0"
          subtitle="Eleven industry segments across the entire built-environment value chain." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {INDUSTRY_SEGMENTS.map((seg, i) => (
            <Reveal key={seg.id} delay={(i % 4) * 0.06}>
              <Link to={`/exhibitors?segment=${seg.id}`}
                className="group block relative rounded-2xl overflow-hidden h-60 border border-gold/15 hover:border-gold/50 transition-all duration-300 shadow-card">
                <img src={seg.img} alt={seg.name} loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/55 to-navy-900/10" />
                {seg.featured && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-gold text-navy">2026 Focus</span>
                )}
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <div className="w-10 h-10 rounded-lg bg-gold/20 backdrop-blur border border-gold/40 flex items-center justify-center text-gold mb-2.5">
                    <DynamicIcon name={seg.icon} size={20} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-cream group-hover:text-gold transition-colors">{seg.name}</h3>
                  <p className="text-xs text-cream/70 mt-1 leading-relaxed line-clamp-2">{seg.desc}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/exhibitors" className="btn-primary">Explore Exhibition Opportunities <ArrowRight size={18} /></Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- 8. AWARD CATEGORIES (photo cards) ---------- */
const AWARD_IMAGES = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80',
];

function Awards() {
  const featured = AWARD_CATEGORIES.slice(0, 6).map((c, i) => ({ ...c, img: AWARD_IMAGES[i] }));
  return (
    <section className="section-pad relative overflow-hidden">
      <div className="absolute inset-0 lux-pattern" />
      <div className="container-x relative z-10">
        <SectionHeading center eyebrow="Awards" title="Celebrating Excellence"
          subtitle="Honouring the developers, designers and innovators raising the industry standard." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((cat, i) => (
            <Reveal key={cat.id} delay={(i % 3) * 0.06}>
              <div className="group relative rounded-2xl overflow-hidden h-64 border border-gold/15 hover:border-gold/50 transition-all duration-300 shadow-card">
                <img src={cat.img} alt={cat.name} loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-navy-900/20" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="w-11 h-11 rounded-full bg-gold flex items-center justify-center text-navy mb-3 shadow-gold">
                    <Award size={20} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-gold">{cat.name}</h3>
                  <p className="mt-1.5 text-sm text-cream/80 leading-relaxed">{cat.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <Link to="/awards" className="btn-primary">Submit Nomination <ArrowRight size={18} /></Link>
          <Link to="/awards" className="btn-secondary">View Award Criteria</Link>
          <Link to="/sponsors" className="btn-secondary">Become an Award Partner</Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- 9. SPEAKERS ---------- */
function Speakers() {
  return (
    <section className="section-pad bg-navy-900/50">
      <div className="container-x">
        <SectionHeading center eyebrow="Featured Speakers" title="Voices of the Industry"
          subtitle="Keynote leaders, panellists and session hosts shaping the conversation." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPEAKERS.map((sp, i) => (
            <Reveal key={i} delay={(i % 4) * 0.06}>
              <div className="card-base p-6 text-center h-full">
                <div className="w-28 h-28 mx-auto rounded-full bg-navy-600 border-2 border-gold flex items-center justify-center overflow-hidden">
                  <Users size={44} className="text-gold/50" />
                </div>
                <h3 className="mt-4 font-bold text-cream">{sp.name}</h3>
                <p className="text-sm text-gold">{sp.role}</p>
                <p className="text-sm text-cream/60">{sp.company}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="text-center mt-12"><Link to="/about" className="btn-secondary">View All Speakers <ArrowRight size={16} /></Link></div>
      </div>
    </section>
  );
}

/* ---------- 10. SPONSORS & PARTNERS (pitch + photo + CTAs) ---------- */
const SPONSOR_BENEFITS = [
  { icon: 'Users', title: 'Premium Audience', desc: 'Reach 300+ delegates, 150+ exhibitors, investors & decision-makers.' },
  { icon: 'Star', title: 'Stage & Branding', desc: 'Headline visibility across the stage, signage and digital channels.' },
  { icon: 'Trophy', title: 'Award Association', desc: 'Co-brand award categories and share the spotlight with winners.' },
  { icon: 'Megaphone', title: 'Year-Round Reach', desc: 'Logo placement, social features and pre/post-event campaigns.' },
];

function Sponsors() {
  const [sponsors, setSponsors] = useState([]);
  useEffect(() => { api.publicSponsors().then((r) => setSponsors(r || [])).catch(() => {}); }, []);

  return (
    <section className="section-pad relative overflow-hidden">
      <div className="absolute inset-0 lux-pattern" />
      <div className="container-x relative z-10">
        <SectionHeading center eyebrow="Sponsors & Partners" title="Partner with Prestige"
          subtitle="Align your brand with the region's premier real estate business, infrastructure & awards platform." />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Photo */}
          <Reveal>
            <div className="relative rounded-2xl overflow-hidden border border-gold/20 shadow-card h-80 lg:h-[26rem]">
              <img src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80"
                alt="IBIEA sponsorship" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/30 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-6">
                <p className="font-display text-2xl font-bold text-gold">Be Seen Where It Matters</p>
                <p className="text-sm text-cream/80 mt-1">Your brand, centre-stage at IBIEA 2.0.</p>
              </div>
            </div>
          </Reveal>

          {/* Content + CTAs */}
          <div>
            <p className="text-cream/75 leading-relaxed">
              Sponsoring IBIEA 2.0 places your brand at the heart of an international gathering of developers,
              investors, designers and industry leaders. From title sponsorship to media partnerships, every tier is
              built to maximise visibility, credibility and business connections.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              {SPONSOR_BENEFITS.map((b) => (
                <div key={b.title} className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center text-gold shrink-0">
                    <DynamicIcon name={b.icon} size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-cream text-sm">{b.title}</p>
                    <p className="text-xs text-cream/60 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tier chips */}
            <div className="flex flex-wrap gap-2 mt-7">
              {SPONSOR_CATEGORIES.map((c) => (
                <span key={c} className="px-3 py-1.5 rounded-full bg-navy-700 border border-gold/25 text-xs font-semibold text-cream/80">{c}</span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/sponsors" className="btn-primary">Become a Sponsor <ArrowRight size={18} /></Link>
              <button className="btn-secondary"><Download size={18} /> Download Sponsorship Deck</button>
              <Link to="/contact" className="btn-ghost">Talk to Our Team</Link>
            </div>
          </div>
        </div>

        {/* Live partner logos (shown only when sponsors exist) */}
        {sponsors.length > 0 && (
          <div className="mt-16">
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-gold mb-5">Our Partners</p>
            <div className="flex flex-wrap justify-center gap-5">
              {sponsors.map((s) => (
                <div key={s.id} className="h-16 min-w-[150px] px-8 rounded-xl bg-navy-700 border border-gold/20 flex items-center justify-center text-cream font-display font-bold hover:border-gold/50 transition-colors">
                  {s.company}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- 13. PREVIOUS EDITION (counters + donut) ---------- */
function PreviousEdition() {
  const counts = PREVIOUS_STATS.filter((s) => s.suffix !== '%');
  const satisfaction = PREVIOUS_STATS.find((s) => s.suffix === '%');
  return (
    <section className="section-pad bg-navy-900 border-y border-gold/15 relative overflow-hidden">
      <div className="absolute inset-0 lux-dots opacity-20" />
      <div className="container-x relative z-10">
        <SectionHeading center eyebrow="Previous Edition" title="A Proven Success"
          subtitle="The numbers behind a record-breaking debut edition." />
        <div className="grid lg:grid-cols-3 gap-8 items-center">
          <Reveal className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-5">
              {counts.map((s) => (
                <div key={s.label} className="card-base p-6 text-center">
                  <StatCounter {...s} />
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="card-base p-8 flex flex-col items-center text-center">
              <DonutStat value={satisfaction?.value ?? 90} label="Satisfaction" size={190} />
              <p className="mt-4 text-cream/70 text-sm">Attendee satisfaction across the previous edition.</p>
            </div>
          </Reveal>
        </div>
        <div className="text-center mt-12"><Link to="/about" className="btn-secondary">See Previous Event Highlights <ArrowRight size={16} /></Link></div>
      </div>
    </section>
  );
}

/* ---------- 14. GALLERY ---------- */
function Gallery() {
  const [active, setActive] = useState(null);
  return (
    <section className="section-pad">
      <div className="container-x">
        <SectionHeading center eyebrow="Gallery" title="Moments from IBIEA" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {GALLERY.map((src, i) => (
            <button key={i} onClick={() => setActive(src)} className="group relative rounded-xl overflow-hidden aspect-[4/3] border border-gold/20">
              <img src={src} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <div className="absolute inset-0 bg-navy/40 group-hover:bg-navy/10 transition-colors flex items-center justify-center">
                <Play size={28} className="text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
        <div className="text-center mt-10"><button className="btn-secondary">View Complete Gallery <ExternalLink size={16} /></button></div>
      </div>
      {active && (
        <div className="fixed inset-0 z-50 bg-navy-900/90 backdrop-blur flex items-center justify-center p-6" onClick={() => setActive(null)}>
          <img src={active} alt="" className="max-w-4xl max-h-[85vh] rounded-2xl border border-gold/30 shadow-gold-lg" />
        </div>
      )}
    </section>
  );
}

/* ---------- 15. TESTIMONIALS ---------- */
function Testimonials() {
  const [i, setI] = useState(0);
  const t = TESTIMONIALS[i];
  return (
    <section className="section-pad bg-navy-900/50">
      <div className="container-x max-w-3xl text-center">
        <SectionHeading center eyebrow="Testimonials" title="Success Stories" />
        <div className="card-base p-8 md:p-12">
          <Quote size={40} className="mx-auto text-gold/40" />
          <p className="mt-5 text-lg md:text-xl text-cream/90 italic leading-relaxed">"{t.quote}"</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gold text-navy font-bold flex items-center justify-center">{t.initial}</div>
            <div className="text-left">
              <p className="font-bold text-cream">{t.name}</p>
              <p className="text-sm text-gold">{t.role}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {TESTIMONIALS.map((_, idx) => (
            <button key={idx} onClick={() => setI(idx)} className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === i ? 'bg-gold' : 'bg-cream/20'}`} aria-label={`Testimonial ${idx + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 16. VENUE ---------- */
function Venue() {
  return (
    <section className="section-pad">
      <div className="container-x grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <SectionHeading eyebrow="Venue" title={EVENT.venue} subtitle={EVENT.city} />
          <ul className="space-y-4">
            {[
              { icon: MapPin, label: EVENT.city },
              { icon: Navigation, label: 'Nearest: Muscat International Airport (MCT)' },
              { icon: Calendar, label: 'Recommended partner hotels nearby' },
            ].map((r, i) => (
              <li key={i} className="flex items-center gap-4 card-base p-5">
                <r.icon className="text-gold shrink-0" />
                <span className="text-cream/80 text-sm">{r.label}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-4 mt-7">
            <button className="btn-primary"><Navigation size={18} /> Get Directions</button>
            <button className="btn-secondary">Explore Nearby Hotels</button>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden border border-gold/20 shadow-card h-80 lg:h-full min-h-[320px]">
          <iframe title="Venue map" className="w-full h-full" style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg)' }}
            src="https://www.openstreetmap.org/export/embed.html?bbox=58.0,23.4,58.7,23.7&layer=mapnik" />
        </div>
      </div>
    </section>
  );
}

/* ---------- 17. FAQ ---------- */
function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section-pad bg-navy-900/50">
      <div className="container-x max-w-3xl">
        <SectionHeading center eyebrow="FAQ" title="Frequently Asked Questions" />
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={i} className="card-base overflow-hidden">
              <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
                <span className="font-semibold text-cream">{f.q}</span>
                {open === i ? <Minus size={20} className="text-gold shrink-0" /> : <Plus size={20} className="text-gold shrink-0" />}
              </button>
              {open === i && <p className="px-5 pb-5 text-sm text-cream/70 leading-relaxed">{f.a}</p>}
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <p className="text-cream/70 mb-4">Still have questions?</p>
          <Link to="/contact" className="btn-primary">Contact Our Team <ArrowRight size={18} /></Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- 18. FINAL CONVERSION ---------- */
function FinalCTA() {
  return (
    <section className="section-pad relative overflow-hidden">
      <div className="absolute inset-0 bg-gold-gradient" />
      <div className="container-x relative z-10 text-center">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-navy max-w-3xl mx-auto leading-tight">
          Join Industry Leaders, Innovators, Investors & Decision Makers at IBIEA 2.0
        </h2>
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          {HERO_CTAS.map((c) => (
            <Link key={c.label} to={c.to}
              className={c.primary
                ? 'inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold bg-navy text-gold hover:bg-navy-700 transition'
                : 'inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold border-2 border-navy text-navy hover:bg-navy hover:text-gold transition'}>
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 19. CONTACT ---------- */
function ContactStrip() {
  const [form, setForm] = useState({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.enquiry({ kind: 'contact', name: form.name, email: form.email, phone: form.phone, message: form.message });
      setSent(true);
    } catch (err) { setError(err.message || 'Could not send. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <section className="section-pad bg-navy-900">
      <div className="container-x grid lg:grid-cols-2 gap-12">
        <div>
          <SectionHeading eyebrow="Contact Us" title="Let's Talk" />
          <ul className="space-y-4">
            {[
              { icon: Phone, label: EVENT.contactPhone, href: `tel:${EVENT.contactPhone}` },
              { icon: Mail, label: EVENT.contactEmail, href: `mailto:${EVENT.contactEmail}` },
              { icon: MapPin, label: EVENT.city },
            ].map((c, i) => (
              <li key={i}>
                <a href={c.href || '#'} className="flex items-center gap-4 card-base p-5 hover:border-gold/50">
                  <span className="w-11 h-11 rounded-xl bg-gold/15 flex items-center justify-center text-gold"><c.icon size={20} /></span>
                  <span className="text-cream/80">{c.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        {sent ? (
          <div className="card-base p-7 md:p-8 flex flex-col items-center justify-center text-center">
            <Check size={48} className="text-gold" />
            <h3 className="mt-4 font-display text-xl font-bold text-cream">Request Received</h3>
            <p className="mt-2 text-cream/70">Thank you — our team will call you back shortly.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="card-base p-7 md:p-8 space-y-4">
            <h3 className="font-display text-xl font-bold text-cream">Request a Callback</h3>
            <input placeholder="Your Name" required className="field" value={form.name || ''} onChange={(e) => setField('name', e.target.value)} />
            <input placeholder="Email Address" type="email" className="field" value={form.email || ''} onChange={(e) => setField('email', e.target.value)} />
            <input placeholder="Phone Number" type="tel" required className="field" value={form.phone || ''} onChange={(e) => setField('phone', e.target.value)} />
            <textarea placeholder="Your Message" rows={3} className="field" value={form.message || ''} onChange={(e) => setField('message', e.target.value)} />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : <>Request A Callback <ArrowRight size={16} /></>}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Countdown />
      <Highlights />
      <WhyCards eyebrow="Why Attend" title="Reasons to Be There" items={WHY_ATTEND}
        ctas={[{ label: 'Register as Visitor', to: '/register', primary: true }, { label: 'View Event Agenda', to: '/about' }]} />
      <WhyCards eyebrow="Why Exhibit" title="Grow Your Business" items={WHY_EXHIBIT}
        ctas={[{ label: 'Become an Exhibitor', to: '/exhibitors', primary: true }, { label: 'Download Stall Packages', to: '/exhibitors' }, { label: 'Request Pricing', to: '/exhibitors' }]} />
      <ExpoCategories />
      <Awards />
      <Speakers />
      <Sponsors />
      <PreviousEdition />
      <Gallery />
      <Testimonials />
      <Venue />
      <FAQ />
      <FinalCTA />
      <ContactStrip />
    </>
  );
}
