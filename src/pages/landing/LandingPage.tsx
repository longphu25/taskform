import { pagePath } from '../../utils/paths'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-6xl rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <a href={pagePath('/')} className="text-lg font-bold tracking-tight">
            TaskForm
          </a>
          <a
            href={pagePath('/dashboard.html')}
            className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-indigo-500"
          >
            Launch App
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex min-h-screen flex-col items-center justify-center px-4 pt-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            Built on Walrus &amp; Sui
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Feedback Operating System
            <br />
            <span className="text-indigo-400">for Decentralized Teams</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg text-slate-400">
            Collect private feedback, sponsor user submissions, and manage storage lifecycle — all
            powered by Walrus storage and Seal encryption.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={pagePath('/dashboard.html')}
              className="cursor-pointer rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold transition-colors duration-200 hover:bg-indigo-500"
            >
              Launch App
            </a>
            <a
              href="#features"
              className="cursor-pointer rounded-xl border border-white/10 px-8 py-3.5 text-base font-semibold transition-colors duration-200 hover:border-white/20 hover:bg-white/5"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold">Why TaskForm?</h2>
          <p className="mx-auto mb-16 max-w-2xl text-center text-slate-400">
            Web2 UX, Web3 ownership. Create forms, collect feedback, and manage everything on-chain.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              title="Walrus Storage"
              description="Form schemas and submissions stored on Walrus — decentralized, epoch-based, and cost-effective."
              icon={<WalrusIcon />}
            />
            <FeatureCard
              title="Seal Encryption"
              description="Field-level privacy. Sensitive data is encrypted before upload — only authorized admins can decrypt."
              icon={<SealIcon />}
            />
            <FeatureCard
              title="Sponsored Submissions"
              description="Creators sponsor gas fees so submitters never need a wallet. Frictionless feedback collection."
              icon={<SponsorIcon />}
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-16 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-4">
            <Step number={1} title="Create" description="Build your form with custom fields" />
            <Step
              number={2}
              title="Publish"
              description="Store schema on Walrus, get a public link"
            />
            <Step
              number={3}
              title="Collect"
              description="Anyone can submit — fast, private, sponsored"
            />
            <Step
              number={4}
              title="Manage"
              description="Triage, decrypt, export from your dashboard"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to collect feedback?</h2>
          <p className="mb-8 text-slate-400">Start building your first form in minutes.</p>
          <a
            href={pagePath('/dashboard.html')}
            className="cursor-pointer inline-block rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold transition-colors duration-200 hover:bg-indigo-500"
          >
            Launch App
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-slate-500">
          TaskForm — Walrus-native feedback operating system
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 transition-colors duration-200 hover:border-white/20">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-400">{description}</p>
    </div>
  )
}

function Step({
  number,
  title,
  description,
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold">
        {number}
      </div>
      <h3 className="mb-1 font-semibold">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  )
}

function WalrusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
      />
    </svg>
  )
}

function SealIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
      />
    </svg>
  )
}

function SponsorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
      />
    </svg>
  )
}
