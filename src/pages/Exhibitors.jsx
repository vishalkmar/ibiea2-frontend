import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, Star, Download, ArrowRight, Building2, MapPin, Layers, Loader2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SectionHeading from '../components/ui/SectionHeading';
import DynamicIcon from '../components/ui/DynamicIcon';
import FloorPlan from '../components/exhibitor/FloorPlan';
import EnquiryForm from '../components/ui/EnquiryForm';
import { EXHIBITOR_PACKAGES, INDUSTRY_SEGMENTS } from '../data/siteData';
import { api } from '../lib/api';

const TABS = ['Packages', 'Floor Plan', 'Directory', 'Developer Projects'];

// Demo developer projects (2026 theme)
const DEV_PROJECTS = [
  { name: 'Azure Bay Residences', location: 'Muscat', type: 'Residential', status: 'Upcoming', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80' },
  { name: 'The Pearl Mixed-Use District', location: 'Salalah', type: 'Mixed-Use', status: 'Under Construction', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80' },
  { name: 'Highland Master Community', location: 'Nizwa', type: 'Master-Planned', status: 'Ready', img: 'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=800&q=80' },
  { name: 'Coastline Commercial Tower', location: 'Muscat', type: 'Commercial', status: 'Upcoming', img: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80' },
];

export default function Exhibitors() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('segment') ? 'Directory' : 'Packages');
  const [showEnquiry, setShowEnquiry] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Exhibition Pillar"
        title="Showcase Your Business at IBIEA 2026"
        subtitle="Packages, an interactive floor plan, and a dedicated Developer Projects Showcase for the 2026 theme."
        image="https://images.unsplash.com/photo-1540304453527-62f979142a17?auto=format&fit=crop&w=2000&q=80"
      />

      {/* Tabs */}
      <div className="sticky top-[68px] z-30 bg-transparent/95 backdrop-blur border-b border-gold/20">
        <div className="container-x flex gap-2 overflow-x-auto py-3">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${tab === t ? 'bg-gold-gradient text-navy shadow-gold' : 'text-cream hover:bg-navy-700/50'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <section className="bg-transparent section-pad">
        <div className="container-x">
          {tab === 'Packages' && <Packages onEnquire={() => setShowEnquiry(true)} />}
          {tab === 'Floor Plan' && (
            <>
              <SectionHeading center eyebrow="Interactive Floor Plan" title="Pick Your Spot on the Floor"
                subtitle="Click an available stall to view its details and request a quote. Selecting a stall places a short soft-hold while you enquire." />
              <FloorPlan />
            </>
          )}
          {tab === 'Directory' && <Directory initialSegment={params.get('segment')} />}
          {tab === 'Developer Projects' && <DeveloperProjects />}
        </div>
      </section>

      {/* Enquiry modal */}
      {showEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm overflow-y-auto" onClick={() => setShowEnquiry(false)}>
          <div className="w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <EnquiryForm
              kind="exhibitor"
              title="Request Exhibitor Package Pricing"
              subtitle="Pricing is shared privately by our sales team. Tell us a little about your needs."
              submitLabel="Request a Quote"
              extraFields={[
                { name: 'package', label: 'Package of Interest', type: 'select', options: EXHIBITOR_PACKAGES.map((p) => p.name), full: true },
                { name: 'segment', label: 'Your Industry Segment', type: 'select', options: INDUSTRY_SEGMENTS.map((s) => s.name), full: true },
                { name: 'message', label: 'Requirements / Notes', type: 'textarea', full: true },
              ]}
            />
          </div>
        </div>
      )}
    </>
  );
}

