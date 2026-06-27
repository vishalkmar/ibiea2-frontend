import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SectionHeading from '../components/ui/SectionHeading';
import StatCounter from '../components/ui/StatCounter';
import { Reveal } from '../components/ui/Motion';
import { PREVIOUS_STATS, GALLERY } from '../data/siteData';

export default function Ibiea1() {
  const [active, setActive] = useState(null);
  return (
    <>
      <PageHeader
        eyebrow="The Previous Edition"
        title="IBIEA 1.0 — Where It All Began"
        subtitle="A record-breaking debut that set the standard for the region's premier real estate business & awards platform."
        image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2000&q=80"
      />

      {/* Story */}
      <section className="bg-transparent section-pad">
        <div className="container-x grid lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div className="rounded-2xl overflow-hidden border border-gold/20 shadow-card h-80 lg:h-[26rem]">
              <img src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80" alt="IBIEA 1.0" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </Reveal>
          <div>
            <SectionHeading eyebrow="The Inaugural Edition" title="A Landmark First Edition" />
            <div className="space-y-4 text-cream/70 leading-relaxed">
              <p>The first edition of IBIEA brought together developers, designers, investors and industry leaders for an unforgettable celebration of excellence — laying the foundation for what has become the region's most anticipated real estate gathering.</p>
              <p>From a buzzing exhibition floor to a glittering awards ceremony, IBIEA 1.0 proved that recognition, networking and business opportunity belong on one stage.</p>
            </div>
            <Link to="/register" className="btn-primary mt-7">Join Us at IBIEA 2.0 <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-navy-900 border-y border-gold/15 section-pad relative overflow-hidden">
        <div className="absolute inset-0 lux-dots opacity-20" />
        <div className="container-x relative z-10">
          <SectionHeading center eyebrow="By The Numbers" title="The Impact of IBIEA 1.0" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-5">
            {PREVIOUS_STATS.map((s, i) => (
              <Reveal key={s.label} delay={(i % 5) * 0.06}>
                <div className="card-base p-6 text-center"><StatCounter {...s} /></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-transparent section-pad">
        <div className="container-x">
          <SectionHeading center eyebrow="Gallery" title="Moments from IBIEA 1.0" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY.map((src, i) => (
              <Reveal key={i} delay={(i % 3) * 0.06}>
                <button onClick={() => setActive(src)} className="group relative rounded-xl overflow-hidden aspect-[4/3] border border-gold/20 w-full">
                  <img src={src} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-navy/40 group-hover:bg-navy/10 transition-colors flex items-center justify-center">
                    <Play size={28} className="text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
        {active && (
          <div className="fixed inset-0 z-50 bg-navy-900/90 backdrop-blur flex items-center justify-center p-6" onClick={() => setActive(null)}>
            <img src={active} alt="" className="max-w-4xl max-h-[85vh] rounded-2xl border border-gold/30 shadow-gold-lg" />
          </div>
        )}
      </section>
    </>
  );
}
