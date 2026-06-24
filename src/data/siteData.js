// IBIEA 2026 — Central static content (theme-layer configurable via CMS in future)
// No pricing anywhere per WRD policy.

export const EVENT = {
  name: 'IBIEA 2.0',
  fullName: 'International Business & Infrastructure Expo & Awards',
  tagline: 'Connecting Developers, Interior Designers, Home Decor Brands, Material Providers & Industry Leaders Under One Roof',
  parentBrand: 'Traveon',
  theme2026: 'Real Estate Developers & Their Projects',
  // Pending confirmation — placeholders
  dates: 'Dates To Be Announced',
  dateISO: '2026-12-12T09:00:00', // countdown target (update when confirmed)
  time: '09:00 AM onwards',
  city: 'Muscat, Sultanate of Oman',
  venue: 'Oman Convention & Exhibition Centre',
  contactEmail: 'info@ibiea.com',
  contactPhone: '+968 0000 0000',
};

export const HERO_CTAS = [
  { label: 'Register Now', to: '/register', primary: true },
  { label: 'Book Your Stall', to: '/exhibitors' },
  { label: 'Nominate for Awards', to: '/awards' },
  { label: 'Become a Sponsor', to: '/sponsors' },
];

export const WHY_ATTEND = [
  { icon: 'Users', title: 'Meet Industry Leaders', desc: 'Connect with developers, investors and decision-makers in one room.' },
  { icon: 'Building2', title: 'Discover New Projects', desc: 'Explore flagship developments and upcoming launches first-hand.' },
  { icon: 'Handshake', title: 'Find Business Opportunities', desc: 'Source partners, suppliers and deals across the value chain.' },
  { icon: 'Lightbulb', title: 'Gain Industry Insights', desc: 'Learn from keynote sessions and expert panel discussions.' },
  { icon: 'Network', title: 'Expand Your Network', desc: 'Build relationships through structured networking and matchmaking.' },
];

export const WHY_EXHIBIT = [
  { icon: 'Target', title: 'Generate Qualified Leads', desc: 'Capture high-intent buyers with digital lead scanning.' },
  { icon: 'Package', title: 'Showcase Products', desc: 'Present your offering on a premium international stage.' },
  { icon: 'Rocket', title: 'Launch New Projects', desc: 'Debut flagship developments to an engaged audience.' },
  { icon: 'Handshake', title: 'Meet Buyers Directly', desc: 'Face-to-face access to serious, ready-to-transact buyers.' },
  { icon: 'TrendingUp', title: 'Increase Brand Visibility', desc: 'Position your brand alongside industry leaders.' },
];

export const TESTIMONIALS = [
  { quote: 'IBIEA connected us with serious buyers we simply could not reach elsewhere. The quality of footfall was exceptional.', name: 'A. Developer', role: 'Exhibitor · Real Estate', initial: 'A' },
  { quote: 'As a sponsor, the brand visibility and stage presence delivered real ROI. A truly premium platform.', name: 'M. Brand', role: 'Sponsor · Building Materials', initial: 'M' },
  { quote: 'The sessions and networking were world-class. I left with insights and contacts that mattered.', name: 'S. Visitor', role: 'Delegate · Investment', initial: 'S' },
  { quote: 'Winning at the IBIEA Awards gave our studio recognition that opened doors across the region.', name: 'R. Studio', role: 'Award Winner · Interior Design', initial: 'R' },
];

export const FAQS = [
  { q: 'How do I register as a visitor?', a: 'Click Register Now, choose the Visitor tier, fill the short form, and receive a digital QR ticket instantly by email and WhatsApp.' },
  { q: 'How can my company exhibit?', a: 'Visit the Exhibitors page to view packages and the interactive floor plan, then request a quote. Our team shares pricing privately and sends a secure payment link.' },
  { q: 'What sponsorship tiers are available?', a: 'Title, Platinum, Gold and Silver tiers are available. Request a proposal and our sponsorship team will follow up with tailored terms.' },
  { q: 'How do award nominations work?', a: 'Open the Awards page, pick a category, and submit a self or third-party nomination. A jury scores entries against published criteria before winners are announced.' },
  { q: 'Is there an entry fee for visitors?', a: 'General visitor access is available; premium Delegate access includes sessions and the awards ceremony. Details are shown at registration.' },
];

