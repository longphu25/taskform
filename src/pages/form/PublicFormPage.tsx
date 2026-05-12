export function PublicFormPage() {
  const params = new URLSearchParams(window.location.search)
  const formId = params.get('formId')

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Minimal navbar */}
      <nav className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-2xl rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">TaskForm</span>
          <span className="text-xs text-slate-500">Powered by Walrus</span>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-2xl px-4 pt-24">
        {formId ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8">
            <p className="text-sm text-slate-500">Loading form: {formId}</p>
            <p className="mt-2 text-slate-500">
              Public form renderer will be implemented in Phase 5 (Day 4)
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="mb-2 text-xl font-semibold">No form specified</h2>
            <p className="text-slate-400">Please use a valid form link.</p>
          </div>
        )}
      </main>
    </div>
  )
}
