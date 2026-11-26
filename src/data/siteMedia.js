// ---------------------------------------------------------------------------
// Central media map — every photograph on the site is declared here.
//
// Swapping a picture never means touching a component: replace the `src` with
// your own client job photo, a Sanity CDN URL, or an object-store URL. Each
// entry is { src, alt, srcSet? }; `alt` is required for accessibility.
//
// The defaults below are hosted, hotlinkable Unsplash URLs sized through their
// image CDN (w/h/q params), so they stay sharp on retina screens without
// shipping megabytes to the browser.
// ---------------------------------------------------------------------------

const cdn = (id, { w = 1000, h, q = 68 } = {}) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=${q}`

/** One image per service card, keyed by the service `id` in content.js. */
export const SERVICE_MEDIA = {
  'commercial-office': {
    src: cdn('photo-1497366811353-6870744d04b2', { w: 900, h: 560 }),
    alt: 'Open-plan office with spotless glazed meeting rooms and polished flooring',
  },
  'facility-management': {
    src: cdn('photo-1600585154526-990dced4db0d', { w: 900, h: 560 }),
    alt: 'Modern commercial building exterior at dusk with a lit reception entrance',
  },
  'end-of-tenancy': {
    src: cdn('photo-1615874959474-d609969a20ed', { w: 900, h: 560 }),
    alt: 'Freshly deep-cleaned bedroom with dressed bed, clear surfaces and vacuum lines on the carpet',
  },
  'specialist-hygiene': {
    src: cdn('photo-1581578731548-c64695cc6952', { w: 900, h: 560 }),
    alt: 'Operative cleaning interior window glass by hand in a commercial property',
  },
  'post-construction': {
    src: cdn('photo-1553413077-190dd305871c', { w: 900, h: 560 }),
    alt: 'Dust-free warehouse aisle and racking after a post-construction clean',
  },
  'eco-supplies': {
    src: cdn('photo-1563453392212-326f5e854473', { w: 900, h: 560 }),
    alt: 'Eco-grade cleaning spray held in a gloved hand',
  },
}

/**
 * Before & after case studies.
 *
 * Each pair is two genuinely different photographs: the "before" frame shows a
 * room as it was found — cluttered, unmade, used — and the "after" frame is a
 * separate shot of a freshly cleaned room of the same type. No filter, tint or
 * CSS trick is used to fake the transformation; if the two URLs were ever the
 * same, the slider would be pointless.
 *
 * Swap `src` for a client job photo or a Sanity CDN URL whenever real
 * before/after images exist — nothing else has to change.
 *
 * Add another entry and the slider grows a selector automatically.
 */
export const CASE_STUDIES = [
  {
    id: 'city-office',
    location: 'City of London · EC2',
    caption:
      'A 1,400 m² office floor taken over at fit-out handover. The communal kitchen alone took two hours — degreasing every surface, clearing crockery, descaling the taps and resetting the cupboards before the client walk-through at 06:00.',
    beforeImage: {
      src: cdn('photo-1713950788917-912f9274f123', { w: 1400, h: 800, q: 70 }),
      alt: 'Staff kitchen before cleaning: sink piled with dirty crockery and pans, open food packets, used mugs and crumbs across every worktop',
    },
    afterImage: {
      src: cdn('photo-1484154218962-a197022b5858', { w: 1400, h: 800, q: 70 }),
      alt: 'A spotless kitchen after the 360° clean: empty sink, clear white worktops, polished hob and wiped cupboard fronts',
    },
  },
  {
    id: 'manchester-tenancy',
    location: 'Manchester · M1',
    caption:
      'A three-bedroom Manchester rental on changeover — bedding stripped and laundered, every room reset, bathroom descaled and floors machine-cleaned in a single visit, then signed off by the letting agent with no deposit deductions.',
    beforeImage: {
      src: cdn('photo-1564019472231-4586c552dc27', { w: 1400, h: 800, q: 70 }),
      alt: 'Tenant bedroom as found at changeover: bed stripped back with creased, tangled linen and the duvet thrown across the mattress',
    },
    afterImage: {
      src: cdn('photo-1612152605347-f93296cb657d', { w: 1400, h: 800, q: 70 }),
      alt: 'An immaculate bedroom after the 360° clean and reset: crisply made bed, dressed pillows, clear surfaces and vacuumed carpet',
    },
  },
]

/** Small facility showcase strip in the compliance section. */
export const FACILITY_SHOWCASE = [
  {
    label: 'Reception & front of house',
    src: cdn('photo-1524758631624-e2822e304c36', { w: 700, h: 520 }),
    alt: 'Clean reception lounge with spotless seating and glass partitions',
  },
  {
    label: 'Washrooms & hygiene',
    src: cdn('photo-1584622650111-993a426fbf0a', { w: 700, h: 520 }),
    alt: 'Sterile washroom with streak-free mirrors and sanitised touchpoints',
  },
  {
    label: 'Occupied floors, zero disruption',
    src: cdn('photo-1521737604893-d14cc237f11d', { w: 700, h: 520 }),
    alt: 'Team working in a clean, well-maintained meeting space',
  },
]
