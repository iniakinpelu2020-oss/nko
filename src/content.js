// ---------------------------------------------------------------------------
// Fallback content (CMS-ready data structure).
// These objects mirror the shapes served by Sanity (see src/sanity.js) so the
// preview renders fully populated before a dataset is connected.
// ---------------------------------------------------------------------------

export const COMPANY = {
  name: 'IDEAL FRESH 360 CLEANING AND FACILITY SERVICE LTD',
  shortName: 'IDEAL FRESH 360',
  phoneDisplay: '+44 7831 678297',
  phoneE164: '+447831678297',
  whatsapp: 'https://wa.me/447831678297',
  email: 'hello@idealfresh360.co.uk',
  coverage: [
    'London & Greater London',
    'Birmingham & the Midlands',
    'Manchester & the North West',
    'Leeds, Sheffield & Yorkshire',
    'Bristol & the South West',
    'Nationwide contract mobilisation',
  ],
  hours: 'Mon–Sat 07:00–19:00 · 24/7 facility response',
}

export function waLink(message) {
  return `${COMPANY.whatsapp}?text=${encodeURIComponent(message)}`
}

export const HERO_BADGES = [
  'UK Insured & DBS Checked',
  'Eco-Grade Commercial Standards',
  '24/7 Facility Response',
]

export const STATS = [
  { value: '£5M+', label: 'Public liability cover', note: 'Fully insured, certificates on request' },
  { value: 'DBS', label: 'Vetted operatives', note: 'Every site team checked & badged' },
  { value: 'COSHH', label: 'Trained teams', note: 'Safe handling of every chemical we use' },
  { value: '100%', label: 'Re-clean guarantee', note: 'Not spotless? We return, free' },
]

export const SERVICES = [
  {
    id: 'commercial-office',
    icon: 'building',
    title: 'Commercial & Office Cleaning',
    blurb:
      'Daily, nightly and out-of-hours contract cleaning for offices, clinics and professional suites — delivered to a written specification and signed off by a supervisor.',
    points: ['Daily / nightly contracts', 'Washroom & kitchen hygiene', 'Glass, desks & touchpoints'],
    meta: 'Contract · from £180 per visit',
  },
  {
    id: 'facility-management',
    icon: 'tools',
    title: 'Total Facility Management & Maintenance',
    blurb:
      'One accountable partner for cleaning, consumables, waste, grounds, reactive repairs and PPM scheduling — with a named account manager and 24/7 escalation line.',
    points: ['Hard & soft FM', 'Reactive call-outs', 'PPM scheduling & reporting'],
    meta: 'Managed service · bespoke',
  },
  {
    id: 'end-of-tenancy',
    icon: 'key',
    title: 'End-of-Tenancy & Move-In Deep Cleaning',
    blurb:
      'Deposit-grade deep cleans built to letting-agent checklists: inside cupboards, oven interiors, limescale removal, skirtings, extractors and balcony glass.',
    points: ['Agent-approved checklist', 'Oven & appliance internals', 'Same-week scheduling'],
    meta: 'One-off · from £220',
  },
  {
    id: 'specialist-hygiene',
    icon: 'sparkle',
    title: 'Specialist Carpet, Upholstery & Window Hygiene',
    blurb:
      'Hot-water extraction and low-moisture encapsulation for carpets, plus high-reach window and façade cleaning that lifts a whole building’s first impression.',
    points: ['Hot-water extraction', 'Stain & odour treatment', 'High-reach window cleaning'],
    meta: 'Specialist · quoted per m²',
  },
  {
    id: 'post-construction',
    icon: 'helmet',
    title: 'Post-Construction & Industrial Sanitization',
    blurb:
      'Builders’ cleans that pass handover: dust suppression, plaster and adhesive removal, machine-scrubbed floors and electrostatic sanitising of high-touch industrial assets.',
    points: ['Handover-ready finish', 'Electrostatic sanitising', 'Site-safe RAMS supplied'],
    meta: 'Project · from £260',
  },
  {
    id: 'eco-supplies',
    icon: 'leaf',
    title: 'Eco-Friendly Contract Hygiene Supplies',
    blurb:
      'Scheduled consumable replenishment — recycled paper, low-VOC chemicals, dispensers and waste streams — cutting single-use plastic without cutting standards.',
    points: ['Recycled consumables', 'Low-VOC chemicals', 'Managed stock levels'],
    meta: 'Supply contract · monthly',
  },
]

