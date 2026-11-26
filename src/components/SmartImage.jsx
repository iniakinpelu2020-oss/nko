import { useState } from 'react'

/**
 * One image slot for the whole site.
 *
 * - `object-fit: cover` inside an aspect-ratio box, so nothing ever stretches.
 * - Lazy by default (`loading="lazy"`, `decoding="async"`).
 * - Hover zoom is opt-in via CSS (`img-slot--zoom`); the wrapper clips it.
 * - If the URL 404s, blocks or never decodes, the slot keeps its exact size and
 *   swaps to a branded placeholder instead of showing a broken-image icon.
 */
export default function SmartImage({ media, className = '', zoom = true, eager = false }) {
  const [failed, setFailed] = useState(false)
  const src = typeof media === 'string' ? media : media?.src
  const alt = typeof media === 'string' ? '' : media?.alt || ''
  const srcSet = typeof media === 'string' ? undefined : media?.srcSet
  const broken = failed || !src

  return (
    <span className={`img-slot${zoom ? ' img-slot--zoom' : ''}${broken ? ' is-failed' : ''} ${className}`.trim()}>
      {broken ? (
        <span className="img-fallback" role="img" aria-label={alt || 'Photograph unavailable'}>
          <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <circle cx="24" cy="24" r="19" stroke="currentColor" strokeWidth="1.3" opacity="0.45" />
            <path
              d="M24 12.5c4.6 5.4 7.4 9 7.4 12.8a7.4 7.4 0 1 1-14.8 0c0-3.8 2.8-7.4 7.4-12.8Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          <em>{alt || 'Photograph'}</em>
        </span>
      ) : (
        <img
          src={src}
          srcSet={srcSet}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  )
}
