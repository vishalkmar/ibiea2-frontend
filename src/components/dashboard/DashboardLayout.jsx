import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Bell } from 'lucide-react';
import DynamicIcon from '../ui/DynamicIcon';
import { EVENT } from '../../data/siteData';

// Shared dashboard shell with collapsible sidebar. Used by exhibitor, sponsor & admin.
export default function DashboardLayout({ title, role, navItems, accent = 'gold', children, user }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-navy-700/40 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-navy-900 text-cream/70 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="font-serif font-black text-2xl text-cream">
            IBIEA <span className="text-gold">2026</span>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden text-cream/70"><X size={22} /></button>
        </div>
        <div className="px-6 py-4">
          <p className="text-xs uppercase tracking-widest text-gold font-bold">{role}</p>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? 'bg-gold text-navy shadow-gold' : 'text-cream/70 hover:bg-white/5 hover:text-cream'
                }`
              }
            >
              <DynamicIcon name={item.icon} size={19} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-cream/70 hover:bg-white/5 hover:text-cream w-full transition-colors">
            <LogOut size={19} /> Sign Out
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-40 bg-navy-900/50 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-navy-900/90 backdrop-blur border-b border-gold/20 px-5 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="lg:hidden text-cream"><Menu size={24} /></button>
            <h1 className="text-xl sm:text-2xl font-bold text-cream">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-cream/70 hover:text-gold">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold text-navy text-[10px] font-bold flex items-center justify-center">3</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-cream font-bold text-sm">
                {(user?.name || 'U').slice(0, 1)}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-cream leading-tight">{user?.name || 'User'}</p>
                <p className="text-xs text-cream/70">{user?.company || EVENT.name}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
