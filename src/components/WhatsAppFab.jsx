import { waLink } from '../content.js'
import { Icon } from '../icons.jsx'

export default function WhatsAppFab({ company }) {
  return (
    <a
      className="wa-fab"
      href={waLink('Hello IDEAL FRESH 360, I would like a cleaning quote please.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${company.shortName} on WhatsApp`}
    >
      <Icon name="whatsapp" />
      <span>WhatsApp us</span>
    </a>
  )
}
