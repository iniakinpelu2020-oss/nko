import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import FacilityScene from './FacilityScene.jsx'
import Magnetic from './Magnetic.jsx'
import { waLink } from '../content.js'

export default function Hero({ ready, badges, company }) {
  const root = useRef(null)

  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-eyebrow', { opacity: 0, y: 16, duration: 0.7 }, 0.05)
        .from('.hero-line > span', { yPercent: 118, duration: 1.05, stagger: 0.09, ease: 'expo.out' }, 0.1)
        .from('.hero-sub', { opacity: 0, y: 20, duration: 0.85 }, 0.55)
        .from('.hero-actions > *', { opacity: 0, y: 18, duration: 0.7, stagger: 0.08 }, 0.68)
        .from('.badge', { opacity: 0, y: 12, duration: 0.6, stagger: 0.07 }, 0.85)
        .from('.hero-visual', { opacity: 0, scale: 0.94, duration: 1.4, ease: 'power2.out' }, 0.2)
        .from('.hero-scroll', { opacity: 0, duration: 0.6 }, 1)
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero-grid" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">UK Cleaning &amp; Facilities · Nationwide Coverage</p>

          <h1 className="hero-title">
            <span className="hero-line">
              <span>
                360° <span className="grad">Commercial</span> &amp;
              </span>
            </span>
            <span className="hero-line">
              <span>Residential Cleaning</span>
            </span>
            <span className="hero-line">
              <span>Excellence Across the UK.</span>
            </span>
          </h1>

          <p className="hero-sub">
            {company.name} delivers spotless offices, deep end-of-tenancy cleans, and full-scale facility
            management with guaranteed reliability.
          </p>

          <div className="hero-actions">
            <Magnetic>
              <a className="btn btn--primary" href="#quote">
                Book a Free Site Survey
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </Magnetic>
            <Magnetic strength={8}>
              <a
                className="btn btn--ghost"
                href={waLink('Hello IDEAL FRESH 360, I would like to discuss a cleaning contract.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                Call / WhatsApp {company.phoneDisplay}
              </a>
            </Magnetic>
          </div>

          <div className="trust-badges">
            {badges.map((b) => (
              <span className="badge" key={b}>
                <i />
                {b}
              </span>
            ))}
          </div>

          <div className="hero-scroll">
            <i />
            Scroll to explore
          </div>
        </div>

        <FacilityScene />
      </div>
    </section>
  )
}
