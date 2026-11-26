import { useRef, useState } from 'react'
import { Icon, Stars } from '../icons.jsx'
import { STATS, TRUST_POINTS, waLink } from '../content.js'
import { SERVICE_MEDIA, CASE_STUDIES, FACILITY_SHOWCASE } from '../data/siteMedia.js'
import SmartImage from './SmartImage.jsx'

export function Stats() {
  return (
    <section className="stats" aria-label="Credentials at a glance">
      <div className="container">
        <div className="stats-grid">
          {STATS.map((stat) => (
            <div className="stat" key={stat.label} data-reveal>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
              <em>{stat.note}</em>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Services({ services }) {
  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-head" data-reveal>
          <p className="eyebrow">Core services</p>
          <h2 className="h2">One accountable partner for every surface and every site.</h2>
          <p className="lede">
            Six specialist divisions, one contract, one supervisor who knows your building. Scope is written
            down, priced clearly and audited monthly.
          </p>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <article className="svc" key={service.id} data-reveal>
              <SmartImage media={SERVICE_MEDIA[service.id]} className="svc-media" />
              <div className="svc-body">
                <span className="svc-icon">
                  <Icon name={service.icon} />
                </span>
                <h3>{service.title}</h3>
                <p>{service.blurb}</p>
                {service.points?.length > 0 && (
                  <ul>
                    {service.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
                {service.meta && <span className="meta">{service.meta}</span>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Trust({ company }) {
  return (
    <section className="section section--dark" id="trust">
      <div className="container">
        <div className="section-head" data-reveal>
          <p className="eyebrow">Why IDEAL FRESH 360</p>
          <h2 className="h2">Compliance you can put in front of a board.</h2>
          <p className="lede">
            Cleaning is a regulated, people-heavy service. We treat paperwork, vetting and insurance as part
            of the product — not an afterthought.
          </p>
        </div>

        <div className="trust-grid">
          {TRUST_POINTS.map((point, index) => (
            <article className="trust-card" key={point.title} data-reveal>
              <span className="idx">0{index + 1}</span>
              <h3>{point.title}</h3>
              <p>{point.body}</p>
            </article>
          ))}
        </div>

        <div className="showcase" data-reveal>
          {FACILITY_SHOWCASE.map((item) => (
            <figure className="showcase-item" key={item.label} style={{ margin: 0 }}>
              <SmartImage media={item} className="showcase-media" />
              <figcaption>{item.label}</figcaption>
            </figure>
          ))}
        </div>

        <div className="trust-foot" data-reveal>
          <p>
            <strong>Need our insurance certificate, RAMS or DBS policy for a tender pack?</strong> We send the
            full compliance bundle the same working day.
          </p>
          <a
            className="btn btn--primary"
            href={waLink('Hello IDEAL FRESH 360, please send your compliance and insurance pack.')}
            target="_blank"
            rel="noopener noreferrer"
          >
            Request compliance pack
          </a>
        </div>
      </div>
    </section>
  )
}

export function BeforeAfter() {
  const frame = useRef(null)
  const [position, setPosition] = useState(54)
  const [dragging, setDragging] = useState(false)
  const [active, setActive] = useState(0)
  const study = CASE_STUDIES[active] || CASE_STUDIES[0]

  const moveTo = (clientX) => {
    const el = frame.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.max(2, Math.min(98, pct)))
  }

  const onKeyDown = (event) => {
    if (event.key === 'ArrowLeft') setPosition((p) => Math.max(2, p - 4))
    if (event.key === 'ArrowRight') setPosition((p) => Math.min(98, p + 4))
  }

  return (
    <section className="section" id="work">
      <div className="container">
        <div
          className="section-head"
          data-reveal
          style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-end', maxWidth: 'none' }}
        >
          <div style={{ maxWidth: '34rem' }}>
            <p className="eyebrow">The transformation</p>
            <h2 className="h2">Drag the handle. That is a standard Thursday.</h2>
          </div>
          <p className="lede" style={{ marginTop: 0, maxWidth: '26rem' }}>
            {study.caption}
          </p>
        </div>

        {CASE_STUDIES.length > 1 && (
          <div className="ba-cases" role="tablist" aria-label="Case studies">
            {CASE_STUDIES.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={index === active}
                className={`ba-case${index === active ? ' is-active' : ''}`}
                onClick={() => {
                  setActive(index)
                  setPosition(54)
                }}
              >
                {item.location}
              </button>
            ))}
          </div>
        )}

        <div
          className="ba"
          key={study.id}
          ref={frame}
          data-reveal
          role="slider"
          tabIndex={0}
          aria-label="Before and after cleaning comparison"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          onKeyDown={onKeyDown}
          onPointerDown={(event) => {
            setDragging(true)
            event.currentTarget.setPointerCapture?.(event.pointerId)
            moveTo(event.clientX)
          }}
          onPointerMove={(event) => {
            if (dragging) moveTo(event.clientX)
          }}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
        >
          <div className="ba-before">
            {/* Both frames are eager: the comparison IS the content here, and a
                lazy image inside the clipped overlay never triggered, leaving
                the slider blank. */}
            <SmartImage media={study.beforeImage} zoom={false} eager />
          </div>
          <div className="ba-after" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
            <SmartImage media={study.afterImage} zoom={false} eager />
          </div>
          <span className="ba-tag ba-tag--before">Before Clean</span>
          <span className="ba-tag ba-tag--after">After 360° Clean</span>
          <div className="ba-handle" style={{ left: `${position}%` }}>
            <span className="ba-knob">
              <Icon name="drag" />
            </span>
          </div>
        </div>

        <div className="ba-foot">
          <span>Use the handle, or focus the image and use the arrow keys.</span>
          <a className="btn btn--outline btn--sm" href="#quote">
            Get a quote like this
          </a>
        </div>
      </div>
    </section>
  )
}

export function Testimonials({ testimonials }) {
  return (
    <section className="section section--tint" id="testimonials">
      <div className="container">
        <div className="section-head" data-reveal>
          <p className="eyebrow">Verified UK clients</p>
          <h2 className="h2">Facilities managers who stopped chasing cleaners.</h2>
          <p className="lede">
            Reviews from commercial and residential clients across London, the Midlands and the North West.
          </p>
        </div>
        <div className="quote-grid">
          {testimonials.map((item, index) => (
            <figure className="quote-card" key={item.id || index} data-reveal style={{ margin: 0 }}>
              <Stars />
              <blockquote>“{item.quote}”</blockquote>
              <figcaption className="who">
                <span className="avatar">{(item.name || '?').charAt(0)}</span>
                <span>
                  <b>{item.name}</b>
                  <small>{item.role}</small>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CtaBand({ company }) {
  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="cta-band" data-reveal>
          <div>
            <p className="eyebrow">Next step</p>
            <h2 style={{ marginTop: 14 }}>Book a free site survey this week.</h2>
            <p>
              A supervisor walks your building, measures the scope and returns a fixed written price within 24
              hours. {company.hours}.
            </p>
          </div>
          <div className="actions">
            <a className="btn btn--primary" href="#quote">
              Get my instant estimate
            </a>
            <a
              className="btn btn--ghost"
              href={waLink('Hello IDEAL FRESH 360, I would like to book a free site survey.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp {company.phoneDisplay}
            </a>
            <a
              className="btn btn--ghost"
              href={`tel:${company.phoneE164}`}
              style={{ justifyContent: 'center' }}
            >
              Call now
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
