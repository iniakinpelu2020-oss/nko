// ---------------------------------------------------------------------------
// Read-only Sanity CMS layer.
//
// Public, CDN-backed, read-only reads. Nothing here can write, and no token or
// webhook URL ever reaches the browser. If the environment variables are not
// set (or the request fails), the bundled fallback content in src/content.js is
// used untouched — the site is never left half-empty.
//
// Expected Sanity documents (all optional):
//   siteSettings: { companyName, phoneDisplay, phoneE164, whatsapp, email,
//                   coverage: string[], hours }
//   service:      { _id, order, title, blurb, points: string[], meta, icon }
//   testimonial:  { _id, quote, name, role }
//   heroBadge:    { _id, label }
//   galleryItem:  { _id, title, beforeImage, afterImage }
// ---------------------------------------------------------------------------

const PROJECT_ID = import.meta.env.VITE_SANITY_PROJECT_ID
const DATASET = import.meta.env.VITE_SANITY_DATASET

export const sanityEnabled = Boolean(PROJECT_ID && DATASET)

const QUERY = /* groq */ `{
  "siteSettings": *[_type == "siteSettings"][0]{
    companyName, phoneDisplay, phoneE164, whatsapp, email, coverage, hours
  },
  "services": *[_type == "service"] | order(order asc){ _id, title, blurb, points, meta, icon },
  "testimonials": *[_type == "testimonial"] | order(_createdAt asc){ _id, quote, name, role },
  "heroBadges": *[_type == "heroBadge"] | order(order asc){ _id, label }
}`

export async function fetchSiteContent() {
  if (!sanityEnabled) return null
  const url =
    `https://${PROJECT_ID}.apicdn.sanity.io/v2024-01-01/data/query/${DATASET}` +
    `?query=${encodeURIComponent(QUERY)}`

  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) return null
    const json = await res.json()
    return json?.result ?? null
  } catch {
    return null
  }
}

// Merge CMS results over fallback content, ignoring empty collections.
export function mergeContent(fallback, remote) {
  if (!remote) return fallback
  const s = remote.siteSettings
  return {
    ...fallback,
    company: s
      ? {
          ...fallback.company,
          name: s.companyName || fallback.company.name,
          phoneDisplay: s.phoneDisplay || fallback.company.phoneDisplay,
          phoneE164: s.phoneE164 || fallback.company.phoneE164,
          whatsapp: s.whatsapp || fallback.company.whatsapp,
          email: s.email || fallback.company.email,
          coverage: s.coverage?.length ? s.coverage : fallback.company.coverage,
          hours: s.hours || fallback.company.hours,
        }
      : fallback.company,
    services: remote.services?.length
      ? remote.services.map((svc, i) => ({
          id: svc._id || `svc-${i}`,
          icon: svc.icon || 'sparkle',
          title: svc.title,
          blurb: svc.blurb,
          points: svc.points || [],
          meta: svc.meta || '',
        }))
      : fallback.services,
    testimonials: remote.testimonials?.length
      ? remote.testimonials.map((t, i) => ({
          quote: t.quote,
          name: t.name,
          role: t.role,
          id: t._id || `t-${i}`,
        }))
      : fallback.testimonials,
    heroBadges: remote.heroBadges?.length
      ? remote.heroBadges.map((b) => b.label).filter(Boolean)
      : fallback.heroBadges,
  }
}