export const PREVIOUS_STATS = [
  { value: 5000, suffix: '+', label: 'Visitors' },
  { value: 200, suffix: '+', label: 'Exhibitors' },
  { value: 100, suffix: '+', label: 'Award Winners' },
  { value: 50, suffix: '+', label: 'Speakers' },
  { value: 90, suffix: '%', label: 'Satisfaction Rate' },
];

export const HIGHLIGHT_STATS = [
  { value: 150, suffix: '+', label: 'Exhibitors' },
  { value: 300, suffix: '+', label: 'Delegates' },
  { value: 25, suffix: '+', label: 'Speakers' },
  { value: 15, suffix: '+', label: 'Award Categories' },
  { value: 50, suffix: '+', label: 'Sponsors & Partners' },
  { value: 3, suffix: '', label: 'Days of Networking' },
];

export const GALLERY = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
];

export const SPONSOR_CATEGORIES = ['Title Sponsor', 'Powered By', 'Gold Sponsor', 'Silver Sponsor', 'Associate Sponsor', 'Media Partner'];

export const STATS = [
  { value: 150, suffix: '+', label: 'Exhibitors' },
  { value: 300, suffix: '+', label: 'Participants' },
  { value: 11, suffix: '', label: 'Industry Segments' },
  { value: 12, suffix: '+', label: 'Award Categories' },
];

export const INDUSTRY_SEGMENTS = [
  { id: 'developers', name: 'Real Estate Developers', icon: 'Building2', featured: true,
    desc: 'Residential, commercial & mixed-use project developers — the 2026 spotlight segment.' },
  { id: 'builders', name: 'Builders', icon: 'HardHat',
    desc: 'Construction firms executing development and infrastructure projects.' },
  { id: 'consultants', name: 'Property Consultants', icon: 'Handshake',
    desc: 'Brokerage, advisory and transaction facilitation firms.' },
  { id: 'interior', name: 'Interior Designers', icon: 'Sofa',
    desc: 'Residential and commercial interior design practices and studios.' },
  { id: 'decor', name: 'Home Decor Brands', icon: 'Lamp',
    desc: 'Furnishing, fixtures, fittings and decorative product brands.' },
  { id: 'materials', name: 'Construction Materials', icon: 'Package',
    desc: 'Manufacturers and distributors of building materials.' },
  { id: 'smarthome', name: 'Smart Home Technology', icon: 'Cpu',
    desc: 'Home automation, IoT and connected-living solution providers.' },
  { id: 'architects', name: 'Architects', icon: 'Compass',
    desc: 'Architectural design and planning practices.' },
  { id: 'infrastructure', name: 'Infrastructure Companies', icon: 'Construction',
    desc: 'Large-scale infrastructure development and engineering firms.' },
  { id: 'finance', name: 'Financial & Mortgage', icon: 'Landmark',
    desc: 'Banks, NBFCs and mortgage facilitation providers for real estate.' },
  { id: 'proptech', name: 'PropTech', icon: 'Rocket',
    desc: 'Technology platforms and startups innovating across the property lifecycle.' },
];

export const SPONSOR_TIERS = [
  { id: 'title', name: 'Title Sponsor', accent: '#C9A227', highlight: true,
    scope: 'Exclusive event-wide title association — the most prominent brand position at IBIEA 2026.' },
  { id: 'platinum', name: 'Platinum', accent: '#8A6A1F',
    scope: 'Premium visibility across stage, signage and digital channels.' },
  { id: 'gold', name: 'Gold', accent: '#C4A85A',
    scope: 'Strong brand presence with speaking and showcase opportunities.' },
  { id: 'silver', name: 'Silver', accent: '#9CA3AF',
    scope: 'Foundational brand association and event visibility.' },
];

