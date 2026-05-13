import landingHero from '../../assets/landing-hero.jpg'
import { pagePath } from '../../utils/paths'

const signals = ['Walrus-native', 'Seal encrypted', 'Sponsored submit', 'Storage lifecycle']

const features = [
  {
    kicker: 'Storage',
    title: 'Forms and submissions live on Walrus',
    description:
      'Publish schemas, collect response payloads, and track epoch-based expiry without turning Move into a database.',
  },
  {
    kicker: 'Privacy',
    title: 'Sensitive answers stay sealed',
    description:
      'Mark private fields once. TaskForm encrypts before upload and keeps raw content out of events and on-chain metadata.',
  },
  {
    kicker: 'Access',
    title: 'Feedback without wallet friction',
    description:
      'Creators can sponsor submissions so teams can collect high-signal reports from users who never touch gas.',
  },
]

const workflow = [
  ['Create', 'Build a form with required fields, attachments, and privacy flags.'],
  ['Publish', 'Store the schema, register metadata, and share one public link.'],
  ['Collect', 'Render a fast public form with lazy storage, encryption, and submit logic.'],
  ['Review', 'Triage status, priority, decryption, exports, and storage health.'],
]

const inbox = [
  ['Security report', 'Critical', 'Encrypted', 'Expiring in 4 epochs'],
  ['Grant application', 'High', 'Open', 'Active'],
  ['Product feedback', 'Medium', 'Sponsored', 'Active'],
]

export function LandingPage() {
  return (
    <div className="landing-shell">
      <nav className="landing-nav" aria-label="Primary navigation">
        <a href={pagePath('/')} className="landing-brand" aria-label="TaskForm home">
          <span className="brand-mark" />
          TaskForm
        </a>
        <div className="landing-nav-links">
          <a href="#product">Product</a>
          <a href="#workflow">Workflow</a>
          <a href="#security">Security</a>
        </div>
        <a href={pagePath('/dashboard.html')} className="nav-cta">
          Launch App
        </a>
      </nav>

      <header className="hero-section">
        <img src={landingHero} alt="" className="hero-image" />
        <div className="hero-scrim" />
        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">Walrus-native feedback infrastructure</p>
            <h1>TaskForm</h1>
            <p className="hero-lede">
              Private forms for decentralized teams. Collect encrypted submissions, sponsor user
              fees, and manage storage lifecycle from one focused dashboard.
            </p>
            <div className="hero-actions">
              <a href={pagePath('/dashboard.html')} className="primary-action">
                Launch App
              </a>
              <a href="#workflow" className="secondary-action">
                View workflow
              </a>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="signal-strip" aria-label="TaskForm capabilities">
          {signals.map((signal) => (
            <div key={signal} className="signal-item">
              <span />
              {signal}
            </div>
          ))}
        </section>

        <section id="product" className="content-section">
          <div className="section-heading">
            <p className="section-kicker">Product</p>
            <h2>Everything a Web3 feedback loop needs.</h2>
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <article key={feature.title} className="feature-card">
                <p>{feature.kicker}</p>
                <h3>{feature.title}</h3>
                <span>{feature.description}</span>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="content-section workflow-section">
          <div className="section-heading">
            <p className="section-kicker">Workflow</p>
            <h2>Create, publish, collect, review.</h2>
          </div>
          <div className="workflow-grid">
            {workflow.map(([title, description], index) => (
              <article key={title} className="workflow-step">
                <div>{String(index + 1).padStart(2, '0')}</div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="security" className="dashboard-band">
          <div className="dashboard-copy">
            <p className="section-kicker">Dashboard</p>
            <h2>Review feedback without exposing what should stay private.</h2>
            <p>
              List views stay metadata-first. Teams download and decrypt the sensitive payload only
              when a reviewer has the right access.
            </p>
          </div>

          <div className="dashboard-preview" aria-label="Submission dashboard preview">
            <div className="preview-toolbar">
              <span>Submission inbox</span>
              <strong>Storage healthy</strong>
            </div>
            <div className="preview-list">
              {inbox.map(([title, priority, privacy, health]) => (
                <div key={title} className="preview-row">
                  <div>
                    <strong>{title}</strong>
                    <span>{health}</span>
                  </div>
                  <em>{priority}</em>
                  <small>{privacy}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta">
          <p>Web2 UX. Web3 ownership.</p>
          <h2>Start collecting private feedback on decentralized rails.</h2>
          <a href={pagePath('/dashboard.html')} className="primary-action">
            Launch App
          </a>
        </section>
      </main>

      <footer className="landing-footer">
        <span>TaskForm</span>
        <span>Walrus storage. Seal privacy. Sui ownership.</span>
      </footer>
    </div>
  )
}
