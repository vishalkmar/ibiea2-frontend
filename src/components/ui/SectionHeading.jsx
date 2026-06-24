import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function SectionHeading({ eyebrow, title, subtitle, center = false }) {
  const ref = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`animate-on-scroll max-w-3xl ${center ? 'mx-auto text-center' : ''} mb-12`}
    >
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-cream">
        {title}
      </h2>
      <div className={`gold-divider mt-5 ${center ? 'mx-auto' : ''}`} />
      {subtitle && <p className="mt-5 text-lg text-cream/70">{subtitle}</p>}
    </div>
  );
}
