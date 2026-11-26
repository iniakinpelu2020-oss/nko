import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Icon } from '../icons.jsx'

export default function Navbar({ company }) {
  const [open, setOpen] = useState(false)
  const bar = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(bar.current, { yPercent: -110, duration: 0.9, delay: 1.5, ease: 'expo.out' })
    }, bar)
    return () => ctx.revert()
  }, [])

  const links = [
    ['Services', '#services'],
    ['Why Us', '#trust'],
    ['Instant Quote', '#quote'],
    ['Our Work', '#work'],
    ['Contact', '#contact'],
  ]

  return (
    <header className="nav" ref={bar}>
      <div className="container nav-inner">
        <a href="#top" className="wordmark" aria-label={`${company.shortName} home`}>
          <span className="mark-360">360</span>
          <span>
            IDEAL FRESH 360
            <small>Cleaning &amp; Facility Service</small>
          </span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {links.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <a className="nav-phone" href={`tel:${company.phoneE164}`}>
            <Icon name="phone" className="" />
            {company.phoneDisplay}
          </a>
          <a className="btn btn--primary btn--sm" href="#quote">
            Get Instant Quote
          </a>
          <button
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="nav-drawer"
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
          </button>
        </div>
      </div>

      <div id="nav-drawer" className={`nav-drawer container ${open ? 'open' : ''}`}>
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
        <a href={`tel:${company.phoneE164}`} onClick={() => setOpen(false)}>
          Call {company.phoneDisplay}
        </a>
      </div>
    </header>
  )
}
