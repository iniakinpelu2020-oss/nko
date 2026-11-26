const paths = {
  building: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16" />
      <path d="M15 9h3a2 2 0 0 1 2 2v10" />
      <path d="M8 7h4M8 11h4M8 15h4" />
    </>
  ),
  tools: (
    <>
      <path d="M14.7 6.3a4 4 0 1 0 5 5L21 21H3l7.7-9.7" />
      <path d="M9 3l4 4" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="8" r="4" />
      <path d="M11 11l9 9M17 17l2-2M14 14l2-2" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
      <path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
    </>
  ),
  helmet: (
    <>
      <path d="M3 16a9 9 0 0 1 18 0" />
      <path d="M2 16h20v2H2z" />
      <path d="M9 8v8M15 8v8" />
    </>
  ),
  leaf: (
    <>
      <path d="M4 20c0-8 5-14 16-15 1 10-4 15-11 15H4Z" />
      <path d="M8 16c2-4 5-6 9-7" />
    </>
  ),
  check: <path d="M4 12.5l5 5L20 6.5" />,
  phone: (
    <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3Z" />
  ),
  whatsapp: (
    <>
      <path d="M20.5 11.6A8.4 8.4 0 0 1 8 19.2L3.5 20.5l1.4-4.4A8.4 8.4 0 1 1 20.5 11.6Z" />
      <path d="M8.8 8.2c.3-.5.6-.5.9-.5h.7c.2 0 .4 0 .6.5l.7 1.6c.1.3 0 .5-.2.7l-.5.5c-.2.2-.2.3 0 .6a6 6 0 0 0 2.6 2.2c.3.1.5.1.6-.1l.5-.6c.2-.2.4-.2.6-.1l1.5.8c.3.2.4.3.3.6-.2 1-.9 1.4-1.8 1.4a7 7 0 0 1-4.1-1.7 8 8 0 0 1-2.2-3.2c-.2-.6-.1-1.1.1-1.5Z" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  drag: <path d="M9 7l-4 5 4 5M15 7l4 5-4 5" />,
  pin: (
    <>
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </>
  ),
}

export function Icon({ name, className, style }) {
  return (
    <svg
      width="18"
      height="18"
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {paths[name] || paths.sparkle}
    </svg>
  )
}

export function Stars() {
  return (
    <div className="stars" aria-label="Five out of five stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.7 1.2 6.6-5.9-3.2-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9L12 2.5Z" />
        </svg>
      ))}
    </div>
  )
}
