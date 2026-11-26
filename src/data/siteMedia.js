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
 * Before & after case studies. Add another entry and the slider grows a
 * selector automatically — no layout changes required.
 */
export const CASE_STUDIES = [
  {
    id: 'city-office',
    location: 'City of London · EC2',
    caption:
      'A 1,400 m² office floor cleaned overnight during a fit-out handover — carpet extraction, glass, kitchens and washrooms, photographed at 06:00.',
    beforeImage: {
      src: cdn('photo-1497366754035-f200968a6e72', { w: 1400, h: 800, q: 70 }),
      alt: 'Office floor before cleaning: packing boxes, dull glazing and unpolished floors',
    },
    afterImage: {
      src: cdn('photo-1497366216548-37526070297c', { w: 1400, h: 800, q: 70 }),
      alt: 'The same office floor after a 360° clean: clear glass, spotless floors and empty surfaces',
    },
  },
  {
    id: 'manchester-tenancy',
    location: 'Manchester · M1',
    caption:
      'A three-bedroom Manchester rental on changeover — limescale, grout lines, oven internals and balcony glass, deep-cleaned in a single visit and signed off by the letting agent with no deposit deductions.',
    beforeImage: {
      src: cdn('photo-1604709177225-055f99402ea3', { w: 1400, h: 800, q: 70 }),
      alt: 'Tenant bathroom before the deep clean: dull grout, limescale on the screen and water-marked fittings',
    },
    afterImage: {
      src: cdn('photo-1620626011761-996317b8d101', { w: 1400, h: 800, q: 70 }),
      alt: 'The same style of bathroom after a 360° deep clean: descaled glass, bright grout and polished chrome',
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
