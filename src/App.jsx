import { useCallback, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Preloader from './components/Preloader.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import QuoteEstimator from './components/QuoteEstimator.jsx'
import { Stats, Services, Trust, BeforeAfter, Testimonials, CtaBand } from './components/Sections.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppFab from './components/WhatsAppFab.jsx'

import { COMPANY, HERO_BADGES, SERVICES, TESTIMONIALS } from './content.js'
import { fetchSiteContent, mergeContent } from './sanity.js'

gsap.registerPlugin(ScrollTrigger)

const BASE = {
  company: COMPANY,
  services: SERVICES,
  testimonials: TESTIMONIALS,
  heroBadges: HERO_BADGES,
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [content, setContent] = useState(BASE)
  const finish = useCallback(() => setReady(true), [])

  // Lock scrolling under the preloader.
  useEffect(() => {
    document.body.classList.add('is-locked')
    return () => document.body.classList.remove('is-locked')
  }, [])

  useEffect(() => {
    if (!ready) return
    document.body.classList.remove('is-locked')
  }, [ready])

  // Read-only CMS hydration: fallback content is already rendered.
  useEffect(() => {
    let alive = true
    fetchSiteContent().then((remote) => {
      if (alive && remote) setContent(mergeContent(BASE, remote))
    })
    return () => {
      alive = false
    }
  }, [])

  // Scroll choreography.
  useEffect(() => {
    if (!ready) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 32,
          opacity: 0,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })

      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        const depth = Number(el.dataset.parallax) || 0.08
        gsap.to(el, {
          yPercent: -depth * 100,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    })

    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [ready])

  return (
    <>
      {!ready && <Preloader onComplete={finish} />}
      <Navbar company={content.company} />
      <main>
        <Hero ready={ready} badges={content.heroBadges} company={content.company} />
        <Stats />
        <Services services={content.services} />
        <Trust company={content.company} />
        <QuoteEstimator company={content.company} />
        <BeforeAfter />
        <Testimonials testimonials={content.testimonials} />
        <CtaBand company={content.company} />
      </main>
      <Footer company={content.company} />
      <WhatsAppFab company={content.company} />
    </>
  )
}
