import { Icon } from '../icons.jsx'

export default function Footer({ company }) {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <span className="wordmark">
              <span className="mark-360">360</span>
              <span>
                IDEAL FRESH 360
                <small>Cleaning &amp; Facility Service</small>
              </span>
            </span>
            <p>
              {company.name} — commercial, residential and total facility cleaning delivered to a written
              specification, audited monthly and backed by a 100% re-clean guarantee.
            </p>
            <p style={{ marginTop: 14, fontSize: '0.78rem', color: 'rgba(248,250,252,.42)' }}>
              Registered in England &amp; Wales · VAT invoices issued · Equality &amp; diversity policy on
              request.
            </p>
          </div>

          <div>
            <h4>Services</h4>
            <ul>
              <li>
                <a href="#services">Commercial &amp; office cleaning</a>
              </li>
              <li>
                <a href="#services">Facility management</a>
              </li>
              <li>
                <a href="#services">End-of-tenancy deep clean</a>
              </li>
              <li>
                <a href="#services">Carpet, upholstery &amp; windows</a>
              </li>
              <li>
                <a href="#services">Post-construction sanitising</a>
              </li>
              <li>
                <a href="#services">Hygiene supplies</a>
              </li>
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#trust">Why IDEAL FRESH 360</a>
              </li>
              <li>
                <a href="#work">Before &amp; after</a>
              </li>
              <li>
                <a href="#testimonials">Client reviews</a>
              </li>
              <li>
                <a href="#quote">Instant quote</a>
              </li>
              <li>
                <a href={`mailto:${company.email}`}>Tender enquiries</a>
              </li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <ul>
              <li>
                <a className="contact-link" href={`tel:${company.phoneE164}`}>
                  <Icon name="phone" />
                  {company.phoneDisplay}
                </a>
              </li>
              <li>
                <a className="contact-link" href={company.whatsapp} target="_blank" rel="noopener noreferrer">
                  <Icon name="whatsapp" />
                  WhatsApp direct chat
                </a>
              </li>
              <li>
                <a className="contact-link" href={`mailto:${company.email}`}>
                  <Icon name="mail" />
                  {company.email}
                </a>
              </li>
              <li className="hours">{company.hours}</li>
            </ul>

            <h4 style={{ marginTop: 22 }}>Coverage</h4>
            <ul>
              {company.coverage.map((area) => (
                <li key={area} style={{ fontSize: '0.8rem' }}>
                  <span style={{ display: 'inline-flex', gap: 7, alignItems: 'center' }}>
                    <Icon name="pin" style={{ width: 13, height: 13, color: '#6EE7B7', flex: 'none' }} />
                    {area}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <details>
          <summary>Privacy notice, cookies &amp; compliance</summary>
          <p>
            This site collects no personal data by itself. Details you enter in the quote form are composed
            into a WhatsApp message and only sent when you press send; they reach us through WhatsApp under
            its own privacy terms. Enquiry records are kept for up to 24 months, used solely to respond to
            your request, and never sold or shared. No advertising or analytics cookies are set. Where
            verification is enabled at launch, Cloudflare Turnstile processes a challenge in accordance with
            Cloudflare’s privacy policy. Requests to access, correct or delete your details can be made by
            calling {company.phoneDisplay}.
          </p>
          <p>
            Health &amp; safety: risk assessments and method statements are issued per site; COSHH data
            sheets are held for every chemical used. Insurance: public and employer’s liability certificates
            are available on request. Safeguarding: enhanced DBS checks for operatives working in occupied or
            residential premises.
          </p>
        </details>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </span>
          <span className="legal-links">
            <a href="#quote">Free site survey</a>
            <a href="#trust">Insurance &amp; compliance</a>
            <a href={`tel:${company.phoneE164}`}>{company.phoneDisplay}</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
