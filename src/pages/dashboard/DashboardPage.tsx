import { pagePath } from '../../utils/paths'

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-7xl rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <a href={pagePath('/')} className="text-lg font-bold tracking-tight">
            TaskForm
          </a>
          <div className="flex items-center gap-4">
            <a
              href={pagePath('/create-form.html')}
              className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-indigo-500"
            >
              New Form
            </a>
            <button
              type="button"
              className="cursor-pointer rounded-lg border border-white/10 px-4 py-2 text-sm font-medium transition-colors duration-200 hover:border-white/20 hover:bg-white/5"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 pt-24">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-slate-400">Manage your forms and submissions</p>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-8 w-8 text-slate-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold">No forms yet</h3>
          <p className="mb-6 text-sm text-slate-400">
            Create your first form to start collecting feedback
          </p>
          <a
            href={pagePath('/create-form.html')}
            className="cursor-pointer rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium transition-colors duration-200 hover:bg-indigo-500"
          >
            Create Form
          </a>
        </div>
      </main>
    </div>
  )
}