export const BENEFITS_MATRIX = {
  tiers: ['Silver', 'Gold', 'Platinum', 'Title'],
  rows: [
    { benefit: 'Website logo placement', values: ['Yes', 'Yes', 'Yes', 'Premium / Top'] },
    { benefit: 'Speaking slot', values: ['No', 'Optional', 'Yes', 'Yes — Keynote'] },
    { benefit: 'Complimentary passes', values: ['2', '5', '10', '20'] },
    { benefit: 'Stall space included', values: ['No', 'Shared', 'Standard', 'Premium'] },
    { benefit: 'Award co-branding', values: ['No', 'No', 'Optional', 'Yes'] },
    { benefit: 'Signage & collateral logo', values: ['Yes', 'Yes', 'Premium', 'Premium / Top'] },
    { benefit: 'Pre/post-event comms', values: ['No', 'Yes', 'Yes', 'Yes'] },
    { benefit: 'Social media features', values: ['Shared', 'Dedicated', 'Dedicated', 'Premium'] },
    { benefit: 'Attendee list access', values: ['No', 'No', 'Yes', 'Yes'] },
  ],
};

export const EXHIBITOR_PACKAGES = [
  { id: 'startup', name: 'Startup Stall', popular: false,
    features: ['Compact stall footprint', '2 complimentary passes', 'Directory listing', 'Logo on website'] },
  { id: 'standard', name: 'Standard', popular: true,
    features: ['Standard stall footprint', '4 complimentary passes', 'Featured directory listing', 'Logo placement + signage', 'Matchmaking access'] },
  { id: 'premium', name: 'Premium', popular: false,
    features: ['Premium stall footprint', '8 complimentary passes', 'Priority directory placement', 'Speaking slot opportunity', 'Full matchmaking + lead tools'] },
  { id: 'developer', name: 'Developer Showcase', popular: false, themed: true,
    features: ['Large premium footprint', '10 complimentary passes', 'Developer Projects Showcase', 'Featured on Home carousel', 'Dedicated project pages'] },
];

export const AWARD_CATEGORIES = [
  // Developer-led (2026 theme — listed first)
  { id: 'dev-year', group: 'Developer Awards (2026 Theme)', name: 'Developer of the Year', themed: true,
    desc: 'Recognising the developer demonstrating outstanding excellence across delivery, innovation and impact.' },
  { id: 'mixed-use', group: 'Developer Awards (2026 Theme)', name: 'Best Mixed-Use Project', themed: true,
    desc: 'Awarded to the most outstanding mixed-use development brought to market.' },
  { id: 'masterplan', group: 'Developer Awards (2026 Theme)', name: 'Best Master-Planned Community', themed: true,
    desc: 'Celebrating excellence in large-scale, master-planned community development.' },
  { id: 'residential', group: 'Developer Awards (2026 Theme)', name: 'Best Residential Project', themed: true,
    desc: 'Honouring the finest residential development of the year.' },
  // Cross-industry
  { id: 'proptech-innov', group: 'Industry Excellence', name: 'PropTech Innovation Award',
    desc: 'For the most innovative technology platform transforming the property lifecycle.' },
  { id: 'interior-exc', group: 'Industry Excellence', name: 'Interior Design Excellence',
    desc: 'Recognising exceptional residential or commercial interior design.' },
  { id: 'architect', group: 'Industry Excellence', name: 'Architectural Design Award',
    desc: 'Celebrating outstanding architectural vision and execution.' },
  { id: 'sustainable', group: 'Industry Excellence', name: 'Sustainable Development Award',
    desc: 'For projects setting the benchmark in sustainable, green development.' },
  { id: 'smart-home', group: 'Industry Excellence', name: 'Smart Home Solution of the Year',
    desc: 'Honouring the best connected-living and home automation solution.' },
  // Cross-cutting
  { id: 'leader', group: 'Special Recognition', name: 'Real Estate Business Leader of the Year',
    desc: 'The overall industry leadership honour across the real estate ecosystem.' },
  { id: 'lifetime', group: 'Special Recognition', name: 'Lifetime Achievement Award',
    desc: 'Recognising a lifetime of contribution to the real estate and business community.' },
  { id: 'rising', group: 'Special Recognition', name: 'Rising Star Award',
    desc: 'For emerging companies and individuals making a remarkable early impact.' },
];

