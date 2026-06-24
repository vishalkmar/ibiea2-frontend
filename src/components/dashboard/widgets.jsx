import DynamicIcon from '../ui/DynamicIcon';

export function StatCard({ icon, label, value, sub, accentClass = 'text-gold bg-gold/15' }) {
  return (
    <div className="card-base p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${accentClass}`}>
        <DynamicIcon name={icon} size={24} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-cream leading-tight">{value}</p>
        <p className="text-sm text-cream/70 truncate">{label}</p>
        {sub && <p className="text-xs text-gold font-semibold">{sub}</p>}
      </div>
    </div>
  );
}

const STATUS_STYLES = {
  paid: 'bg-green-100 text-green-700',
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  'pending verification': 'bg-amber-100 text-amber-700',
  unpaid: 'bg-red-100 text-red-700',
  hot: 'bg-red-100 text-red-700',
  warm: 'bg-amber-100 text-amber-700',
  cold: 'bg-sky-100 text-sky-700',
  delivered: 'bg-green-100 text-green-700',
  'in progress': 'bg-amber-100 text-amber-700',
  outstanding: 'bg-red-100 text-red-700',
  default: 'bg-navy-600 text-cream',
};

export function StatusBadge({ status }) {
  const cls = STATUS_STYLES[String(status).toLowerCase()] || STATUS_STYLES.default;
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold capitalize ${cls}`}>
      {status}
    </span>
  );
}

export function Panel({ title, action, children, className = '' }) {
  return (
    <section className={`card-base p-6 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-5">
          {title && <h2 className="text-lg font-bold text-cream">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
