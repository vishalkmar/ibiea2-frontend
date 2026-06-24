import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import {
  ChevronDown, ArrowRight, Calendar, MapPin, Clock, Download, Award, Users,
  Quote, Plus, Minus, Star, ExternalLink, Play, Phone, Mail, Navigation, Check, Loader2,
} from 'lucide-react';
import {
  EVENT, HERO_CTAS, HIGHLIGHT_STATS, WHY_ATTEND, WHY_EXHIBIT, INDUSTRY_SEGMENTS,
  AWARD_CATEGORIES, SPEAKERS, SPONSOR_CATEGORIES, SCHEDULE, PREVIOUS_STATS,
  GALLERY, TESTIMONIALS, FAQS,
} from '../data/siteData';
import StatCounter from '../components/ui/StatCounter';
import SectionHeading from '../components/ui/SectionHeading';
import DynamicIcon from '../components/ui/DynamicIcon';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useCountdown } from '../hooks/useCountdown';

/* Reusable scroll-reveal wrapper */
function Reveal({ children, className = '', delay = 0 }) {
  const ref = useScrollReveal();
  return <div ref={ref} className={`animate-on-scroll ${className}`} style={{ animationDelay: `${delay}s` }}>{children}</div>;
}

/* ---------- 1. HERO ---------- */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80')" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900/95 via-navy/90 to-navy-600/85" />
        <div className="absolute inset-0 lux-dots opacity-30" />
      </div>

      <div className="container-x relative z-10 pt-28 pb-16">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/15 border border-gold/40 text-gold text-sm font-semibold mb-6 animate-fade-in-up">
            <Star size={14} /> International Business & Infrastructure Expo & Awards
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-black text-cream leading-[1.05] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            IBIEA <span className="text-gradient-gold">2.0</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-cream/80 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {EVENT.tagline}
          </p>

          <div className="flex flex-wrap gap-5 mt-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {[
              { icon: Calendar, text: EVENT.dates },
              { icon: MapPin, text: EVENT.city },
              { icon: Clock, text: EVENT.time },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-2.5 text-cream">
                <span className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center"><m.icon size={18} className="text-gold" /></span>
                <span className="font-semibold text-sm">{m.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {HERO_CTAS.map((c) => (
              <Link key={c.label} to={c.to} className={c.primary ? 'btn-primary' : 'btn-secondary'}>
                {c.label} {c.primary && <ArrowRight size={18} />}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold/70 animate-bounce">
        <ChevronDown size={28} />
      </div>
    </section>
  );
}

/* ---------- 2. COUNTDOWN ---------- */
function Countdown() {
  const t = useCountdown(EVENT.dateISO);
  const units = [
    { v: t.days, l: 'Days' }, { v: t.hours, l: 'Hours' },
    { v: t.minutes, l: 'Minutes' }, { v: t.seconds, l: 'Seconds' },
  ];
  return (
    <section className="section-pad bg-navy-900 border-y border-gold/15 relative overflow-hidden">
      <div className="absolute inset-0 lux-pattern" />
      <div className="container-x relative z-10 text-center">
        <p className="eyebrow mb-3">The Countdown Has Begun</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-cream">IBIEA 2.0 Begins In</h2>
        <div className="flex justify-center gap-3 sm:gap-5 mt-10">
          {units.map((u) => (
            <div key={u.l} className="w-20 sm:w-28 rounded-2xl bg-navy-700 border border-gold/30 py-5 shadow-card">
              <div className="font-display text-3xl sm:text-5xl font-black text-gradient-gold tabular-nums">{String(u.v).padStart(2, '0')}</div>
              <div className="text-xs sm:text-sm text-cream/60 uppercase tracking-wider mt-1">{u.l}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Link to="/register" className="btn-primary">Reserve Your Spot <ArrowRight size={18} /></Link>
          <button className="btn-secondary"><Download size={18} /> Download Event Brochure</button>
        </div>
      </div>
    </section>
  );
}

/* ---------- 3. EVENT HIGHLIGHTS ---------- */
function Highlights() {
  return (
    <section className="section-pad">
      <div className="container-x">
        <SectionHeading center eyebrow="Event Highlights" title="The Biggest Industry Gathering"
          subtitle="A premium convergence of the entire real estate and infrastructure ecosystem." />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-5">
          {HIGHLIGHT_STATS.map((s) => <StatCounter key={s.label} {...s} />)}
        </div>
        <div className="text-center mt-12">
          <Link to="/register" className="btn-primary">Join the Biggest Real Estate Gathering <ArrowRight size={18} /></Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- 4. ABOUT ---------- */
function About() {
  return (
    <section className="section-pad bg-navy-900/50">
      <div className="container-x grid lg:grid-cols-2 gap-14 items-center">
        <Reveal>
          <div className="rounded-2xl overflow-hidden border border-gold/20 shadow-card h-80 lg:h-[26rem] bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80')" }} />
        </Reveal>
        <div>
          <SectionHeading eyebrow="About IBIEA 2.0" title="Where the Industry Converges" />
          <div className="space-y-4 text-cream/70 leading-relaxed">
            <p><strong className="text-cream">IBIEA 2.0</strong> is the International Business & Infrastructure Expo & Awards — a flagship platform uniting real estate, infrastructure, interior design, home decor, construction materials and business networking under one roof.</p>
            <p><strong className="text-gold">Our Vision:</strong> to be the region's most credible stage for industry excellence, investment and innovation.</p>
            <p><strong className="text-gold">Our Mission:</strong> to connect developers, designers, suppliers, investors and leaders — driving deals, recognition and growth.</p>
            <p>Whether you're an exhibitor, sponsor, delegate or award nominee, IBIEA 2.0 is built for those who shape the built environment.</p>
          </div>
          <Link to="/about" className="btn-secondary mt-7">Learn More About The Event <ArrowRight size={16} /></Link>
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

/* ---------- 7. EXPO CATEGORIES ---------- */
function ExpoCategories() {
  return (
    <section className="section-pad bg-navy-900/50">
      <div className="container-x">
        <SectionHeading center eyebrow="Expo Categories" title="Who Exhibits at IBIEA 2.0"
          subtitle="Eleven industry segments across the entire built-environment value chain." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INDUSTRY_SEGMENTS.map((seg, i) => (
            <Reveal key={seg.id} delay={(i % 4) * 0.06}>
              <Link to={`/exhibitors?segment=${seg.id}`} className={`card-base p-6 group block h-full relative overflow-hidden ${seg.featured ? 'border-gold/40' : ''}`}>
                <span className="absolute top-0 inset-x-0 h-[3px] bg-gold-gradient scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                {seg.featured && <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-gold text-navy">2026 Focus</span>}
                <div className="icon-tile"><DynamicIcon name={seg.icon} size={26} /></div>
                <h3 className="mt-4 font-display font-bold text-lg text-cream group-hover:text-gold transition-colors">{seg.name}</h3>
                <p className="mt-2 text-sm text-cream/60 leading-relaxed">{seg.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight size={14} />
                </span>
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

/* ---------- 8. AWARD CATEGORIES ---------- */
function Awards() {
  const featured = AWARD_CATEGORIES.slice(0, 6);
  return (
    <section className="section-pad relative overflow-hidden">
      <div className="absolute inset-0 lux-pattern" />
      <div className="container-x relative z-10">
        <SectionHeading center eyebrow="Awards" title="Celebrating Excellence"
          subtitle="Honouring the developers, designers and innovators raising the industry standard." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((cat, i) => (
            <Reveal key={cat.id} delay={(i % 3) * 0.06}>
              <div className="card-base p-7 h-full group relative overflow-hidden">
                <span className="absolute top-0 inset-x-0 h-[3px] bg-gold-gradient scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                <div className="icon-tile !rounded-full"><Award size={24} /></div>
                <h3 className="mt-4 font-display font-bold text-lg text-gold">{cat.name}</h3>
                <p className="mt-2 text-sm text-cream/70 leading-relaxed">{cat.desc}</p>
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

/* ---------- 10. SPONSORS & PARTNERS ---------- */
function Sponsors() {
  const [sponsors, setSponsors] = useState([]);
  useEffect(() => { api.publicSponsors().then((r) => setSponsors(r || [])).catch(() => {}); }, []);

  // Group live sponsors by tier name; only render tiers that have at least one.
  const byTier = sponsors.reduce((acc, s) => {
    const t = s.tier_name || 'Partner';
    (acc[t] = acc[t] || []).push(s);
    return acc;
  }, {});
  const tierOrder = ['Title Sponsor', 'Platinum', 'Gold', 'Silver', 'Partner'];
  const tiers = Object.keys(byTier).sort((a, b) => tierOrder.indexOf(a) - tierOrder.indexOf(b));

  return (
    <section className="section-pad">
      <div className="container-x">
        <SectionHeading center eyebrow="Sponsors & Partners" title="Backed by Leading Brands" />
        {tiers.length === 0 ? (
          <div className="space-y-8">
            {['Title Sponsor', 'Powered By', 'Gold Sponsor'].map((cat, idx) => (
              <div key={cat}>
                <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-gold mb-4">{cat}</p>
                <div className="flex flex-wrap justify-center gap-5">
                  {Array.from({ length: idx + 1 }).map((_, i) => (
                    <div key={i} className="h-16 min-w-[150px] px-8 rounded-xl bg-navy-700 border border-gold/20 flex items-center justify-center text-cream/40 font-display font-bold">Your Brand</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {tiers.map((tier) => (
              <div key={tier}>
                <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-gold mb-4">{tier}</p>
                <div className="flex flex-wrap justify-center gap-5">
                  {byTier[tier].map((s) => (
                    <div key={s.id} className="h-16 min-w-[150px] px-8 rounded-xl bg-navy-700 border border-gold/20 flex items-center justify-center text-cream font-display font-bold hover:border-gold/50 transition-colors">
                      {s.company}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <Link to="/sponsors" className="btn-primary">Become a Sponsor <ArrowRight size={18} /></Link>
          <button className="btn-secondary"><Download size={18} /> Download Sponsorship Deck</button>
        </div>
      </div>
    </section>
  );
}

/* ---------- 11. EXHIBITORS SHOWCASE ---------- */
function ExhibitorsShowcase() {
  return (
    <section className="section-pad bg-navy-900/50 overflow-hidden">
      <div className="container-x">
        <SectionHeading center eyebrow="Exhibitors Showcase" title="Featured Exhibitors" />
      </div>
      <div className="relative">
        <div className="flex gap-5 animate-[shimmer_none] overflow-x-auto px-5 sm:px-8 lg:px-12 pb-4 [scrollbar-width:none]">
          {INDUSTRY_SEGMENTS.map((seg) => (
            <div key={seg.id} className="shrink-0 w-56 card-base p-6 text-center">
              <div className="w-14 h-14 rounded-xl bg-gold/15 flex items-center justify-center text-gold mx-auto"><DynamicIcon name={seg.icon} size={26} /></div>
              <p className="mt-3 font-bold text-cream text-sm">Exhibitor</p>
              <p className="text-xs text-gold">{seg.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="container-x flex flex-wrap justify-center gap-4 mt-10">
        <Link to="/exhibitors" className="btn-secondary">View All Exhibitors</Link>
        <Link to="/exhibitors" className="btn-primary">Exhibit With Us <ArrowRight size={18} /></Link>
      </div>
    </section>
  );
}

/* ---------- 12. AGENDA ---------- */
function Agenda() {
  return (
    <section className="section-pad">
      <div className="container-x">
        <SectionHeading center eyebrow="Event Agenda" title="Three Days, One Stage"
          subtitle="Exhibition, networking and recognition across the full programme." />
        <div className="grid md:grid-cols-3 gap-6">
          {SCHEDULE.map((day) => (
            <Reveal key={day.day}>
              <div className="card-base p-6 h-full">
                <div className="flex items-baseline justify-between border-b border-gold/20 pb-4 mb-4">
                  <h3 className="font-display font-bold text-2xl text-gold">{day.day}</h3>
                  <span className="text-xs font-semibold uppercase tracking-wide text-cream/50">{day.title}</span>
                </div>
                <ul className="space-y-3">
                  {day.items.map((it, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="font-bold text-gold w-12 shrink-0">{it.time}</span>
                      <span className="text-cream/70">{it.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <button className="btn-primary"><Download size={18} /> Download Agenda</button>
          <button className="btn-secondary"><Calendar size={18} /> Add Event To Calendar</button>
        </div>
      </div>
    </section>
  );
}

/* ---------- 13. PREVIOUS EDITION ---------- */
function PreviousEdition() {
  return (
    <section className="section-pad bg-navy-900 border-y border-gold/15 relative overflow-hidden">
      <div className="absolute inset-0 lux-dots opacity-20" />
      <div className="container-x relative z-10">
        <SectionHeading center eyebrow="Previous Edition" title="A Proven Success" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-5">
          {PREVIOUS_STATS.map((s) => <StatCounter key={s.label} {...s} />)}
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
      <About />
      <WhyCards eyebrow="Why Attend" title="Reasons to Be There" items={WHY_ATTEND}
        ctas={[{ label: 'Register as Visitor', to: '/register', primary: true }, { label: 'View Event Agenda', to: '/about' }]} />
      <WhyCards eyebrow="Why Exhibit" title="Grow Your Business" items={WHY_EXHIBIT}
        ctas={[{ label: 'Become an Exhibitor', to: '/exhibitors', primary: true }, { label: 'Download Stall Packages', to: '/exhibitors' }, { label: 'Request Pricing', to: '/exhibitors' }]} />
      <ExpoCategories />
      <Awards />
      <Speakers />
      <Sponsors />
      <ExhibitorsShowcase />
      <Agenda />
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
