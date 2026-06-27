import { Check, MapPin, Plane, Sun, Mountain, Waves, ArrowRight } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SectionHeading from '../components/ui/SectionHeading';
import EnquiryForm from '../components/ui/EnquiryForm';
import { Reveal } from '../components/ui/Motion';
import { FAMILY_TOUR } from '../data/siteData';

const ICONS = [MapPin, Sun, Mountain, Waves];

export default function FamilyTour() {
  return (
    <>
      <PageHeader
        eyebrow="Beyond the Expo"
        title="The Oman Family Tour Programme"
        subtitle="A 3–4 day journey through Oman's deserts, mountains and coastline — built around the Expo and Awards days."
        image="https://images.unsplash.com/photo-1559666126-84f389727b9a?auto=format&fit=crop&w=2000&q=80"
      />

      {/* Intro */}
      <section className="bg-transparent section-pad">
        <div className="container-x max-w-3xl text-center">
          <p className="text-xl text-cream/70 leading-relaxed">{FAMILY_TOUR.intro}</p>
        </div>
      </section>

      {/* Itinerary */}
      <section className="bg-navy-900/40 section-pad">
        <div className="container-x">
          <SectionHeading center eyebrow="Day by Day" title="Your Itinerary"
            subtitle="A sample 4-day programme. Final itinerary confirmed with our tour partner." />
          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gold/25 -translate-x-1/2" />
            <div className="space-y-10">
              {FAMILY_TOUR.itinerary.map((day, i) => {
                const Icon = ICONS[i % ICONS.length];
                const flip = i % 2 === 1;
                return (
                  <Reveal key={day.day}>
                    <div className={`lg:flex items-center gap-10 ${flip ? 'lg:flex-row-reverse' : ''}`}>
                      {/* Image */}
                      <div className="lg:w-1/2">
                        <div className="group relative rounded-2xl overflow-hidden h-60 sm:h-72 border border-gold/15 shadow-card">
                          <img src={day.img} alt={day.title} loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/20 to-transparent" />
                          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gold text-navy text-xs font-bold uppercase tracking-wide">{day.day}</span>
                        </div>
                      </div>
                      {/* Timeline node */}
                      <div className="hidden lg:flex w-12 h-12 rounded-full bg-gold-gradient text-navy font-bold items-center justify-center shrink-0 z-10 shadow-gold">{i + 1}</div>
                      {/* Content */}
                      <div className="lg:w-1/2 mt-5 lg:mt-0">
                        <div className="flex items-center gap-3">
                          <div className="icon-tile !w-12 !h-12"><Icon size={22} /></div>
                          <div>
                            <p className="text-xs uppercase tracking-widest text-gold font-bold">{day.day}</p>
                            <h3 className="font-display font-bold text-xl text-cream">{day.title}</h3>
                          </div>
                        </div>
                        <p className="mt-4 text-cream/70 leading-relaxed">{day.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Includes */}
      <section className="bg-transparent section-pad">
        <div className="container-x">
          <SectionHeading center eyebrow="What's Included" title="Everything Taken Care Of" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-3xl mx-auto">
            {FAMILY_TOUR.includes.map((inc) => (
              <div key={inc} className="card-base p-6 text-center">
                <Check size={28} className="mx-auto text-gold" />
                <p className="mt-2 font-semibold text-cream text-sm">{inc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry */}
      <section className="bg-navy-900/40 section-pad">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading eyebrow="Enquire Now" title="Plan Your Family's Oman Experience"
              subtitle="Pricing is shared on enquiry. Tell us your group size and travel dates and our team will follow up with a tailored quote." />
            <div className="flex items-center gap-3 text-cream/70">
              <Plane className="text-gold" /> Bookable alongside your registration, exhibitor or sponsor sign-up.
            </div>
          </div>
          <EnquiryForm
            kind="family_tour"
            title="Family Tour Enquiry"
            subtitle="No public pricing — request a callback with a tailored quote."
            submitLabel="Request a Callback"
            extraFields={[
              { name: 'adults', label: 'Number of Adults', type: 'text' },
              { name: 'children', label: 'Number of Children', type: 'text' },
              { name: 'days', label: 'Tour Length', type: 'select', options: ['3 Days', '4 Days'] },
              { name: 'attendeeType', label: 'You are a…', type: 'select', options: ['Delegate', 'Exhibitor', 'Sponsor', 'Visitor'] },
              { name: 'notes', label: 'Notes / Special Requirements', type: 'textarea', full: true },
            ]}
          />
        </div>
      </section>
    </>
  );
}
