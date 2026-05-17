import type { FormCategory, FormField, StoragePolicy, SponsorSettings } from '../../../types/form'

const DRAFT_KEY = 'taskform:create-form:draft'

export interface DraftState {
  title: string
  description: string
  category: FormCategory
  submitButtonText: string
  fields: FormField[]
  storagePolicy: StoragePolicy
  sponsorSettings: SponsorSettings
  savedAt: number
}

export function saveDraft(draft: DraftState) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  } catch {
    // quota exceeded or private mode — silently ignore
  }
}

export function loadDraft(): DraftState | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as DraftState
  } catch {
    return null
  }
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY)
}
