import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Startup curtain — 1.4s.
 *
 * Dark navy curtain with the IDEAL FRESH 360 emblem and a glowing emerald
 * progress meter (0% → 100%), then a bright emerald/white squeegee bar wipes
 * left to right, clipping the curtain away to reveal the hero underneath.
 * A guard timer guarantees the curtain never traps the page.
 */
export default function Preloader({ onComplete }) {
  const root = useRef(null)
  const meter = useRef(null)
  const pct = useRef(null)
  const done = useRef(onComplete)
  done.current = onComplete
  const fired = useRef(false)

  useEffect(() => {
    const finish = () => {
      if (fired.current) return
      fired.current = true
      done.current?.()
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(root.current, { autoAlpha: 0 })
      finish()
      return
    }

    // Safety net: if anything throws, never leave the page curtained.
    const guard = window.setTimeout(finish, 2800)

    const counter = { v: 0 }
    let ctx
    try {
      ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, onComplete: finish })
      const width = () => window.innerWidth

      tl.fromTo('.curtain-mark', { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.04)
        .fromTo('.curtain-meta', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0.2)
        .fromTo(
          '.curtain-fill',
          { scaleX: 0 },
          { scaleX: 1, duration: 0.72, ease: 'power1.inOut', transformOrigin: 'left center' },
          0.16
        )
        .to(
          counter,
          {
            v: 100,
            duration: 0.72,
            ease: 'power1.inOut',
            onUpdate: () => {
              if (pct.current) pct.current.textContent = `${Math.round(counter.v)}%`
              if (meter.current) meter.current.setAttribute('aria-valuenow', String(Math.round(counter.v)))
            },
          },
          0.16
        )
        // squeegee wipe — the curtain is clipped away behind the moving bar
        .to('.curtain-mark', { autoAlpha: 0, y: -20, duration: 0.34, ease: 'power2.in' }, 0.78)
        .to('.curtain-meta', { autoAlpha: 0, duration: 0.24 }, 0.78)
        .fromTo(
          '.curtain-squeegee',
          { x: () => -200 },
          { x: () => width() + 40, duration: 0.62, ease: 'power2.inOut' },
          0.72
        )
        .to('.curtain-bg', { clipPath: 'inset(0% 0% 0% 100%)', duration: 0.62, ease: 'power2.inOut' }, 0.72)
        .to(root.current, { autoAlpha: 0, duration: 0.08 }, 1.32)
      }, root)
    } catch (error) {
      // A failed animation must never keep the curtain — or the page — covered.
      console.error('[IDEAL FRESH 360] startup curtain skipped:', error)
      finish()
    }

    return () => {
      window.clearTimeout(guard)
      ctx?.revert()
    }
  }, [])

  return (
    <div className="curtain" ref={root}>
      <div className="curtain-bg">
        <div className="curtain-grid" aria-hidden="true" />
        <div className="curtain-mark">
          <span className="curtain-emblem" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <circle cx="24" cy="24" r="20" stroke="rgba(110,231,183,0.28)" strokeWidth="1.2" />
              <path d="M41.2 15.4A20 20 0 0 1 44 24" stroke="#6EE7B7" strokeWidth="2.2" strokeLinecap="round" />
              <path
                d="M24 10.5c5.2 6 8.4 10.1 8.4 14.4a8.4 8.4 0 1 1-16.8 0c0-4.3 3.2-8.4 8.4-14.4Z"
                stroke="#F8FAFC"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="M20.8 25.4a3.3 3.3 0 0 0 3.3 3.3"
                stroke="#6EE7B7"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <strong>
            IDEAL FRESH <span>360</span>
          </strong>
          <em>Cleaning &amp; Facility Service</em>
        </div>

        <div className="curtain-progress">
          <div
            className="curtain-meter"
            ref={meter}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
            aria-label="Preparing the site"
          >
            <span className="curtain-fill" />
          </div>
          <div className="curtain-meta">
            <span>Preparing your spotless experience</span>
            <span className="curtain-pct" ref={pct}>
              0%
            </span>
          </div>
        </div>
      </div>

      <div className="curtain-squeegee" aria-hidden="true">
        <i className="curtain-blade" />
        <i className="curtain-trail" />
      </div>
    </div>
  )
}
