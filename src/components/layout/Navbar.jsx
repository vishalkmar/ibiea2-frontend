import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS, EVENT } from '../../data/siteData';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-navy-900/95 backdrop-blur-md shadow-lg border-b border-gold/15 py-3' : 'bg-transparent py-5'
      }`}
    >
      <nav className="container-x flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex flex-col leading-none">
            <span className="font-display font-black text-2xl tracking-tight text-cream">
              IBIEA <span className="text-gradient-gold">2.0</span>
            </span>
            <span className="text-[10px] tracking-[0.25em] uppercase text-gold/70">
              by {EVENT.parentBrand}
            </span>
          </div>
        </Link>

        <ul className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive ? 'text-gold bg-gold/10' : 'text-cream/80 hover:text-gold hover:bg-white/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/login" className="text-sm font-semibold text-cream/90 hover:text-gold transition-colors">
            Login
          </Link>
          <Link to="/register" className="btn-primary !px-5 !py-2.5 text-sm">
            Register Now
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 rounded-lg text-gold"
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden bg-navy-900 border-t border-gold/15 mt-3 shadow-card-hover">
          <ul className="container-x py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl font-semibold ${
                      isActive ? 'text-gold bg-gold/10' : 'text-cream/80 hover:bg-white/5'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="flex gap-3 mt-3 px-1">
              <Link to="/login" className="btn-secondary flex-1 !py-2.5 text-sm">Login</Link>
              <Link to="/register" className="btn-primary flex-1 !py-2.5 text-sm">Register</Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
