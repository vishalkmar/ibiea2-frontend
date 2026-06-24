import { useState } from 'react';
import { Search, Download } from 'lucide-react';

// Reusable searchable table. columns: [{key,label,render?}], rows: [...]
export default function DataTable({ columns, rows, searchKeys = [], title, onExport, toolbar }) {
  const [q, setQ] = useState('');
  const filtered = q
    ? rows.filter((r) => searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(q.toLowerCase())))
    : rows;

  return (
    <div className="card-base p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        {title && <h2 className="text-lg font-bold text-cream">{title}</h2>}
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/70" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…"
              className="pl-9 pr-4 py-2 rounded-xl border border-gold/20 bg-transparent focus:border-gold outline-none text-sm w-44 sm:w-56" />
          </div>
          {toolbar}
          {onExport && <button onClick={onExport} className="btn-ghost !py-2 text-sm"><Download size={15} /> Export</button>}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: columns.length * 120 }}>
          <thead>
            <tr className="text-left text-gold/90 border-b border-gold/30 uppercase text-xs tracking-wider">
              {columns.map((c) => <th key={c.key} className="py-3 px-3 font-bold whitespace-nowrap">{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i} className={`border-t border-gold/10 transition-colors hover:bg-gold/5 ${i % 2 ? 'bg-navy-900/30' : ''}`}>
                {columns.map((c) => (
                  <td key={c.key} className="py-3 px-3 text-cream/75">
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={columns.length} className="py-8 text-center text-cream/70">No records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
