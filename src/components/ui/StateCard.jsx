import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { EVENT } from '../../data/siteData';
import { Reveal } from './Motion';

const TARGET = EVENT?.dateISO || '2026-12-31T23:59:59';
const EASE = [0.22, 1, 0.36, 1];

function calc() {
  const diff = +new Date(TARGET) - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

// A rolling number that animates (odometer-style) whenever its value changes.
function RollingNumber({ value }) {
  const str = String(value).padStart(2, '0');
  return (
    <div className="relative h-[1.1em] overflow-hidden flex justify-center">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={str}
          initial={{ y: '-110%', opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '110%', opacity: 0, filter: 'blur(4px)' }}
          transition={{ duration: 0.5, ease: EASE }}
          className="block font-display font-black tabular-nums gold-shine leading-none"
        >
          {str}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function Unit({ value, label, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
      whileHover={{ y: -5 }}
      className="group relative w-20 sm:w-28 lg:w-32"
    >
      <div className="absolute -inset-1 rounded-3xl bg-gold/15 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative rounded-2xl bg-gradient-to-b from-navy-700/80 to-navy-900/80 border border-gold/30 backdrop-blur-sm shadow-card py-5 sm:py-6 overflow-hidden">
        <span className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="text-4xl sm:text-5xl lg:text-6xl px-2">
          <RollingNumber value={value} />
        </div>
        <div className="text-[10px] sm:text-xs text-cream/55 uppercase tracking-[0.2em] mt-2 text-center">{label}</div>
      </div>
    </motion.div>
  );
}

export default function Countdown() {
  const [t, setT] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { v: t.days, l: 'Days' },
    { v: t.hours, l: 'Hours' },
    { v: t.minutes, l: 'Minutes' },
    { v: t.seconds, l: 'Seconds' },
  ];

  return (
    <section className="section-pad bg-navy-900 border-y border-gold/15 relative overflow-hidden">
      <div className="absolute inset-0 lux-pattern" />
      <div className="absolute inset-0 hero-glow opacity-60" />

      <div className="container-x relative z-10 text-center">
        <Reveal>
          <p className="eyebrow mb-3">The Countdown Has Begun</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-cream">
            IBIEA <span className="gold-shine">2.0</span> Begins In
          </h2>
        </Reveal>

        <div className="flex justify-center items-stretch gap-3 sm:gap-5 mt-12">
          {units.map((u, i) => (
            <div key={u.l} className="flex items-center gap-3 sm:gap-5">
              <Unit value={u.v} label={u.l} index={i} />
              {i < units.length - 1 && (
                <motion.span
                  animate={{ opacity: [1, 0.25, 1] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                  className="hidden sm:block font-display text-3xl lg:text-4xl text-gold/60 -mt-4"
                >:</motion.span>
              )}
            </div>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <Link to="/register" className="btn-primary">Reserve Your Spot <ArrowRight size={18} /></Link>
            <button className="btn-secondary"><Download size={18} /> Download Event Brochure</button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
