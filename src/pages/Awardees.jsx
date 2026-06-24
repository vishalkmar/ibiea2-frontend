import { useState, useEffect } from 'react';
import { Trophy, Medal, Filter, Loader2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SectionHeading from '../components/ui/SectionHeading';
import { AWARD_CATEGORIES } from '../data/siteData';
import { api } from '../lib/api';

export default function Awardees() {
  const [edition, setEdition] = useState('All');
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.awardees()
      .then((rows) => setWinners((rows || []).map((w) => ({
        name: w.nominee, company: w.company, category: w.category,
        citation: w.citation, edition: w.edition || '2026',
      }))))
      .catch(() => setWinners([]))
      .finally(() => setLoading(false));
  }, []);

  const editions = ['All', ...new Set(winners.map((w) => w.edition))];
  const filtered = edition === 'All' ? winners : winners.filter((w) => w.edition === edition);

  return (
    <>
      <PageHeader
        eyebrow="Hall of Fame"
        title="Celebrating Our Awardees"
        subtitle="A permanent showcase of excellence — the winners who define the IBIEA standard, edition after edition."
        image="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=2000&q=80"
      />

      {/* Hall of Fame feature */}
      <section className="bg-navy-900 section-pad relative overflow-hidden">
        <div className="absolute inset-0 lux-dots opacity-30" />
        <div className="container-x relative z-10">
          <SectionHeading center eyebrow="Hall of Fame" title="Our Distinguished Winners"
            subtitle="Winners are revealed at the Gala Awards Ceremony and immortalised here." />
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-gold" /></div>
          ) : winners.length === 0 ? (
            <p className="text-center text-cream/60 py-12">Winners will be announced at the Gala Awards Ceremony.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((w, i) => (
                <div key={i} className="card-base p-7 text-center group">
                  <div className="w-20 h-20 rounded-full bg-gold-gradient mx-auto flex items-center justify-center shadow-gold">
                    <Trophy size={34} className="text-navy" />
                  </div>
                  <span className="inline-block mt-4 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-bold uppercase tracking-wide">{w.category}</span>
                  <h3 className="mt-3 font-display font-bold text-xl text-cream">{w.name}</h3>
                  {w.company && <p className="text-cream/70 text-sm">{w.company}</p>}
                  {w.citation && <p className="mt-3 text-sm text-cream/60 italic">"{w.citation}"</p>}
                  <p className="mt-3 text-xs text-gold font-semibold">Edition {w.edition}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Awardees directory */}
      {winners.length > 0 && (
        <section className="bg-transparent section-pad">
          <div className="container-x">
            <SectionHeading center eyebrow="Awardees Directory" title="Browse All Winners"
              subtitle="A structured, filterable record of award winners across categories and editions." />
            <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
              <Filter size={18} className="text-gold" />
              {editions.map((e) => (
                <button key={e} onClick={() => setEdition(e)} className={`px-4 py-2 rounded-full text-sm font-semibold ${edition === e ? 'bg-gold-gradient text-navy' : 'bg-navy-700/50 text-cream hover:bg-navy-600'}`}>{e}</button>
              ))}
            </div>
            <div className="rounded-2xl overflow-hidden border border-gold/25 shadow-card bg-navy-800/60 backdrop-blur overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="bg-gold-gradient text-navy text-left">
                    <th className="px-6 py-4 font-bold tracking-wide">Category</th>
                    <th className="px-6 py-4 font-bold tracking-wide">Winner</th>
                    <th className="px-6 py-4 font-bold tracking-wide">Edition</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((w, i) => (
                    <tr key={i} className={`border-t border-gold/10 transition-colors hover:bg-gold/5 ${i % 2 ? 'bg-navy-900/40' : 'bg-transparent'}`}>
                      <td className="px-6 py-4 font-semibold text-cream flex items-center gap-2"><Medal size={16} className="text-gold" /> {w.category}</td>
                      <td className="px-6 py-4 text-cream/70">{w.name}{w.company && ` — ${w.company}`}</td>
                      <td className="px-6 py-4 text-cream/70">{w.edition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
