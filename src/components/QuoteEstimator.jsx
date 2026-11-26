import { useMemo, useState } from 'react'
import { ESTIMATOR, estimate, waLink } from '../content.js'
import { Icon } from '../icons.jsx'

export default function QuoteEstimator({ company }) {
  const [property, setProperty] = useState('commercial')
  const [frequency, setFrequency] = useState('weekly')
  const [size, setSize] = useState('medium')
  const [form, setForm] = useState({ name: '', company: '', email: '', postcode: '', notes: '' })
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => estimate({ property, frequency, size }), [property, frequency, size])
  const pLabel = ESTIMATOR.propertyTypes.find((p) => p.id === property)?.label || ''
  const fLabel = ESTIMATOR.frequencies.find((f) => f.id === frequency)?.label || ''
  const sLabel = ESTIMATOR.sizes.find((s) => s.id === size)?.label || ''

  const message = useMemo(
    () =>
      [
        'Hello IDEAL FRESH 360, I would like to book a free site survey.',
        '',
        `Property type: ${pLabel}`,
        `Property size: ${sLabel}`,
        `Frequency: ${fLabel}`,
        result ? `Indicative estimate: £${result.low} – £${result.high} per visit` : null,
        form.name ? `Name: ${form.name}` : null,
        form.company ? `Company: ${form.company}` : null,
        form.email ? `Email: ${form.email}` : null,
        form.postcode ? `Postcode: ${form.postcode}` : null,
        form.notes ? `Notes: ${form.notes}` : null,
      ]
        .filter(Boolean)
        .join('\n'),
    [pLabel, sLabel, fLabel, result, form]
  )

  const send = (event) => {
    event.preventDefault()
    window.open(waLink(message), '_blank', 'noopener,noreferrer')
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  const update = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }))

  const groups = [
    {
      key: 'property',
      step: '01',
      label: 'Property type',
      hint: 'Pick the closest match',
      items: ESTIMATOR.propertyTypes,
      value: property,
      onChange: setProperty,
    },
    {
      key: 'frequency',
      step: '02',
      label: 'Frequency',
      hint: 'Contracts are billed per visit',
      items: ESTIMATOR.frequencies,
      value: frequency,
      onChange: setFrequency,
    },
    {
      key: 'size',
      step: '03',
      label: 'Property size',
      hint: 'Square footage guide below each option',
      items: ESTIMATOR.sizes,
      value: size,
      onChange: setSize,
    },
  ]

  return (
    <section className="section section--tint" id="quote">
      <div className="container">
        <div className="section-head" data-reveal>
          <p className="eyebrow">Instant quote &amp; booking</p>
          <h2 className="h2">Know your budget in thirty seconds.</h2>
          <p className="lede">
            Configure your property, choose a frequency and see an indicative GBP range immediately. Every
            enquiry is reviewed by a real account manager — no call centres, no obligation.
          </p>
        </div>

        <div className="quote-panel">
          <div className="quote-card" data-reveal>
            <form onSubmit={send}>
              {groups.map((group) => (
                <div className="step" key={group.key}>
                  <div className="step-label">
                    <b>
                      {group.step} · {group.label}
                    </b>
                    <span>{group.hint}</span>
                  </div>
                  <div className="opt-grid">
                    {group.items.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        className="opt"
                        aria-pressed={group.value === item.id}
                        onClick={() => group.onChange(item.id)}
                      >
                        <b>{item.label}</b>
                        <small>{item.note}</small>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="step" style={{ marginBottom: 0 }}>
                <div className="step-label">
                  <b>04 · Your details</b>
                  <span>Sent straight to our quoting team</span>
                </div>
                <div className="form-grid">
                  <label className="field">
                    <span>Full name</span>
                    <input value={form.name} onChange={update('name')} placeholder="Alex Whitmore" autoComplete="name" />
                  </label>
                  <label className="field">
                    <span>Company (optional)</span>
                    <input
                      value={form.company}
                      onChange={update('company')}
                      placeholder="Whitmore &amp; Co"
                      autoComplete="organization"
                    />
                  </label>
                  <label className="field">
                    <span>Email</span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={update('email')}
                      placeholder="alex@company.co.uk"
                      autoComplete="email"
                    />
                  </label>
                  <label className="field">
                    <span>Postcode</span>
                    <input
                      value={form.postcode}
                      onChange={update('postcode')}
                      placeholder="EC2A 4NE"
                      autoComplete="postal-code"
                    />
                  </label>
                  <label className="field full">
                    <span>Anything we should know?</span>
                    <textarea
                      value={form.notes}
                      onChange={update('notes')}
                      placeholder="Three floors, two washrooms, preferred visit times…"
                    />
                  </label>
                </div>

                <div className="turnstile-placeholder" aria-hidden="true">
                  <span className="box" />
                  <span>
                    <strong>Cloudflare Turnstile — placeholder</strong>
                    <small>
                      The verification widget is mounted here at launch (site key only, no secret in the
                      browser). Preview submissions are handed to WhatsApp instead.
                    </small>
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
                  <button type="submit" className="btn btn--primary">
                    <Icon name="whatsapp" className="" />
                    Send Enquiry via WhatsApp
                  </button>
                  <button type="button" className="btn btn--outline" onClick={copy}>
                    {copied ? 'Copied ✓' : 'Copy details'}
                  </button>
                </div>
                <p className="form-note">
                  Prefer to talk it through? Call{' '}
                  <a href={`tel:${company.phoneE164}`} style={{ fontWeight: 600, color: '#0b132b' }}>
                    {company.phoneDisplay}
                  </a>{' '}
                  — {company.hours}. We never share your details.
                </p>
              </div>
            </form>
          </div>

          <aside className="summary" data-reveal>
            <p className="cap">Your indicative estimate</p>
            <strong className="price">{result ? `£${result.low} – £${result.high}` : '—'}</strong>
            <span className="per">per visit, before VAT · indicative only</span>
            <div className="chips">
              <span className="chip">{pLabel}</span>
              <span className="chip">{fLabel}</span>
              <span className="chip">{sLabel}</span>
            </div>
            <hr />
            <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: 'rgba(248,250,252,.72)' }}>
              Every price is confirmed after a free, no-obligation site survey — often same week, anywhere in
              our coverage.
            </p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: '16px 0 0',
                display: 'grid',
                gap: 9,
                fontSize: '0.78rem',
                color: 'rgba(248,250,252,.7)',
              }}
            >
              {['Free site survey & written spec', 'DBS-checked, uniformed teams', 'Fully insured — £5M+ cover'].map(
                (item) => (
                  <li key={item} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                    <Icon name="check" style={{ width: 14, height: 14, color: '#6ee7b7', flex: 'none' }} />
                    <span>{item}</span>
                  </li>
                )
              )}
            </ul>
            <p className="note">
              Estimate excludes specialist treatments (carpet extraction, high-reach glass) and consumables,
              which are quoted separately. Prices shown for guidance only and do not constitute an offer.
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}
