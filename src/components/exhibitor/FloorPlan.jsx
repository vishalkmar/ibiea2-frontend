import { useState, useMemo, useEffect } from 'react';
import { X, MapPin, Maximize2, Info, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

// Interactive SVG floor plan. Stalls colour-coded by status. No pricing (per WRD).
// Live stalls loaded from the DB (admin-configurable count via Floor Plan manager).

const STATUS = {
  available: { color: '#D4AF37', label: 'Available', ring: '#E0C05A' },
  reserved: { color: '#8A6A1F', label: 'On Hold', ring: '#C89B1D' },
  booked: { color: '#3A4566', label: 'Booked', ring: '#1B2C63' },
};

const TIERS = ['Startup', 'Standard', 'Premium', 'Developer'];

export default function FloorPlan() {
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [tierFilter, setTierFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    api.stalls()
      .then((rows) => setStalls(rows.map((s) => ({
        id: s.id,
        number: s.label || s.id,
        x: s.pos_x ?? 60, y: s.pos_y ?? 60, w: s.width ?? 70, h: s.height ?? 60,
        status: s.status, tier: s.tier,
        size: s.dimensions, near: s.proximity,
      }))))
      .catch(() => setStalls([]))
      .finally(() => setLoading(false));
  }, []);

  // Fit the SVG viewbox to the actual stall extents
  const extent = useMemo(() => {
    const maxX = Math.max(800, ...stalls.map((s) => s.x + s.w + 40));
    const maxY = Math.max(480, ...stalls.map((s) => s.y + s.h + 40));
    return { w: maxX, h: maxY };
  }, [stalls]);

  const filtered = useMemo(() => stalls.map((s) => ({
    ...s,
    dimmed: (tierFilter !== 'All' && s.tier !== tierFilter) || (statusFilter !== 'All' && s.status !== statusFilter),
  })), [stalls, tierFilter, statusFilter]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[300px]"><Loader2 size={28} className="animate-spin text-gold" /></div>;
  }
  if (stalls.length === 0) {
    return <div className="card-base p-12 text-center text-cream/60">The floor plan is being finalised. Please check back soon.</div>;
  }

  return (
    <div>
      {/* Filters + legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}
            className="px-4 py-2 rounded-full border border-gold/20 bg-transparent text-sm font-semibold text-cream focus:border-gold outline-none">
            <option>All</option>
            {TIERS.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-full border border-gold/20 bg-transparent text-sm font-semibold text-cream focus:border-gold outline-none">
            <option>All</option>
            <option value="available">Available</option>
            <option value="reserved">On Hold</option>
            <option value="booked">Booked</option>
          </select>
        </div>
        <div className="flex gap-4">
          {Object.entries(STATUS).map(([k, v]) => (
            <div key={k} className="flex items-center gap-2 text-sm text-cream/70">
              <span className="w-4 h-4 rounded" style={{ backgroundColor: v.color }} /> {v.label}
            </div>
          ))}
        </div>
      </div>

      {/* SVG plan */}
      <div className="card-base p-4 overflow-auto">
        <svg viewBox={`0 0 ${extent.w} ${extent.h}`} className="w-full min-w-[700px]" style={{ touchAction: 'pinch-zoom' }}>
          {/* Hall outline */}
          <rect x="20" y="20" width={extent.w - 40} height={extent.h - 40} rx="12" fill="#0B1438" stroke="#D4AF37" strokeOpacity="0.35" strokeWidth="2" />
          {/* Entrance */}
          <rect x={extent.w / 2 - 40} y="14" width="80" height="12" rx="4" fill="#D4AF37" />
          <text x={extent.w / 2} y="10" textAnchor="middle" fontSize="11" fill="#D4AF37" fontWeight="bold">ENTRANCE</text>
          {/* Lounge */}
          <text x={extent.w / 2} y={extent.h - 8} textAnchor="middle" fontSize="11" fill="#D4AF37" fontWeight="bold">NETWORKING LOUNGE</text>

          {filtered.map((s) => {
            const st = STATUS[s.status] || STATUS.available;
            const isSel = selected?.id === s.id;
            return (
              <g key={s.id} opacity={s.dimmed ? 0.2 : 1}
                 style={{ cursor: s.status === 'available' ? 'pointer' : 'default' }}
                 onClick={() => !s.dimmed && setSelected(s)}>
                <rect x={s.x} y={s.y} width={s.w} height={s.h} rx="6"
                  fill={st.color} stroke={isSel ? '#F5F1E6' : st.ring}
                  strokeWidth={isSel ? 3 : 1.5}
                  className="transition-all duration-150 hover:opacity-80" />
                <text x={s.x + s.w / 2} y={s.y + s.h / 2 + 4} textAnchor="middle" fontSize="11"
                  fill={s.status === 'available' ? '#0B1438' : '#F5F1E6'} fontWeight="bold">
                  {s.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="card-base !bg-navy-800 w-full max-w-md p-7 relative animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-cream/70 hover:text-cream"><X size={22} /></button>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-navy" style={{ backgroundColor: STATUS[selected.status].color }}>
              {STATUS[selected.status].label}
            </span>
            <h3 className="mt-3 text-2xl font-bold text-cream">{selected.number}</h3>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center gap-3"><Maximize2 size={18} className="text-gold" /> <span className="text-cream/70">Dimensions: <strong className="text-cream">{selected.size}</strong></span></div>
              <div className="flex items-center gap-3"><Info size={18} className="text-gold" /> <span className="text-cream/70">Package tier: <strong className="text-cream">{selected.tier}</strong></span></div>
              <div className="flex items-center gap-3"><MapPin size={18} className="text-gold" /> <span className="text-cream/70">{selected.near}</span></div>
            </div>
            <div className="mt-6 p-4 rounded-xl bg-navy-700/50 text-sm text-cream/70">
              Pricing is shared privately by our sales team. Submit your interest in this stall to receive a tailored quote.
            </div>
            {selected.status === 'available' ? (
              <button className="btn-primary w-full mt-5" onClick={() => setSelected(null)}>Request a Quote for {selected.id}</button>
            ) : (
              <button disabled className="w-full mt-5 px-7 py-3.5 rounded-full font-semibold bg-navy-600 text-cream/70 cursor-not-allowed">Not Available</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
