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

const stackStats = [
  ['Walrus', 'Blob IDs'],
  ['Seal', 'Encrypted fields'],
  ['Sui', 'Move events'],
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
        <section className="hero-section" id="hero">
          <div className="hero-glow-bg" />
          <div className="hero-grid-bg" />

          <div className="hero-content reveal-up" data-delay="0.1">
            <div className="badge">
              <span className="badge-dot" />
              Walrus Tools Builder
            </div>
            <h1 className="hero-title">
              Walrus-native form builder for structured community feedback.
            </h1>
            <p className="hero-subtitle">
              TaskForm turns every feedback form into a verifiable data pipeline:
              schemas and submissions live on Walrus, sensitive fields are protected
              with Seal, and Sui anchors ownership plus review state.
            </p>
            <div className="hero-cta-group">
              <a href={pagePath('/create-form.html')} className="btn-primary">
                Create Form
                <span aria-hidden="true">→</span>
              </a>
              <a href="#architecture" className="btn-secondary">
                View Architecture
              </a>
            </div>
          </div>

          <div className="stack-stage reveal-up" data-delay="0.25" aria-label="TaskForm technical architecture animation">
            <div className="stack-stage-header">
              <div>
                <span className="eyebrow">Live architecture</span>
                <h2>From form design to reviewable proof</h2>
              </div>
              <div className="stack-logos" aria-label="Sui, Walrus, and Seal logos">
                <img src={pagePath('/sui-logo.svg')} alt="Sui" />
                <img src={pagePath('/walrus-icon.png')} alt="Walrus" />
                <img src={pagePath('/seal-logo.svg')} alt="Seal" />
              </div>
            </div>

            <div className="architecture-board">
              <aside className="architecture-brief">
                <span className="brief-index">01</span>
                <h3>One form becomes a verifiable data product.</h3>
                <p>
                  The creator edits a schema once. TaskForm routes every later action
                  through the correct rail: Walrus for content, Seal for privacy, and
                  Sui for ownership plus review state.
                </p>
                <div className="architecture-stats">
                  {stackStats.map(([name, label]) => (
                    <div key={name}>
                      <strong>{name}</strong>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </aside>

              <div className="pipeline-map" aria-label="TaskForm data pipeline">
                <div className="pipeline-spine" />
                <div className="pipeline-pulse pulse-one">schema</div>
                <div className="pipeline-pulse pulse-two">ciphertext</div>
                <div className="pipeline-pulse pulse-three">pointer</div>

                {stackNodes.map((node, index) => (
                  <article className={`pipeline-node node-${index + 1} tone-${node.tone}`} key={node.name}>
                    <div className="pipeline-node-icon">
                      <img src={node.icon} alt="" />
                    </div>
                    <span>{node.label}</span>
                    <h3>{node.name}</h3>
                    <p>{node.detail}</p>
                  </article>
                ))}
              </div>

              <aside className="proof-console" aria-label="Technical proof console">
                <div className="console-topbar">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="console-body">
                  <p>
                    <span>tx</span> create_form(schema_blob_id)
                  </p>
                  <p>
                    <span>walrus</span> submit.json + attachments
                  </p>
                  <p>
                    <span>seal</span> private fields encrypted client-side
                  </p>
                  <p>
                    <span>sui</span> status, priority, events
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="story-section" id="architecture">
          <div className="section-header reveal-up">
            <div className="section-tag">Architecture</div>
            <h2 className="section-title">A builder tool, not a Web2 form clone.</h2>
            <p className="section-copy">
              The landing page is structured as a pitch deck: problem, pipeline,
              proof model, and demo path are all visible without switching slides.
            </p>
          </div>

          <div className="bento-grid" ref={bentoRef}>
            <article className="bento-card bento-col-6 reveal-up">
              <div className="brand-lockup">
                <img src={pagePath('/walrus-icon.png')} alt="Walrus" />
                <span>Walrus</span>
              </div>
              <h3 className="bento-title">Blob-first storage</h3>
              <p className="bento-desc">
                Large data never goes on-chain. Form JSON, responses, screenshots,
                and demo artifacts are stored as Walrus blobs with visible proof IDs.
              </p>
            </article>

            <article className="bento-card bento-col-6 reveal-up" data-delay="0.05">
              <div className="brand-lockup">
                <img src={pagePath('/sui-icon.png')} alt="Sui" />
                <span>Sui</span>
              </div>
              <h3 className="bento-title">Move-backed ownership</h3>
              <p className="bento-desc">
                Sui stores the durable control plane: creator ownership, published
                state, submission pointers, status, priority, and events for indexing.
              </p>
            </article>

            <article className="bento-card bento-col-4 reveal-up" data-delay="0.1">
              <div className="brand-lockup">
                <img src={pagePath('/seal-logo.svg')} alt="Seal" />
                <span>Seal</span>
              </div>
              <h3 className="bento-title">Privacy when it matters</h3>
              <p className="bento-desc">
                Sensitive answers are encrypted before upload and unlocked only from
                the creator dashboard.
              </p>
            </article>

            <article className="bento-card bento-col-4 reveal-up" data-delay="0.15">
              <div className="bento-number">09</div>
              <h3 className="bento-title">Fields for real feedback</h3>
              <p className="bento-desc">
                Text, textarea, dropdown, checkbox, rating, URL, confirmation,
                screenshot, and video upload fields cover the judging use case.
              </p>
            </article>

            <article className="bento-card bento-col-4 reveal-up" data-delay="0.2">
              <div className="bento-number">CSV</div>
              <h3 className="bento-title">Review table output</h3>
              <p className="bento-desc">
                Dashboard submissions become a usable table with filters, internal
                notes, priority, status, decrypt, JSON backup, and CSV export.
              </p>
            </article>
          </div>
        </section>

        <section className="proof-section" id="proof">
          <div className="proof-panel reveal-up">
            <div className="proof-copy">
              <div className="section-tag">Proof model</div>
              <h2 className="section-title">Every demo claim maps to a technical artifact.</h2>
              <p className="section-copy">
                Judges can inspect the same pipeline the creator uses: Walrus blob
                IDs for content, Seal for sensitive values, and Sui for ownership
                and review metadata.
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

        <div className="closing-cta reveal-up">
          <div>
            <span className="eyebrow">TaskForm</span>
            <h2>Collect, protect, verify, and review feedback on Walrus-native rails.</h2>
          </div>
          <a href={pagePath('/dashboard.html')} className="btn-primary">
            Open Dashboard
            <span aria-hidden="true">→</span>
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
              Walrus-native forms for collecting, protecting, verifying, and reviewing
              structured community feedback.
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
