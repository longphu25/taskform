import { pagePath } from '../../utils/paths'

const rails = [
  {
    name: 'Walrus',
    label: 'Blob storage',
    description:
      'Schemas, submissions, screenshots, video attachments, and demo artifacts stay off-chain as inspectable blobs.',
    icon: pagePath('/walrus-icon.png'),
    tone: 'walrus',
  },
  {
    name: 'Seal',
    label: 'Private fields',
    description:
      'Sensitive answers are encrypted client-side before upload and opened only from the creator dashboard.',
    icon: pagePath('/seal-logo.svg'),
    tone: 'seal',
  },
  {
    name: 'Sui',
    label: 'Ownership index',
    description:
      'Creator ownership, published state, submission pointers, status, priority, and events are anchored on-chain.',
    icon: pagePath('/sui-icon.png'),
    tone: 'sui',
  },
]

const pipeline = [
  [
    '01',
    'Build',
    'Create a form from feedback, bug report, survey, application, or Walrus Builder templates.',
  ],
  [
    '02',
    'Publish',
    'Upload the schema to Walrus and anchor the public form pointer through Sui metadata.',
  ],
  [
    '03',
    'Collect',
    'Receive public submissions, attachments, and optional encrypted answers without a server database.',
  ],
  [
    '04',
    'Review',
    'Filter, prioritize, decrypt, note, and export responses from the creator dashboard.',
  ],
]

const features = [
  [
    'Blob-first storage',
    'Large form data never goes on-chain. Walrus stores schemas, responses, screenshots, and video proof.',
  ],
  [
    'Move-backed ownership',
    'Sui tracks creators, publication state, submission pointers, review status, priority, and events.',
  ],
  [
    'Privacy by field',
    'Seal protects sensitive responses while keeping normal feedback fast and easy to submit.',
  ],
  [
    'Review table output',
    'Dashboard workflows cover filtering, status, priority, internal notes, decrypt, CSV, and JSON backup.',
  ],
  [
    'Ultra-light public form',
    'The submit page stays small and fast, with SDKs loaded only when a submission actually needs them.',
  ],
  [
    'Sponsored submission path',
    'Creators can sponsor gas so public submitters get Web2-like UX with Web3 ownership underneath.',
  ],
]

const useCases = [
  'Walrus Tools Builder feedback',
  'Hackathon judging intake',
  'Bug reports',
  'Feature requests',
  'Grant applications',
  'DAO surveys',
  'Private security feedback',
  'Open-source maintainer triage',
]

const proofRows = [
  ['Form schema', 'Walrus blob', 'Public form renders from blob ID'],
  ['Submission payload', 'Walrus blob', 'Body and attachments stay off-chain'],
  ['Sensitive fields', 'Seal encrypted payload', 'Creator decrypts in dashboard'],
  ['Metadata pointer', 'Sui Move event/object', 'Ownership and review state are verifiable'],
]

