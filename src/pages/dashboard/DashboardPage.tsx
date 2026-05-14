import { pagePath } from '../../utils/paths'

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#071011] text-[#effff8]">
      {/* Navbar */}
      <nav className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-7xl rounded-2xl border border-[rgba(190,255,234,0.16)] bg-[rgba(8,24,25,0.82)] px-6 py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <a href={pagePath('/')} className="text-lg font-bold tracking-tight">
            TaskForm
          </a>
          <div className="flex items-center gap-4">
            <a
              href={pagePath('/create-form.html')}
              className="cursor-pointer rounded-lg bg-[#80ffd5] px-4 py-2 text-sm font-medium text-[#06231d] transition-colors duration-200 hover:bg-[#28d8c1]"
            >
              New Form
            </a>
            <button
              type="button"
              className="cursor-pointer rounded-lg border border-[rgba(190,255,234,0.16)] px-4 py-2 text-sm font-medium transition-colors duration-200 hover:border-[rgba(190,255,234,0.34)] hover:bg-[#80ffd5]/10"
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
          <p className="text-[#9fb9b1]">Manage your forms and submissions</p>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[rgba(190,255,234,0.16)] py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0d1c1d]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-8 w-8 text-[#9fb9b1]/70"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold">No forms yet</h3>
          <p className="mb-6 text-sm text-[#9fb9b1]">
            Create your first form to start collecting feedback
          </p>
          <a
            href={pagePath('/create-form.html')}
            className="cursor-pointer rounded-lg bg-[#80ffd5] px-6 py-2.5 text-sm font-medium text-[#06231d] transition-colors duration-200 hover:bg-[#28d8c1]"
          >
            Create Form
          </a>
        </div>
      </main>
    </div>
  )
}
