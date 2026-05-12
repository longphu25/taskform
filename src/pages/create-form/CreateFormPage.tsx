import { pagePath } from '../../utils/paths'

export function CreateFormPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-7xl rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <a href={pagePath('/')} className="text-lg font-bold tracking-tight">
            TaskForm
          </a>
          <a
            href={pagePath('/dashboard.html')}
            className="cursor-pointer rounded-lg border border-white/10 px-4 py-2 text-sm font-medium transition-colors duration-200 hover:border-white/20 hover:bg-white/5"
          >
            Back to Dashboard
          </a>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 pt-24">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Create Form</h1>
          <p className="text-slate-400">Build your feedback form</p>
        </div>

        {/* Form builder shell */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8">
          <p className="text-slate-500">Form builder will be implemented in Phase 3 (Day 2)</p>
        </div>
      </main>
    </div>
  )
}
