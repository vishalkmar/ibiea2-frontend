import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { EVENT, NAV_LINKS } from '../../data/siteData';

// lucide-react dropped brand icons (trademark). Inline minimal brand glyphs.
const SOCIALS = [
  { label: 'Facebook', path: 'M13 22v-8h2.7l.4-3H13V9.1c0-.9.2-1.5 1.5-1.5H16V5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.4-3.8 3.9V11H7.5v3H10v8h3z' },
  { label: 'Instagram', path: 'M12 7.4a4.6 4.6 0 100 9.2 4.6 4.6 0 000-9.2zm0 7.6a3 3 0 110-6 3 3 0 010 6zm4.8-7.8a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0zM12 4.2c-2.2 0-2.5 0-3.3.05-2.7.12-4.3 1.7-4.4 4.4C4.2 9.5 4.2 9.8 4.2 12s0 2.5.05 3.3c.12 2.7 1.7 4.3 4.4 4.4.8.05 1.1.05 3.3.05s2.5 0 3.3-.05c2.7-.12 4.3-1.7 4.4-4.4.05-.8.05-1.1.05-3.3s0-2.5-.05-3.3c-.12-2.7-1.7-4.3-4.4-4.4-.8-.05-1.1-.05-3.3-.05z' },
  { label: 'LinkedIn', path: 'M6.5 8.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM5.2 18.5h2.6v-8.3H5.2v8.3zm4.3 0h2.6v-4.4c0-1.2.2-2.3 1.7-2.3s1.5 1.3 1.5 2.4v4.3h2.6v-4.8c0-2.3-.5-4-3.1-4-1.3 0-2.1.7-2.5 1.3h.03v-1.1H9.5v8.6z' },
  { label: 'X', path: 'M17.5 5h2.4l-5.3 6 6.2 8h-4.8l-3.8-4.9L7.5 19H5l5.6-6.4L4.7 5h4.9l3.4 4.5L17.5 5z' },
];

export default function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-gold/15 text-cream/70">
      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-display font-black text-3xl text-cream">
              IBIEA <span className="text-gradient-gold">2.0</span>
            </div>
            <p className="mt-1 text-xs tracking-[0.25em] uppercase text-gold/70">
              Powered by {EVENT.parentBrand}
            </p>
            <p className="mt-5 text-sm leading-relaxed text-cream/60 max-w-xs">
              The International Business & Infrastructure Expo & Awards — connecting developers,
              designers, brands and industry leaders under one roof.
            </p>
            <div className="flex gap-3 mt-6">
              {SOCIALS.map((s) => (
                <a key={s.label} href="#" aria-label={s.label} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cream/70 hover:bg-gold hover:text-navy hover:border-gold transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-gold font-semibold text-lg mb-5">Explore</h4>
            <ul className="space-y-3 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.to}><Link to={link.to} className="hover:text-gold transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gold font-semibold text-lg mb-5">Participate</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/exhibitors" className="hover:text-gold transition-colors">Become an Exhibitor</Link></li>
              <li><Link to="/sponsors" className="hover:text-gold transition-colors">Sponsor the Event</Link></li>
              <li><Link to="/awards" className="hover:text-gold transition-colors">Submit a Nomination</Link></li>
              <li><Link to="/register" className="hover:text-gold transition-colors">Register to Attend</Link></li>
              <li><Link to="/family-tour" className="hover:text-gold transition-colors">Family Tour Programme</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold font-semibold text-lg mb-5">Get in Touch</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3"><MapPin size={18} className="text-gold shrink-0 mt-0.5" /><span>{EVENT.city}</span></li>
              <li className="flex items-center gap-3"><Mail size={18} className="text-gold shrink-0" /><a href={`mailto:${EVENT.contactEmail}`} className="hover:text-gold transition-colors">{EVENT.contactEmail}</a></li>
              <li className="flex items-center gap-3"><Phone size={18} className="text-gold shrink-0" /><a href={`tel:${EVENT.contactPhone}`} className="hover:text-gold transition-colors">{EVENT.contactPhone}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream/50">
          <p>© {new Date().getFullYear()} IBIEA — A {EVENT.parentBrand} Flagship Event. All rights reserved.</p>
          <p>International Business & Infrastructure Expo & Awards</p>
        </div>
      </div>
    </footer>
  );
}