function Packages({ onEnquire }) {
  return (
    <>
      <SectionHeading center eyebrow="Exhibitor Packages" title="Choose Your Participation Tier"
        subtitle="Flexible footprints across every tier. Pricing is shared privately on enquiry — no public pricing." />
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {EXHIBITOR_PACKAGES.map((pkg) => (
          <div key={pkg.id} className={`card-base p-7 relative flex flex-col ${pkg.popular ? 'ring-2 ring-gold shadow-gold-lg' : ''} ${pkg.themed ? 'border-t-4 border-gold-deep' : ''}`}>
            {pkg.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gold text-navy text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                <Star size={12} /> Most Popular
              </span>
            )}
            {pkg.themed && (
              <span className="absolute top-3 right-3 text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-gold-deep text-cream">2026 Theme</span>
            )}
            <h3 className="text-xl font-bold text-cream">{pkg.name}</h3>
            <p className="mt-1 text-sm text-gold font-semibold">Request a Quote</p>
            <ul className="mt-5 space-y-3 flex-1">
              {pkg.features.map((f) => (
                <li key={f} className="flex gap-2.5 text-sm text-cream/70"><Check size={18} className="text-gold shrink-0" /> {f}</li>
              ))}
            </ul>
            <button onClick={onEnquire} className={`mt-6 ${pkg.popular ? 'btn-primary' : 'btn-secondary'} w-full`}>Enquire Now</button>
          </div>
        ))}
      </div>
      <div className="text-center mt-10">
        <button className="btn-ghost"><Download size={16} /> Download Package Brochure (PDF)</button>
        <p className="text-xs text-cream/70 mt-2">Brochure excludes pricing. Itemised pricing is shared privately on enquiry.</p>
      </div>
    </>
  );
}

function Directory({ initialSegment }) {
  const [active, setActive] = useState(initialSegment || 'all');
  const [exhibitors, setExhibitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.publicExhibitors()
      .then((rows) => setExhibitors(rows || []))
      .catch(() => setExhibitors([]))
      .finally(() => setLoading(false));
  }, []);

  const iconFor = (segId) => INDUSTRY_SEGMENTS.find((s) => s.id === segId)?.icon || 'Building2';
  const filtered = active === 'all' ? exhibitors : exhibitors.filter((e) => e.segment_id === active);

  return (
    <>
      <SectionHeading center eyebrow="Exhibitor Directory" title="Discover Who's Exhibiting"
        subtitle="Filter the floor by industry segment." />
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <button onClick={() => setActive('all')} className={`px-4 py-2 rounded-full text-sm font-semibold ${active === 'all' ? 'bg-gold-gradient text-navy' : 'bg-navy-700/50 text-cream hover:bg-navy-600'}`}>All</button>
        {INDUSTRY_SEGMENTS.map((s) => (
          <button key={s.id} onClick={() => setActive(s.id)} className={`px-4 py-2 rounded-full text-sm font-semibold ${active === s.id ? 'bg-gold-gradient text-navy' : 'bg-navy-700/50 text-cream hover:bg-navy-600'}`}>
            {s.name}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-gold" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-cream/60 py-12">No exhibitors listed yet{active !== 'all' ? ' for this segment' : ''}. Check back soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((e) => (
            <div key={e.id} className="card-base p-6 flex items-center gap-4 group">
              <div className="icon-tile shrink-0"><DynamicIcon name={iconFor(e.segment_id)} size={24} /></div>
              <div className="min-w-0">
                <h3 className="font-bold text-cream truncate">{e.company}</h3>
                <p className="text-sm text-gold">{e.segment_name}</p>
                {e.description && <p className="text-xs text-cream/60 mt-1 line-clamp-2">{e.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function DeveloperProjects() {
  const badge = { Upcoming: 'bg-gold/20 text-gold', 'Under Construction': 'bg-navy-600 text-cream', Ready: 'bg-gold-deep text-cream', 'Master-Planned': 'bg-gold/20 text-gold' };
  return (
    <>
      <SectionHeading center eyebrow="2026 Theme Enhancement" title="Featured Developer Projects"
        subtitle="Flagship developments, master-planned communities and upcoming launches from our developer-exhibitors." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {DEV_PROJECTS.map((p) => (
          <div key={p.name} className="card-base overflow-hidden group">
            <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url('${p.img}')` }}>
              <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold ${badge[p.status] || 'bg-navy-600 text-cream'}`}>{p.status}</span>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-cream group-hover:text-gold transition-colors">{p.name}</h3>
              <div className="mt-2 flex items-center gap-3 text-xs text-cream/70">
                <span className="flex items-center gap-1"><MapPin size={13} /> {p.location}</span>
                <span className="flex items-center gap-1"><Layers size={13} /> {p.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 card-base p-8 text-center bg-navy-900/40">
        <Building2 size={36} className="mx-auto text-gold" />
        <h3 className="mt-3 text-2xl font-bold text-cream">Are You a Real Estate Developer?</h3>
        <p className="mt-2 text-cream/70 max-w-xl mx-auto">Add your flagship projects to the Developer Projects Showcase and get featured prominently across the directory and Home page.</p>
        <button className="btn-primary mt-6">Enquire About Developer Showcase <ArrowRight size={16} /></button>
      </div>
    </>
  );
}
