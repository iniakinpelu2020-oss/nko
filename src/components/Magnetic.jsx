import { useRef } from 'react'

export default function Magnetic({ children, strength = 14 }) {
  const ref = useRef(null)

  const move = (event) => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(hover: none)').matches) return
    const rect = el.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * strength * 2
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * strength
    el.style.transition = 'transform 80ms linear'
    el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
  }

  const leave = () => {
    const el = ref.current
    if (!el) return
    el.style.transition = 'transform 420ms cubic-bezier(.2,.7,.2,1)'
    el.style.transform = 'translate3d(0,0,0)'
  }

  return (
    <span ref={ref} onMouseMove={move} onMouseLeave={leave} style={{ display: 'inline-flex' }}>
      {children}
    </span>
  )
}
