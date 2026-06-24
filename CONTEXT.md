# Frontend — Context & Architecture

> Read this first when continuing frontend work. Pairs with root `PROGRESS.md`.

## Stack
- **Vite** (v8) + **React 19** + plain **JavaScript** (no TS, per WRD)
- **Tailwind CSS v3** (config in `tailwind.config.js`)
- **react-router-dom** v7 for routing
- **lucide-react** for icons

⚠️ **lucide-react note:** this version DROPPED brand icons (Facebook/Instagram/Linkedin/Twitter) for trademark reasons. Social icons are inline SVG `<path>` data in `Footer.jsx`. Don't import brand icons from lucide.

⚠️ **Bundle size:** never use `import * as Icons from 'lucide-react'` — it pulls the whole set (~950KB). `DynamicIcon.jsx` uses an explicit icon map. Add new segment icons there.

## How to run
```bash
cd frontend
npm install      # first time
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

## Folder structure
```
src/
├── data/siteData.js        # ALL static content (theme layer). Edit here for copy/data changes.
├── hooks/useScrollReveal.js # IntersectionObserver fade-in
├── components/
│   ├── layout/   Navbar, Footer, PublicLayout, ScrollToTop
│   ├── ui/       SectionHeading, StatCounter, PageHeader, EnquiryForm, DynamicIcon
│   └── exhibitor/FloorPlan.jsx  # interactive SVG floor plan
├── pages/        Home, About, Exhibitors, Sponsors, Awards, Awardees,
│                 Register, FamilyTour, Contact, Login, NotFound
└── App.jsx       # routing
```

## Brand design system (Tailwind tokens)
- `gold-deep #8A6A1F`, `gold-bright #C9A227`, `sand #D9C58A`, `ivory #FFFDF7`, `umber #4A3F2A`
- Fonts: **Playfair Display** (headings), **Inter** (body) — loaded via Google Fonts in `index.css`
- Reusable classes in `index.css` @layer components: `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.container-x`, `.card-base`, `.section-pad`, `.gold-divider`, `.eyebrow`, `.text-gradient-gold`

## Key conventions
- **No public pricing anywhere.** All exhibitor/sponsor/family-tour CTAs use `EnquiryForm` ("Request a Quote / Proposal / Callback").
- Forms currently simulate success (no backend yet). Look for `// TODO: POST` markers — wire these in Phase 4.
- Hero/section background images are Unsplash URLs (placeholders) — swap for real Omani photography later.
- Content that's "pending confirmation" (dates, venue, winners, speakers) shows "To Be Announced" — driven from `siteData.js` `EVENT` object.

## Pages → WRD section mapping
| Page | WRD § | Notes |
|---|---|---|
| Home | §8 | 8 sections: Hero, Stats, Categories, Sponsors, Speakers, Awards, Schedule, FamilyTour, RegCTA |
| About | §9 | Story, Organizer (Traveon), Why Attend/Exhibit, Venue, Press kit |
| Exhibitors | §10 | Tabs: Packages, Floor Plan, Directory, Developer Projects (2026 theme) |
| Sponsors | §11 | Tiers + Benefits Matrix table + registration enquiry |
| Awards | §12 | Process, grouped categories, nomination modal (self/third-party) |
| Awardees | §12.6-7 | Hall of Fame + filterable directory |
| Register | §13 | 3-step: type (visitor/delegate) → details → confirm; family-tour add-on; mock QR ticket |
| FamilyTour | §13.6 | Itinerary timeline, includes, enquiry |
| Contact | sitemap | Info + message form |
| Login | §16.4 | JWT+OTP UI shell (2-stage), not yet wired |

## Dashboards (Phase 2 & 3 — DONE)
Routed OUTSIDE PublicLayout (own `DashboardLayout` with sidebar). Reach via `/login` → role selector.
```
src/components/dashboard/
├── DashboardLayout.jsx   # sidebar shell, used by all 3 portals
├── widgets.jsx           # StatCard, StatusBadge, Panel
└── DataTable.jsx         # reusable searchable table

src/pages/exhibitor/  → /exhibitor/*   Overview, Profile, Leads, Matchmaking, Passes, Documents
src/pages/sponsor/    → /sponsor/*     Overview, Deliverables, Payments, Passes
src/pages/admin/      → /admin/*       AdminDashboard (role-based nav), AdminOverview,
                                       Registrations, ExhibitorMgmt, SponsorMgmt, AwardsMgmt,
                                       FinanceReports, CMS, UserRoles, Analytics, RoleSwitcher
```
**Admin roles:** `super | ops | finance`. Nav is filtered by `roles[]` array in `AdminDashboard.jsx ALL_NAV`. `RoleGuard` blocks restricted routes. `RoleSwitcher` is a DEMO toggle (top of admin) — replace with JWT role in Phase 4. Access rules follow WRD §14.7 matrix (rendered in UserRoles.jsx).

⚠️ When adding dashboard nav icons, add them to `DynamicIcon.jsx` MAP or they render as fallback squares.

## What's NOT done yet (next)
- Backend API + real form submission (Phase 4) — search `// TODO: POST` markers
- Integrations: Cashfree, WhatsApp, Email, OTP (Phase 5)
- i18n / Arabic RTL, multi-currency display (later)
