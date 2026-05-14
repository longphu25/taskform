import { useEffect, useRef } from 'react'
import { pagePath } from '../../utils/paths'

const stackNodes = [
  {
    name: 'Builder',
    label: 'Form schema',
    detail: 'Templates, fields, validation, storage policy',
    icon: pagePath('/logo-mark.svg'),
    tone: 'mint',
  },
  {
    name: 'Walrus',
    label: 'Blob storage',
    detail: 'Schemas, submissions, screenshots, video proof',
    icon: pagePath('/walrus-icon.png'),
    tone: 'walrus',
  },
  {
    name: 'Seal',
    label: 'Private fields',
    detail: 'Sensitive answers encrypted before upload',
    icon: pagePath('/seal-logo.svg'),
    tone: 'seal',
  },
  {
    name: 'Sui',
    label: 'Onchain index',
    detail: 'Ownership, publish state, submission pointers',
    icon: pagePath('/sui-icon.png'),
    tone: 'sui',
  },
  {
    name: 'Dashboard',
    label: 'Review table',
    detail: 'Filter, prioritize, decrypt, notes, CSV export',
    icon: pagePath('/logo-mark.svg'),
    tone: 'amber',
  },
]

const proofRows = [
  ['Form schema', 'Walrus blob', 'Public form renders from blob ID'],
  ['Submission payload', 'Walrus blob', 'Body and attachments stay off-chain'],
  ['Sensitive fields', 'Seal encrypted payload', 'Creator decrypts in dashboard'],
  ['Metadata pointer', 'Sui Move event/object', 'Ownership and review state are verifiable'],
]

const marqueeItems = [
  'Walrus Storage',
  'Seal Encryption',
  'Sui Ownership',
  'CSV Export',
  'Form Builder',
  'Sponsored Gas',
  'Move Events',
  'Blob Proofs',
]

