import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Archive,
  CheckCircle2,
  Download,
  FileText,
  Filter,
  KeyRound,
  Link2,
  Lock,
  MessageSquareText,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Wallet,
  X,
} from 'lucide-react'
import { pagePath } from '../../utils/paths'

type SubmissionStatus =
  | 'new'
  | 'reviewing'
  | 'planned'
  | 'in_progress'
  | 'done'
  | 'resolved'
  | 'archived'
type Priority = 'high' | 'medium' | 'low' | 'critical'
type AttachmentKind = 'none' | 'screenshot' | 'video'

// Mock dashboard rows mirror the live integration contract:
// ids are Sui object IDs; descriptive fields are hydrated from Walrus schema/submission JSON.
const forms = [
  {
    id: '0x2f72b9575d7aa6fa57da3bb0c0b9914f983f8eb22ac5423dbf3e0b7c8a726101',
    title: 'Walrus Builder Feedback',
    category: 'Best feedback regarding building on Walrus',
    submissions: 24,
    encrypted: 7,
    attachments: 11,
    storage: 'Healthy',
    expiry: '42 epochs',
  },
  {
    id: '0x8d31f6f07db8459434a2b856a33dc8ebc6ab83d4094d2d3fbcad75f9f1fb52c8',
    title: 'Protocol Bug Reports',
    category: 'Bug report',
    submissions: 12,
    encrypted: 5,
    attachments: 8,
    storage: 'Renew soon',
    expiry: '8 epochs',
  },
  {
    id: '0xb47b14d59d98be0ac5cf2d52e8b2924678451bf2b8c8c35041d4e51b8907a771',
    title: 'Mini Grant Applications',
    category: 'Application',
    submissions: 9,
    encrypted: 9,
    attachments: 3,
    storage: 'Healthy',
    expiry: '31 epochs',
  },
]

const submissions = [
  {
    id: '0x50d4a16fd2be4185b946bd69c8f5a7d26d7c5b5d8326708bb70bf9b6cf96f104',
    formId: '0x2f72b9575d7aa6fa57da3bb0c0b9914f983f8eb22ac5423dbf3e0b7c8a726101',
    type: 'Builder feedback',
    title: 'Walrus upload retry messages need clearer progress states',
    author: '0x8e4a...91c2',
    status: 'new' as SubmissionStatus,
    priority: 'high' as Priority,
    created: '12 min ago',
    encrypted: true,
    attachment: 'screenshot' as AttachmentKind,
    blobId: 'wal://blob_7f32...a19c',
    summary:
      'Submitter reports the upload flow feels stuck between register and certify. They attached a screenshot showing no visible confirmation state.',
  },
  {
    id: '0x127d03e6076642fb8395e8b1ac6937b5c1a3349072f2c151c34109703973903f',
    formId: '0x8d31f6f07db8459434a2b856a33dc8ebc6ab83d4094d2d3fbcad75f9f1fb52c8',
    type: 'Bug report',
    title: 'CSV export drops private-field marker',
    author: '0x22bd...43f9',
    status: 'reviewing' as SubmissionStatus,
    priority: 'medium' as Priority,
    created: '38 min ago',
    encrypted: true,
    attachment: 'none' as AttachmentKind,
    blobId: 'wal://blob_4b12...8dda',
    summary:
      'Export keeps the encrypted value masked correctly, but the private column is not included in the generated CSV.',
  },
  {
    id: '0xd7bbdaaf52a27c84acdf8248a187aab19a4636f44709962bb558ff344a4e9502',
    formId: '0x2f72b9575d7aa6fa57da3bb0c0b9914f983f8eb22ac5423dbf3e0b7c8a726101',
    type: 'Feature request',
    title: 'Add storage renewal warning to public links',
    author: '0x9a12...c701',
    status: 'planned' as SubmissionStatus,
    priority: 'medium' as Priority,
    created: '1 hr ago',
    encrypted: false,
    attachment: 'none' as AttachmentKind,
    blobId: 'wal://blob_c823...41ab',
    summary:
      'Creators want the shared form link to show a warning when schema or submission storage is close to expiry.',
  },
  {
    id: '0x88b60e3f9e807ec86f42ae73093fa9c6602590fbc51334d1778f159f40664eed',
    formId: '0xb47b14d59d98be0ac5cf2d52e8b2924678451bf2b8c8c35041d4e51b8907a771',
    type: 'Application',
    title: 'DAO tooling team requests private review',
    author: '0xfa31...64aa',
    status: 'resolved' as SubmissionStatus,
    priority: 'critical' as Priority,
    created: 'Yesterday',
    encrypted: true,
    attachment: 'video' as AttachmentKind,
    blobId: 'wal://blob_1ad0...e552',
    summary:
      'Application includes private contact details and a video walkthrough. Marked resolved after dashboard review.',
  },
]

