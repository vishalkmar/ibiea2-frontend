export default function PageHeader({ eyebrow, title, subtitle, image }) {
  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-navy-gradient">
        {image && (
          <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url('${image}')` }} />
        )}
        <div className="absolute inset-0 lux-pattern" />
        <div className="absolute inset-0 lux-dots opacity-40" />
      </div>
      <div className="container-x relative z-10 text-center">
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-cream leading-tight max-w-4xl mx-auto">{title}</h1>
        <div className="gold-divider mx-auto mt-6" />
        {subtitle && <p className="mt-6 text-lg text-cream/70 max-w-2xl mx-auto">{subtitle}</p>}
      </div>
    </section>
  );
}
