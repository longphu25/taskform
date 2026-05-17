/**
 * TaskForm core types
 */

export type FieldType =
  | 'short-text'
  | 'rich-text'
  | 'dropdown'
  | 'checkbox'
  | 'star-rating'
  | 'screenshot-upload'
  | 'video-upload'
  | 'url'
  | 'confirmation'

export interface FieldOption {
  label: string
  value: string
}

export interface UploadSettings {
  maxSizeMB: number
  allowedTypes: string[]
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  sensitive: boolean
  options?: FieldOption[]
  uploadSettings?: UploadSettings
}

export interface StoragePolicy {
  /** Number of Walrus epochs */
  schemaDuration: number
  submissionDuration: number
  screenshotDuration: number
  videoDuration: number
}

export interface SponsorSettings {
  enabled: boolean
  budgetSUI: number
  maxSponsored: number
  maxFileSizeMB: number
}

export type FormCategory =
  | 'feedback'
  | 'bug-report'
  | 'feature-request'
  | 'survey'
  | 'application'
  | 'general'

export interface FormSchema {
  id: string
  title: string
  description: string
  category?: FormCategory
  submitButtonText?: string
  fields: FormField[]
  storagePolicy: StoragePolicy
  sponsor: SponsorSettings
  createdAt: number
  creatorAddress: string
}

export type SubmissionStatus = 'new' | 'in-review' | 'accepted' | 'rejected' | 'archived'
export type SubmissionPriority = 'low' | 'medium' | 'high' | 'critical'

export interface SubmissionFieldValue {
  fieldId: string
  value: string | string[] | number | boolean
  encrypted: boolean
}

export interface SubmissionData {
  formId: string
  fields: SubmissionFieldValue[]
  submittedAt: number
  submitterAddress?: string
}

export interface SubmissionMeta {
  id: string
  formId: string
  blobId: string
  status: SubmissionStatus
  priority: SubmissionPriority
  submittedAt: number
  expiryEpoch: number
}

export type StorageHealth = 'active' | 'expiring-soon' | 'expired' | 'unknown'