export function LandingPage() {
  const bentoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!bentoRef.current) return

      const cards = bentoRef.current.querySelectorAll('.bento-card')
      for (const card of cards) {
        const rect = card.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        ;(card as HTMLElement).style.setProperty('--mouse-x', `${x}px`)
        ;(card as HTMLElement).style.setProperty('--mouse-y', `${y}px`)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="landing-shell">
      <nav className="premium-nav reveal-up">
        <a href={pagePath('/')} className="premium-nav-logo">
          <img src={pagePath('/logo-mark.svg')} alt="TaskForm" />
          TaskForm
        </a>
        <div className="premium-nav-links">
          <a href="#architecture">Architecture</a>
          <a href="#proof">Proof</a>
        </div>
        <a href={pagePath('/dashboard.html')} className="premium-nav-cta">
          Launch App
        </a>
      </nav>

      <main>
        {/* Split-screen asymmetric hero */}
        <section className="hero-section" id="hero">
          <div className="hero-glow-bg" />
          <div className="hero-grid-bg" />

          <div className="hero-split">
            <div className="hero-left reveal-up" data-delay="0.1">
              <div className="badge">
                <span className="badge-dot" />
                Walrus Tools Builder
              </div>
              <h1 className="hero-title">
                Build forms.
                <br />
                Store on Walrus.
                <br />
                Own on Sui.
              </h1>
              <p className="hero-subtitle">
                TaskForm routes every feedback submission through the correct rail: Walrus for
                content, Seal for privacy, Sui for ownership and review state.
              </p>
              <div className="hero-cta-group">
                <a href={pagePath('/create-form.html')} className="btn-primary">
                  Create Form
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <a href="#architecture" className="btn-secondary">
                  View Architecture
                </a>
              </div>
            </div>

            <div className="hero-right reveal-up" data-delay="0.25">
              <div className="hero-terminal">
                <div className="terminal-topbar">
                  <span />
                  <span />
                  <span />
                  <span className="terminal-title">taskform pipeline</span>
                </div>
                <div className="terminal-body">
                  <div className="terminal-line">
                    <span className="terminal-prompt">$</span>
                    <span className="terminal-cmd">create_form</span>
                    <span className="terminal-arg">--schema walrus://blob_id</span>
                  </div>
                  <div className="terminal-line">
                    <span className="terminal-prompt">&gt;</span>
                    <span className="terminal-output">Form published to Sui</span>
                    <span className="terminal-status terminal-status-ok">OK</span>
                  </div>
                  <div className="terminal-line">
                    <span className="terminal-prompt">$</span>
                    <span className="terminal-cmd">submit</span>
                    <span className="terminal-arg">--encrypt seal://policy</span>
                  </div>
                  <div className="terminal-line">
                    <span className="terminal-prompt">&gt;</span>
                    <span className="terminal-output">Blob stored, pointer anchored</span>
                    <span className="terminal-status terminal-status-ok">OK</span>
                  </div>
                  <div className="terminal-line">
                    <span className="terminal-prompt">$</span>
                    <span className="terminal-cmd">review</span>
                    <span className="terminal-arg">--decrypt --export csv</span>
                  </div>
                  <div className="terminal-line terminal-line-active">
                    <span className="terminal-prompt">&gt;</span>
                    <span className="terminal-output">4 submissions decrypted</span>
                    <span className="terminal-status terminal-status-ok">OK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kinetic marquee */}
        <div className="marquee-strip reveal-up" aria-hidden="true">
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span className="marquee-item" key={i}>
                <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor" aria-hidden="true">
                  <circle cx="3" cy="3" r="3" />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Architecture stage — Sticky Scroll Reveal */}
        <section className="arch-section" id="arch-live">
          <div className="arch-intro reveal-up">
            <span className="eyebrow">Live architecture</span>
            <h2 className="arch-title">From form design to reviewable proof</h2>
            <p className="arch-desc">
              One schema triggers a verifiable pipeline. Content flows to Walrus, sensitive fields
              route through Seal, and Sui anchors ownership.
            </p>
            <div className="arch-logos" aria-label="Powered by">
              <div className="arch-logo-pill">
                <img src={pagePath('/sui-logo.svg')} alt="Sui" />
              </div>
              <div className="arch-logo-pill arch-logo-walrus">
                <img src={pagePath('/walrus-icon.png')} alt="Walrus" />
              </div>
              <div className="arch-logo-pill arch-logo-seal">
                <img src={pagePath('/seal-logo.svg')} alt="Seal" />
              </div>
            </div>
          </div>

          {/* Scroll-pinned pipeline */}
          <div className="arch-scroll-container">
            {/* Progress track */}
            <div className="arch-progress" aria-hidden="true">
              <div className="arch-progress-track">
                <div className="arch-progress-fill" />
              </div>
              {stackNodes.map((_, i) => (
                <div className="arch-progress-dot" key={i} data-step={i} />
              ))}
            </div>

            {/* Cards */}
            <div className="arch-cards">
              {stackNodes.map((node, index) => (
                <article
                  className={`arch-card arch-card-${index} tone-${node.tone}`}
                  key={node.name}
                  data-step={index}
                >
                  <div className="arch-card-inner">
                    <div className="arch-card-left">
                      <div className="arch-card-index">{String(index + 1).padStart(2, '0')}</div>
                      <div className="arch-card-icon">
                        <img src={node.icon} alt="" />
                      </div>
                    </div>
                    <div className="arch-card-body">
                      <span className="arch-card-label">{node.label}</span>
                      <h3 className="arch-card-name">{node.name}</h3>
                      <p className="arch-card-detail">{node.detail}</p>
                    </div>
                    <div className="arch-card-glow" aria-hidden="true" />
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Console output */}
          <div className="arch-console reveal-up">
            <div className="arch-console-topbar">
              <span />
              <span />
              <span />
              <span className="arch-console-label">pipeline trace</span>
            </div>
            <div className="arch-console-body">
              <div className="arch-console-line">
                <span className="arch-console-tag">tx</span>
                <span className="arch-console-text">create_form(schema_blob_id)</span>
              </div>
              <div className="arch-console-line">
                <span className="arch-console-tag tag-walrus">walrus</span>
                <span className="arch-console-text">submit.json + attachments → blob_id</span>
              </div>
              <div className="arch-console-line">
                <span className="arch-console-tag tag-seal">seal</span>
                <span className="arch-console-text">private fields encrypted client-side</span>
              </div>
              <div className="arch-console-line arch-console-line-highlight">
                <span className="arch-console-tag tag-sui">sui</span>
                <span className="arch-console-text">status, priority, events anchored</span>
                <span className="arch-console-status">CONFIRMED</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bento features */}
        <section className="bento-section story-section" id="architecture">
          <div className="section-header reveal-up">
            <div className="section-tag">Architecture</div>
            <h2 className="section-title">A builder tool, not a Web2 form clone.</h2>
            <p className="section-copy">
              Every component maps to a verifiable artifact. No hidden servers, no opaque storage,
              no trust assumptions.
            </p>
          </div>

          <div className="bento-grid" ref={bentoRef}>
            <article className="bento-card bento-col-7 reveal-up">
              <div className="brand-lockup">
                <img src={pagePath('/walrus-icon.png')} alt="Walrus" />
                <span>Walrus</span>
              </div>
              <h3 className="bento-title">Blob-first storage</h3>
              <p className="bento-desc">
                Large data never goes on-chain. Form JSON, responses, screenshots, and demo
                artifacts are stored as Walrus blobs with visible proof IDs.
              </p>
            </article>

            <article className="bento-card bento-col-5 reveal-up" data-delay="0.05">
              <div className="brand-lockup">
                <img src={pagePath('/sui-icon.png')} alt="Sui" />
                <span>Sui</span>
              </div>
              <h3 className="bento-title">Move-backed ownership</h3>
              <p className="bento-desc">
                Sui stores the durable control plane: creator ownership, published state, submission
                pointers, status, priority, and events.
              </p>
            </article>

            <article className="bento-card bento-col-4 reveal-up" data-delay="0.1">
              <div className="brand-lockup">
                <img src={pagePath('/seal-logo.svg')} alt="Seal" />
                <span>Seal</span>
              </div>
              <h3 className="bento-title">Privacy when it matters</h3>
              <p className="bento-desc">
                Sensitive answers are encrypted before upload and unlocked only from the creator
                dashboard.
              </p>
            </article>

            <article className="bento-card bento-col-4 reveal-up" data-delay="0.15">
              <div className="bento-number">09</div>
              <h3 className="bento-title">Fields for real feedback</h3>
              <p className="bento-desc">
                Text, textarea, dropdown, checkbox, rating, URL, confirmation, screenshot, and video
                upload fields.
              </p>
            </article>

            <article className="bento-card bento-col-4 reveal-up" data-delay="0.2">
              <div className="bento-number">CSV</div>
              <h3 className="bento-title">Review table output</h3>
              <p className="bento-desc">
                Dashboard submissions become a usable table with filters, internal notes, priority,
                status, decrypt, and CSV export.
              </p>
            </article>
          </div>
        </section>

        {/* Proof model */}
        <section className="proof-section" id="proof">
          <div className="proof-panel reveal-up">
            <div className="proof-copy">
              <div className="section-tag">Proof model</div>
              <h2 className="section-title">Every claim maps to a technical artifact.</h2>
              <p className="section-copy">
                Judges inspect the same pipeline the creator uses: Walrus blob IDs for content, Seal
                for sensitive values, Sui for ownership and review metadata.
              </p>
            </div>

            <div className="proof-table">
              {proofRows.map(([artifact, rail, result]) => (
                <div className="proof-row" key={artifact}>
                  <span>{artifact}</span>
                  <strong>{rail}</strong>
                  <p>{result}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <div className="closing-cta reveal-up">
          <div>
            <span className="eyebrow">TaskForm</span>
            <h2>Collect, protect, verify, and review feedback on Walrus-native rails.</h2>
          </div>
          <a href={pagePath('/dashboard.html')} className="btn-primary">
            Open Dashboard
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </main>

      <footer className="premium-footer reveal-up">
        <div className="footer-content">
          <div className="footer-main">
            <a href={pagePath('/')} className="footer-logo" aria-label="TaskForm home">
              <img src={pagePath('/logo-mark.svg')} alt="" />
              <span>TaskForm</span>
            </a>
            <p className="footer-text">
              Walrus-native forms for collecting, protecting, verifying, and reviewing structured
              community feedback.
            </p>
          </div>

          <div className="footer-links" aria-label="Footer links">
            <a href="#architecture">Architecture</a>
            <a href="#proof">Proof model</a>
            <a href={pagePath('/create-form.html')}>Create form</a>
            <a href={pagePath('/dashboard.html')}>Dashboard</a>
          </div>

          <div className="footer-meta">
            <span>Walrus Tools Builder</span>
            <span>Walrus storage · Seal privacy · Sui ownership</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
