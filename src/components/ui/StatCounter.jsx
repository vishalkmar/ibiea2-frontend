import { useEffect, useRef, useState } from 'react';

export default function StatCounter({ value, suffix = '', label, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const startTime = performance.now();
            const tick = (now) => {
              const progress = Math.min((now - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
              setCount(Math.floor(eased * value));
              if (progress < 1) requestAnimationFrame(tick);
              else setCount(value);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-gradient-gold">
        {count}{suffix}
      </div>
      <div className="mt-2 text-sm md:text-base font-semibold tracking-wide text-cream/70 uppercase">
        {label}
      </div>
    </div>
  );
}
