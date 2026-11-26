import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Preloader({ onComplete }) {
  const root = useRef(null)
  const done = useRef(onComplete)
  done.current = onComplete

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(root.current, { autoAlpha: 0 })
        done.current?.()
        return
      }
      const tl = gsap.timeline({ onComplete: () => done.current?.() })
      tl.to('.pre-mark', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.05)
        .fromTo(
          '.pre-sweep',
          { xPercent: -10, opacity: 0 },
          { xPercent: 460, opacity: 1, duration: 1.05, ease: 'power2.inOut' },
          0.1
        )
        .to('.pre-mark', { opacity: 0, y: -14, duration: 0.4, ease: 'power2.in' }, 0.85)
        .to('.pre-panel', { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, 0.92)
        .to(root.current, { autoAlpha: 0, duration: 0.2 }, 1.5)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="pre-sweep" />
      <div className="pre-mark">
        <strong>
          IDEAL FRESH <span style={{ color: '#6EE7B7' }}>360</span>
        </strong>
        <span>Cleaning &amp; Facility Service</span>
      </div>
      <div className="pre-panel" />
    </div>
  )
}