export function LandingPage() {
  return (
    <div className="landing-shell">
      <header className="site-header reveal-up">
        <a href={pagePath('/')} className="brand-link" aria-label="TaskForm home">
          <img src={pagePath('/logo-mark.svg')} alt="" />
          <span>TaskForm</span>
        </a>

        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#product">Product</a>
          <a href="#architecture">Architecture</a>
          <a href="#proof">Proof</a>
          <a href={pagePath('/dashboard.html')}>Dashboard</a>
        </nav>

        <a href={pagePath('/dashboard.html')} className="nav-cta">
          Launch App
        </a>
      </header>

      <main>
        <section className="hero-section" id="product">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-layout">
            <div className="hero-copy reveal-up">
              <p className="eyebrow">Walrus-native feedback OS</p>
              <h1>Build forms. Store on Walrus. Own on Sui.</h1>
              <p className="hero-lede">
                TaskForm helps builders collect structured feedback, protect sensitive fields,
                verify storage and ownership, then review everything from a practical dashboard.
              </p>

              <div className="hero-actions">
                <a href={pagePath('/create-form.html')} className="button button-primary">
                  Create Form
                  <span aria-hidden="true">-&gt;</span>
                </a>
                <a href="#architecture" className="button button-secondary">
                  View Architecture
                </a>
              </div>

              <div className="hero-meta" aria-label="TaskForm capabilities">
                <span>Walrus storage</span>
                <span>Seal privacy</span>
                <span>Sui metadata</span>
                <span>CSV export</span>
              </div>
            </div>

            <div
              className="product-frame reveal-up"
              data-delay="0.12"
              aria-label="TaskForm dashboard preview"
            >
              <div className="frame-topbar">
                <span />
                <span />
                <span />
                <strong>taskform.live/proof</strong>
              </div>

              <div className="dashboard-preview">
                <aside className="preview-sidebar">
                  <div className="sidebar-logo">
                    <img src={pagePath('/logo-mark.svg')} alt="" />
                    <span>TaskForm</span>
                  </div>
                  {['My Forms', 'Submissions', 'Decrypt', 'Export'].map((item, index) => (
                    <div
                      className={index === 1 ? 'sidebar-item active' : 'sidebar-item'}
                      key={item}
                    >
                      {item}
                    </div>
                  ))}
                </aside>

                <section className="preview-main">
                  <div className="preview-toolbar">
                    <div>
                      <span className="tiny-label">Walrus Builder Feedback</span>
                      <h2>Submission Inbox</h2>
                    </div>
                    <span className="status-pill">Live</span>
                  </div>

                  <div className="rail-status">
                    {rails.map((rail) => (
                      <article className={`rail-chip tone-${rail.tone}`} key={rail.name}>
                        <img src={rail.icon} alt="" />
                        <div>
                          <strong>{rail.name}</strong>
                          <span>{rail.label}</span>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="submission-table">
                    <div className="table-head">
                      <span>Type</span>
                      <span>Rail</span>
                      <span>Status</span>
                    </div>
                    {[
                      ['Bug report', 'Walrus + Sui', 'Priority'],
                      ['Private note', 'Seal encrypted', 'Decrypt'],
                      ['Builder feedback', 'Blob proof', 'Reviewed'],
                    ].map(([type, rail, status]) => (
                      <div className="table-row" key={type}>
                        <span>{type}</span>
                        <span>{rail}</span>
                        <strong>{status}</strong>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>

        <section className="rail-section">
          <div className="section-heading reveal-up">
            <p className="eyebrow">Three rails</p>
            <h2>Content, privacy, and ownership are separated by design.</h2>
          </div>
          <div className="rail-grid">
            {rails.map((rail) => (
              <article className={`rail-card tone-${rail.tone} reveal-up`} key={rail.name}>
                <div className="rail-icon">
                  <img src={rail.icon} alt="" />
                </div>
                <span>{rail.label}</span>
                <h3>{rail.name}</h3>
                <p>{rail.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="architecture-section" id="architecture">
          <div className="section-heading reveal-up">
            <p className="eyebrow">Architecture</p>
            <h2>From form design to reviewable proof.</h2>
            <p>
              One creator action produces a visible chain of artifacts: form schema, submission
              blob, encrypted private values, and on-chain review state.
            </p>
          </div>

          <div className="pipeline">
            {pipeline.map(([step, title, detail]) => (
              <article className="pipeline-step reveal-up" key={step}>
                <span>{step}</span>
                <h3>{title}</h3>
                <p>{detail}</p>
              </article>
            ))}
          </div>

          <div className="trace-block reveal-up">
            <div className="trace-line">
              <span className="tag tag-walrus">walrus</span>
              <code>schema.json + submit.json + attachments -&gt; blob_id</code>
            </div>
            <div className="trace-line">
              <span className="tag tag-seal">seal</span>
              <code>private_fields -&gt; encrypted_payload</code>
            </div>
            <div className="trace-line">
              <span className="tag tag-sui">sui</span>
              <code>form_owner + submission_pointer + status + priority -&gt; event</code>
            </div>
          </div>
        </section>

        <section className="feature-section">
          <div className="section-heading reveal-up">
            <p className="eyebrow">Product surface</p>
            <h2>A builder tool, not a Web2 form clone.</h2>
          </div>

          <div className="feature-grid">
            {features.map(([title, detail]) => (
              <article className="feature-card reveal-up" key={title}>
                <h3>{title}</h3>
                <p>{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="use-case-section">
          <div className="section-heading reveal-up">
            <p className="eyebrow">Use cases</p>
            <h2>Built for real intake workflows.</h2>
          </div>

          <div className="use-case-grid">
            {useCases.map((useCase) => (
              <span className="use-case-pill reveal-up" key={useCase}>
                {useCase}
              </span>
            ))}
          </div>
        </section>

        <section className="proof-section" id="proof">
          <div className="proof-panel reveal-up">
            <div>
              <p className="eyebrow">Proof model</p>
              <h2>Every claim maps to a technical artifact.</h2>
              <p>
                Judges and creators inspect the same pipeline: Walrus blob IDs for content, Seal for
                sensitive values, and Sui for ownership plus review metadata.
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

        <section className="final-cta reveal-up">
          <div>
            <p className="eyebrow">TaskForm</p>
            <h2>Collect, protect, verify, and review feedback on Walrus-native rails.</h2>
          </div>
          <div className="hero-actions">
            <a href={pagePath('/dashboard.html')} className="button button-primary">
              Open Dashboard
              <span aria-hidden="true">-&gt;</span>
            </a>
            <a href={pagePath('/create-form.html')} className="button button-secondary">
              Create a form
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <a href={pagePath('/')} className="brand-link">
            <img src={pagePath('/logo-mark.svg')} alt="" />
            <span>TaskForm</span>
          </a>
          <p>
            Walrus-native forms for collecting, protecting, verifying, and reviewing structured
            community feedback.
          </p>
        </div>
        <nav aria-label="Footer navigation">
          <a href="#architecture">Architecture</a>
          <a href="#proof">Proof model</a>
          <a href={pagePath('/create-form.html')}>Create form</a>
          <a href={pagePath('/dashboard.html')}>Dashboard</a>
        </nav>
      </footer>
    </div>
  )
}