const statusLabels: Record<SubmissionStatus, string> = {
  new: 'New',
  reviewing: 'Reviewing',
  planned: 'Planned',
  in_progress: 'In progress',
  done: 'Done',
  resolved: 'Resolved',
  archived: 'Archived',
}

const priorityLabels: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  critical: 'Critical',
}

const statusOptions = [
  'all',
  'new',
  'reviewing',
  'planned',
  'in_progress',
  'done',
  'resolved',
  'archived',
] as const

function statusTone(status: SubmissionStatus) {
  if (status === 'done' || status === 'resolved') return 'mint'
  if (status === 'archived') return 'muted'
  if (status === 'planned' || status === 'in_progress') return 'seal'
  return 'muted'
}

function priorityTone(priority: Priority) {
  if (priority === 'critical' || priority === 'high') return 'amber'
  return 'muted'
}

function formatSubmissionLabel(submissionMetaId: string) {
  return `SUB-${submissionMetaId.slice(-4).toUpperCase()}`
}

const storageProgress = {
  Healthy: '78%',
  'Renew soon': '24%',
}

export function DashboardPage() {
  const [selectedFormId, setSelectedFormId] = useState(forms[0].id)
  const [selectedStatus, setSelectedStatus] = useState<'all' | SubmissionStatus>('all')
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(submissions[0].id)
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)

  const filteredSubmissions = useMemo(
    () =>
      submissions.filter((submission) => {
        const matchesForm = selectedFormId === 'all' || submission.formId === selectedFormId
        const matchesStatus = selectedStatus === 'all' || submission.status === selectedStatus
        return matchesForm && matchesStatus
      }),
    [selectedFormId, selectedStatus],
  )

  const selectedSubmission =
    filteredSubmissions.find((submission) => submission.id === selectedSubmissionId) ??
    filteredSubmissions[0] ??
    submissions[0]

  const activeForm = forms.find((form) => form.id === selectedFormId) ?? forms[0]

  return (
    <div className="min-h-screen bg-[#071011] text-[#effff8]">
      <main className="mx-auto grid max-w-[1440px] grid-cols-1 gap-5 px-4 py-5 xl:grid-cols-[268px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-[rgba(190,255,234,0.16)] bg-[rgba(8,24,25,0.82)] p-3 xl:sticky xl:top-5 xl:h-[calc(100vh-2.5rem)] xl:overflow-y-auto">
          <div className="mb-3 rounded-xl border border-[rgba(190,255,234,0.12)] bg-[#071011]/40 p-2.5">
            <a
              href={pagePath('/')}
              className="flex min-w-0 items-center gap-2 text-base font-bold tracking-tight"
            >
              <img src={pagePath('/logo-mark.svg')} alt="" className="size-5 shrink-0" />
              <span className="truncate">TaskForm</span>
            </a>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a
                href={pagePath('/create-form.html')}
                className="inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-[#80ffd5] px-2.5 py-2 text-xs font-bold text-[#06231d] transition-colors duration-200 hover:bg-[#28d8c1]"
              >
                <Plus className="size-4" />
                New
              </a>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[rgba(190,255,234,0.16)] px-2.5 py-2 text-xs font-bold transition-colors duration-200 hover:border-[rgba(190,255,234,0.34)] hover:bg-[#80ffd5]/10"
              >
                <Wallet className="size-4" />
                Wallet
              </button>
            </div>
          </div>

          <div className="mb-2 flex items-center justify-between gap-2 px-1">
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#ffc46b] uppercase">My Forms</p>
              <h2 className="truncate text-sm font-bold tracking-tight text-[#effff8]">
                Collection surfaces
              </h2>
            </div>
            <span className="shrink-0 rounded-full border border-[#80ffd5]/30 bg-[#80ffd5]/10 px-2 py-0.5 text-xs font-bold text-[#80ffd5]">
              {forms.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSelectedFormId('all')}
            className={`mb-2 flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border px-2.5 py-2 text-left transition-colors ${
              selectedFormId === 'all'
                ? 'border-[#80ffd5]/50 bg-[#80ffd5]/10'
                : 'border-[rgba(190,255,234,0.16)] bg-[#071011]/35 hover:bg-[#80ffd5]/5'
            }`}
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold">All submissions</span>
              <span className="block truncate text-xs text-[#9fb9b1]">Cross-form inbox</span>
            </span>
            <span className="shrink-0 font-mono text-sm text-[#80ffd5]">{submissions.length}</span>
          </button>

          <div className="space-y-1.5">
            {forms.map((form) => (
              <button
                key={form.id}
                type="button"
                onClick={() => setSelectedFormId(form.id)}
                className={`w-full cursor-pointer rounded-lg border p-2.5 text-left transition-colors ${
                  selectedFormId === form.id
                    ? 'border-[#80ffd5]/50 bg-[#80ffd5]/10'
                    : 'border-[rgba(190,255,234,0.16)] bg-[#071011]/35 hover:bg-[#80ffd5]/5'
                }`}
              >
                <span className="flex min-w-0 items-start justify-between gap-2">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">{form.title}</span>
                    <span className="mt-0.5 block truncate text-xs text-[#9fb9b1]">
                      {form.category}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full border border-[rgba(190,255,234,0.16)] px-1.5 py-0.5 font-mono text-[11px] text-[#80ffd5]">
                    {form.submissions}
                  </span>
                </span>
                <span className="mt-2 flex items-center gap-2 text-[11px] text-[#9fb9b1]">
                  <span className="font-mono text-[#c6d8ff]">{form.encrypted}</span>
                  <span>Private</span>
                  <span className="text-[rgba(190,255,234,0.22)]">/</span>
                  <span className="font-mono text-[#fbffea]">{form.attachments}</span>
                  <span>Files</span>
                </span>
                <span className="mt-2 block">
                  <span className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="truncate text-[#9fb9b1]">Storage · Walrus lifecycle</span>
                    <span
                      className={
                        form.storage === 'Healthy'
                          ? 'shrink-0 font-bold text-[#80ffd5]'
                          : 'shrink-0 font-bold text-[#ffc46b]'
                      }
                    >
                      {form.expiry}
                    </span>
                  </span>
                  <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-[rgba(190,255,234,0.12)]">
                    <span
                      className={`block h-full rounded-full ${
                        form.storage === 'Healthy' ? 'bg-[#80ffd5]' : 'bg-[#ffc46b]'
                      }`}
                      style={{
                        width: storageProgress[form.storage as keyof typeof storageProgress],
                      }}
                    />
                  </span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="min-w-0 space-y-5">
          <header className="rounded-2xl border border-[rgba(190,255,234,0.16)] bg-[rgba(8,24,25,0.82)] px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#ffc46b] uppercase">Admin dashboard</p>
                <h1 className="mt-1 text-xl font-black tracking-[-0.03em]">
                  Review, prioritize, decrypt, and export feedback.
                </h1>
              </div>
              <button
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[rgba(190,255,234,0.16)] px-3 py-2 text-sm font-medium hover:bg-[#80ffd5]/10"
                type="button"
              >
                <Link2 className="size-4" />
                Copy public link
              </button>
            </div>
          </header>

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <MetricCard
              label="Submissions"
              value="45"
              detail="+8 today"
              icon={<MessageSquareText className="size-4" />}
            />
            <MetricCard
              label="Encrypted"
              value="21"
              detail="Seal protected"
              icon={<Lock className="size-4" />}
            />
            <MetricCard
              label="Attachments"
              value="22"
              detail="Screens + videos"
              icon={<Archive className="size-4" />}
            />
            <MetricCard
              label="Storage"
              value="3 forms"
              detail="1 renew soon"
              icon={<ShieldCheck className="size-4" />}
              warning
            />
          </div>

          <div className="rounded-2xl border border-[rgba(190,255,234,0.16)] bg-[rgba(8,24,25,0.82)] p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold tracking-tight">Submission inbox</h2>
                <p className="text-sm text-[#9fb9b1]">
                  {selectedFormId === 'all' ? 'All forms' : activeForm.title}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
                      selectedStatus === status
                        ? 'border-[#80ffd5]/50 bg-[#80ffd5]/10 text-[#80ffd5]'
                        : 'border-[rgba(190,255,234,0.16)] text-[#9fb9b1] hover:bg-[#80ffd5]/10'
                    }`}
                  >
                    {status === 'all' ? 'All' : statusLabels[status]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-2 lg:grid-cols-[1fr_auto_auto_auto]">
              <label className="flex items-center gap-2 rounded-lg border border-[rgba(190,255,234,0.16)] bg-[#071011]/45 px-3 py-2">
                <Search className="size-4 text-[#9fb9b1]" />
                <input
                  placeholder="Search keyword, wallet, blob ID..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-[#effff8] outline-none placeholder:text-[#9fb9b1]/55"
                />
              </label>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[rgba(190,255,234,0.16)] px-3 py-2 text-sm text-[#9fb9b1] hover:bg-[#80ffd5]/10"
              >
                <Filter className="size-4" />
                More filters
              </button>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[rgba(190,255,234,0.16)] px-3 py-2 text-sm text-[#9fb9b1] hover:bg-[#80ffd5]/10"
              >
                <Download className="size-4" />
                JSON
              </button>
              <button
                type="button"
                onClick={() => setIsExportOpen(true)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#80ffd5]/30 bg-[#80ffd5]/10 px-3 py-2 text-sm font-bold text-[#80ffd5] hover:bg-[#80ffd5]/20"
              >
                <Download className="size-4" />
                Proof exports
              </button>
            </div>

            <div className="rounded-xl border border-[rgba(190,255,234,0.16)]">
              <div className="hidden grid-cols-[minmax(280px,1.4fr)_minmax(150px,0.65fr)_minmax(130px,0.55fr)_minmax(180px,0.75fr)] gap-3 bg-[#071011]/50 px-4 py-3 text-xs font-bold text-[#9fb9b1] uppercase lg:grid">
                <span>Submission</span>
                <span>Signals</span>
                <span>Review</span>
                <span>Pointer</span>
              </div>
              {filteredSubmissions.map((submission) => (
                <button
                  key={submission.id}
                  type="button"
                  onClick={() => {
                    setSelectedSubmissionId(submission.id)
                    setIsReviewOpen(true)
                  }}
                  className={`grid w-full cursor-pointer gap-3 border-t border-[rgba(190,255,234,0.10)] px-4 py-4 text-left transition-colors lg:grid-cols-[minmax(280px,1.4fr)_minmax(150px,0.65fr)_minmax(130px,0.55fr)_minmax(180px,0.75fr)] ${
                    selectedSubmission.id === submission.id
                      ? 'bg-[#80ffd5]/8'
                      : 'hover:bg-[#80ffd5]/5'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-bold">{submission.title}</span>
                    <span className="mt-1 block text-xs text-[#9fb9b1]">
                      {formatSubmissionLabel(submission.id)} · {submission.type} ·{' '}
                      {submission.created}
                    </span>
                  </span>
                  <span className="flex min-w-0 flex-wrap items-start gap-1">
                    <span className="mb-1 block w-full text-[11px] font-bold text-[#9fb9b1] uppercase lg:hidden">
                      Signals
                    </span>
                    {submission.encrypted && <Badge tone="seal">Encrypted</Badge>}
                    {submission.attachment !== 'none' && (
                      <Badge tone="walrus">{submission.attachment}</Badge>
                    )}
                  </span>
                  <span className="flex min-w-0 flex-wrap items-start gap-1 lg:block lg:space-y-1">
                    <span className="mb-1 block w-full text-[11px] font-bold text-[#9fb9b1] uppercase lg:hidden">
                      Review
                    </span>
                    <Badge tone={priorityTone(submission.priority)}>
                      {priorityLabels[submission.priority]}
                    </Badge>
                    <Badge tone={statusTone(submission.status)}>
                      {statusLabels[submission.status]}
                    </Badge>
                  </span>
                  <span className="min-w-0">
                    <span className="mb-1 block text-[11px] font-bold text-[#9fb9b1] uppercase lg:hidden">
                      Pointer
                    </span>
                    <span className="block truncate font-mono text-xs text-[#6fbcf0]">
                      {submission.blobId}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {isReviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#071011]/78 px-4 py-8 backdrop-blur-md"
          aria-modal="true"
          role="dialog"
          aria-labelledby="submission-review-title"
        >
          <div className="max-h-[calc(100vh-4rem)] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[rgba(190,255,234,0.22)] bg-[rgba(8,24,25,0.96)] p-5 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-[rgba(190,255,234,0.12)] pb-4">
              <div>
                <p className="text-xs font-bold text-[#ffc46b] uppercase">Review submission</p>
                <h2
                  id="submission-review-title"
                  className="mt-1 text-xl font-black tracking-[-0.02em]"
                >
                  {formatSubmissionLabel(selectedSubmission.id)}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewOpen(false)}
                className="cursor-pointer rounded-lg border border-[rgba(190,255,234,0.16)] p-2 text-[#9fb9b1] hover:bg-[#80ffd5]/10 hover:text-[#effff8]"
                aria-label="Close submission review"
              >
                <X className="size-4" />
              </button>
            </div>

            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge tone={priorityTone(selectedSubmission.priority)}>
                  {priorityLabels[selectedSubmission.priority]} priority
                </Badge>
                <Badge tone={statusTone(selectedSubmission.status)}>
                  {statusLabels[selectedSubmission.status]}
                </Badge>
                {selectedSubmission.encrypted && <Badge tone="seal">Encrypted fields</Badge>}
                {selectedSubmission.attachment !== 'none' && (
                  <Badge tone="walrus">{selectedSubmission.attachment}</Badge>
                )}
              </div>

              <h3 className="text-2xl font-black leading-tight tracking-[-0.03em]">
                {selectedSubmission.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-[#9fb9b1]">{selectedSubmission.summary}</p>

              <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-3">
                <InfoTile label="Author" value={selectedSubmission.author} />
                <InfoTile label="Created" value={selectedSubmission.created} />
                <InfoTile label="Type" value={selectedSubmission.type} />
                <InfoTile label="SubmissionMeta" value={selectedSubmission.id} />
                <InfoTile label="Blob pointer" value={selectedSubmission.blobId} />
              </div>

              <div className="mt-5 rounded-xl border border-[rgba(190,255,234,0.12)] bg-[#071011]/40 p-4">
                <p className="text-xs font-bold text-[#ffc46b] uppercase">Review notes</p>
                <textarea
                  rows={4}
                  placeholder="Add internal notes for this submission..."
                  className="mt-3 w-full resize-none rounded-lg border border-[rgba(190,255,234,0.16)] bg-[#0d1c1d] px-3 py-2 text-sm text-[#effff8] outline-none placeholder:text-[#9fb9b1]/55 focus:border-[#80ffd5]"
                />
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#80ffd5] px-3 py-2.5 text-sm font-bold text-[#06231d] hover:bg-[#28d8c1]"
                >
                  <KeyRound className="size-4" />
                  Decrypt sensitive fields
                </button>
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-[rgba(190,255,234,0.16)] px-3 py-2.5 text-sm font-bold hover:bg-[#80ffd5]/10"
                >
                  <CheckCircle2 className="size-4" />
                  Mark reviewed
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsReviewOpen(false)}
                className="mt-5 w-full cursor-pointer rounded-lg border border-[rgba(190,255,234,0.16)] px-3 py-2.5 text-sm font-bold text-[#9fb9b1] hover:bg-[#80ffd5]/10 hover:text-[#effff8]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isExportOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#071011]/78 px-4 py-8 backdrop-blur-md"
          aria-modal="true"
          role="dialog"
          aria-labelledby="proof-export-title"
        >
          <div className="max-h-[calc(100vh-4rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[rgba(190,255,234,0.22)] bg-[rgba(8,24,25,0.96)] p-5 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-[rgba(190,255,234,0.12)] pb-4">
              <div>
                <p className="text-xs font-bold text-[#ffc46b] uppercase">Proof exports</p>
                <h2 id="proof-export-title" className="mt-1 text-xl font-black tracking-[-0.02em]">
                  Evidence package
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsExportOpen(false)}
                className="cursor-pointer rounded-lg border border-[rgba(190,255,234,0.16)] p-2 text-[#9fb9b1] hover:bg-[#80ffd5]/10 hover:text-[#effff8]"
                aria-label="Close proof exports"
              >
                <X className="size-4" />
              </button>
            </div>

            <p className="text-sm leading-6 text-[#9fb9b1]">
              Export the currently filtered inbox as review evidence. CSV is for spreadsheet triage;
              the proof bundle is for hackathon/demo artifacts and should include Walrus blob IDs,
              Sui metadata pointers, review status, and storage health.
            </p>

            <div className="mt-5 grid gap-3">
              <button
                type="button"
                className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[rgba(190,255,234,0.16)] bg-[#071011]/40 p-4 text-left hover:bg-[#80ffd5]/10"
              >
                <span className="flex min-w-0 items-start gap-3">
                  <FileText className="mt-0.5 size-5 shrink-0 text-[#80ffd5]" />
                  <span>
                    <span className="block text-sm font-bold">CSV for spreadsheet review</span>
                    <span className="mt-1 block text-xs leading-5 text-[#9fb9b1]">
                      Export filtered submissions with status, priority, encrypted markers,
                      attachments, and review metadata.
                    </span>
                  </span>
                </span>
                <Download className="size-4 shrink-0 text-[#9fb9b1]" />
              </button>

              <button
                type="button"
                className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[rgba(190,255,234,0.16)] bg-[#071011]/40 p-4 text-left hover:bg-[#80ffd5]/10"
              >
                <span className="flex min-w-0 items-start gap-3">
                  <Star className="mt-0.5 size-5 shrink-0 text-[#ffc46b]" />
                  <span>
                    <span className="block text-sm font-bold">Hackathon proof bundle</span>
                    <span className="mt-1 block text-xs leading-5 text-[#9fb9b1]">
                      Package demo evidence with Walrus blob pointers, Sui review metadata, storage
                      expiry state, and selected submission summaries.
                    </span>
                  </span>
                </span>
                <Download className="size-4 shrink-0 text-[#9fb9b1]" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsExportOpen(false)}
              className="mt-5 w-full cursor-pointer rounded-lg border border-[rgba(190,255,234,0.16)] px-3 py-2.5 text-sm font-bold text-[#9fb9b1] hover:bg-[#80ffd5]/10 hover:text-[#effff8]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({
  label,
  value,
  detail,
  icon,
  warning = false,
}: {
  label: string
  value: string
  detail: string
  icon: ReactNode
  warning?: boolean
}) {
  return (
    <article className="rounded-2xl border border-[rgba(190,255,234,0.16)] bg-[rgba(8,24,25,0.82)] p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-bold text-[#9fb9b1] uppercase">{label}</span>
        <span className={warning ? 'text-[#ffc46b]' : 'text-[#80ffd5]'}>{icon}</span>
      </div>
      <strong className="block text-3xl font-black tracking-[-0.03em]">{value}</strong>
      <span className="mt-1 block text-sm text-[#9fb9b1]">{detail}</span>
    </article>
  )
}

function Badge({
  children,
  tone,
}: {
  children: ReactNode
  tone: 'mint' | 'amber' | 'seal' | 'walrus' | 'muted'
}) {
  const toneClass = {
    mint: 'border-[#80ffd5]/30 bg-[#80ffd5]/10 text-[#80ffd5]',
    amber: 'border-[#ffc46b]/30 bg-[#ffc46b]/10 text-[#ffc46b]',
    seal: 'border-[#c6d8ff]/30 bg-[#c6d8ff]/10 text-[#c6d8ff]',
    walrus: 'border-[#fbffea]/30 bg-[#fbffea]/10 text-[#fbffea]',
    muted: 'border-[rgba(190,255,234,0.16)] bg-[#071011]/40 text-[#9fb9b1]',
  }[tone]

  return (
    <span
      className={`inline-flex rounded-full border px-2 py-1 text-[11px] font-bold ${toneClass}`}
    >
      {children}
    </span>
  )
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[rgba(190,255,234,0.12)] bg-[#071011]/40 p-3">
      <span className="block text-[11px] font-bold text-[#9fb9b1] uppercase">{label}</span>
      <strong className="mt-1 block truncate text-sm">{value}</strong>
    </div>
  )
}