export const TRUST_POINTS = [
  {
    title: 'UK Health & Safety compliance',
    body: 'Site-specific risk assessments and method statements (RAMS) issued before every mobilisation, with COSHH data sheets held for every product on site.',
  },
  {
    title: 'COSHH-trained operatives',
    body: 'Teams are trained in the safe storage, dilution and disposal of chemicals — protecting your people, your surfaces and your building’s compliance record.',
  },
  {
    title: 'DBS-vetted staff',
    body: 'Enhanced DBS checks, right-to-work verification, uniformed and photo-badged operatives. The same vetted team, not a rotating agency roster.',
  },
  {
    title: '£5M+ public liability',
    body: 'Comprehensive public liability and employer’s liability cover, with certificates supplied as standard in your tender pack.',
  },
  {
    title: '100% satisfaction re-clean',
    body: 'If a single area falls short of the agreed specification, we return and re-clean it at no cost — logged, inspected and signed off within 24 hours.',
  },
  {
    title: 'Audited quality, in writing',
    body: 'Digital checklists, photographic evidence and monthly performance reporting give facilities managers a clean audit trail — not just a clean building.',
  },
]

export const TESTIMONIALS = [
  {
    quote:
      'We moved 340 staff into a newly fitted-out floor and needed it handed over spotless in five days. IDEAL FRESH 360 mobilised two teams, worked nights, and passed our building manager’s snag list first time.',
    name: 'Rebecca Aylward',
    role: 'Facilities Manager · Financial services, London EC2',
  },
  {
    quote:
      'The weekly contract has run for fourteen months without a single missed visit. Their supervisor sends photo sign-offs, which our regional audits now rely on entirely.',
    name: 'Daniel Okonjo',
    role: 'Regional Operations Lead · Retail group, Birmingham',
  },
  {
    quote:
      'Our end-of-tenancy clean was the difference between a full deposit return and a dispute. Oven, extractor, limescale, balcony glass — the agent signed it off with no deductions.',
    name: 'Sophie Marsden',
    role: 'Lettings Manager · Manchester',
  },
]

// Quote estimator configuration -------------------------------------------------
export const ESTIMATOR = {
  propertyTypes: [
    { id: 'commercial', label: 'Commercial Office', base: 180, note: 'Desks, washrooms, kitchen, meeting suites' },
    { id: 'residential', label: 'Residential Home', base: 120, note: 'Homes, flats and serviced apartments' },
    { id: 'tenancy', label: 'End of Tenancy', base: 220, note: 'Deposit-grade, agent checklist' },
    { id: 'industrial', label: 'Industrial / Retail', base: 260, note: 'Warehouse, showroom, unit floors' },
  ],
  frequencies: [
    { id: 'oneoff', label: 'One-Off Deep Clean', factor: 1, note: 'Single intensive visit' },
    { id: 'weekly', label: 'Weekly', factor: 0.82, note: 'Best value per visit' },
    { id: 'biweekly', label: 'Bi-Weekly', factor: 0.9, note: 'Fortnightly contract' },
    { id: 'daily', label: 'Daily Contract', factor: 0.7, note: 'Volume rate, per visit' },
  ],
  sizes: [
    { id: 'small', label: '1–2 Bed / Small Office', factor: 0.8, note: 'Up to 60 m²' },
    { id: 'medium', label: '3–4 Bed / Mid Office', factor: 1.15, note: '60–200 m²' },
    { id: 'large', label: '5+ Bed / Large Office', factor: 1.6, note: '200–600 m²' },
    { id: 'facility', label: 'Large Facility / Multi-Site', factor: 2.2, note: '600 m²+' },
  ],
}

export function estimate({ property, frequency, size }) {
  const p = ESTIMATOR.propertyTypes.find((x) => x.id === property)
  const f = ESTIMATOR.frequencies.find((x) => x.id === frequency)
  const s = ESTIMATOR.sizes.find((x) => x.id === size)
  if (!p || !f || !s) return null
  const low = p.base * f.factor * s.factor
  const round5 = (n) => Math.round(n / 5) * 5
  return { low: round5(low), high: round5(low * 1.35) }
}
