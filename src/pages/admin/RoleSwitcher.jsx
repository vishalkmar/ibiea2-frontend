import { UserCog } from 'lucide-react';

// Demo-only role switcher so reviewers can preview each admin tier.
// In production the role comes from the authenticated JWT.
export default function RoleSwitcher({ role, setRole, labels }) {
  return (
    <div className="mb-6 card-base p-3 flex items-center gap-3 border-l-4 border-gold bg-gold/5">
      <UserCog size={18} className="text-gold shrink-0" />
      <span className="text-sm font-semibold text-cream hidden sm:inline">Preview role:</span>
      <div className="flex gap-2 flex-wrap">
        {Object.entries(labels).map(([key, label]) => (
          <button key={key} onClick={() => setRole(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${role === key ? 'bg-gold-gradient text-navy' : 'bg-navy-700/50 text-cream hover:bg-navy-600'}`}>
            {label}
          </button>
        ))}
      </div>
      <span className="text-xs text-cream/70 ml-auto hidden md:inline">Demo switcher — real role from login</span>
    </div>
  );
}