export const SCHEDULE = [
  { day: 'Day 1', title: 'Exhibition & Opening', items: [
    { time: '09:00', label: 'Registration & Welcome' },
    { time: '10:00', label: 'Grand Opening Ceremony' },
    { time: '11:00', label: 'Exhibition Floor Opens' },
    { time: '14:00', label: 'Keynote: Future of Real Estate' },
    { time: '16:00', label: 'Networking Lounge' },
  ]},
  { day: 'Day 2', title: 'Sessions & Networking', items: [
    { time: '09:30', label: 'Developer Panel Sessions' },
    { time: '11:00', label: 'Exhibition Floor & Matchmaking' },
    { time: '13:00', label: 'Investor Roundtables' },
    { time: '15:00', label: 'PropTech Showcase' },
    { time: '17:00', label: 'Business Networking Mixer' },
  ]},
  { day: 'Day 3', title: 'Awards Ceremony', items: [
    { time: '10:00', label: 'Final Exhibition Day' },
    { time: '14:00', label: 'Shortlist Showcase' },
    { time: '18:00', label: 'Gala Awards Ceremony' },
    { time: '20:00', label: 'Winners Announcement & Hall of Fame' },
    { time: '21:00', label: 'Closing Gala Dinner' },
  ]},
];

export const SPEAKERS = [
  { name: 'To Be Announced', role: 'Keynote Speaker', company: 'Industry Leader', topic: 'The Future of Real Estate Development' },
  { name: 'To Be Announced', role: 'Panellist', company: 'PropTech Pioneer', topic: 'Technology in Property' },
  { name: 'To Be Announced', role: 'Panellist', company: 'Investment Authority', topic: 'Cross-Border Investment' },
  { name: 'To Be Announced', role: 'Session Leader', company: 'Design Studio', topic: 'Designing Communities' },
];

export const SPONSORS_SHOWCASE = [
  { tier: 'Title', names: ['Your Brand Here'] },
  { tier: 'Platinum', names: ['Brand', 'Brand'] },
  { tier: 'Gold', names: ['Brand', 'Brand', 'Brand'] },
  { tier: 'Silver', names: ['Brand', 'Brand', 'Brand', 'Brand'] },
];

export const FAMILY_TOUR = {
  intro: "Turn a business trip into a family experience. While you attend the Expo and Awards, your family can explore Oman's deserts, mountains and coastline.",
  itinerary: [
    { day: 'Day 1', title: 'Muscat City & Old Town', desc: 'Grand Mosque, Mutrah Souq, Royal Opera House and the Corniche.' },
    { day: 'Day 2', title: 'Desert Dune Adventure', desc: 'Wahiba Sands dune drive, Bedouin hospitality and a desert sunset camp.' },
    { day: 'Day 3', title: 'Wadis & Mountains', desc: 'Wadi Shab natural pools and the dramatic Hajar mountain landscapes.' },
    { day: 'Day 4', title: 'Coastal & Dhow Cruise', desc: 'A traditional dhow cruise along the coast and a farewell seaside experience.' },
  ],
  includes: ['Private transport', 'Professional guide', 'Daily meals', 'Activity & entry tickets'],
};

export const HALL_OF_FAME = [
  // Evergreen — populated as winners are announced
  { name: 'To Be Announced', company: '', category: 'Developer of the Year', edition: '2026', citation: 'Winner to be revealed at the Gala Awards Ceremony.' },
  { name: 'To Be Announced', company: '', category: 'Best Mixed-Use Project', edition: '2026', citation: 'Winner to be revealed at the Gala Awards Ceremony.' },
  { name: 'To Be Announced', company: '', category: 'PropTech Innovation', edition: '2026', citation: 'Winner to be revealed at the Gala Awards Ceremony.' },
];

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/exhibitors', label: 'Exhibitors' },
  { to: '/sponsors', label: 'Sponsors' },
  { to: '/awards', label: 'Awards' },
  { to: '/awardees', label: 'Awardees' },
  { to: '/family-tour', label: 'Family Tour' },
  { to: '/contact', label: 'Contact' },
];
