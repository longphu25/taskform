import { z } from 'zod'

/**
 * Zod schemas for TaskForm validation
 */

export const fieldTypeSchema = z.enum([
  'short-text',
  'rich-text',
  'dropdown',
  'checkbox',
  'star-rating',
  'screenshot-upload',
  'video-upload',
  'url',
  'confirmation',
])

export const fieldOptionSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
})

export const uploadSettingsSchema = z.object({
  maxSizeMB: z.number().min(1).max(100),
  allowedTypes: z.array(z.string()).min(1),
})

export const formFieldSchema = z.object({
  id: z.string().min(1),
  type: fieldTypeSchema,
  label: z.string().min(1).max(200),
  placeholder: z.string().max(500).optional(),
  required: z.boolean(),
  sensitive: z.boolean(),
  options: z.array(fieldOptionSchema).optional(),
  uploadSettings: uploadSettingsSchema.optional(),
})

export const storagePolicySchema = z.object({
  schemaDuration: z.number().min(1).max(100),
  submissionDuration: z.number().min(1).max(100),
  screenshotDuration: z.number().min(1).max(100),
  videoDuration: z.number().min(1).max(100),
})

export const sponsorSettingsSchema = z.object({
  enabled: z.boolean(),
  budgetSUI: z.number().min(0),
  maxSponsored: z.number().min(0),
  maxFileSizeMB: z.number().min(1).max(100),
})

export const formCategorySchema = z.enum([
  'feedback',
  'bug-report',
  'feature-request',
  'survey',
  'application',
  'general',
])

export const formSchemaValidator = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().max(2000),
  category: formCategorySchema.default('general'),
  submitButtonText: z.string().max(50).optional(),
  fields: z.array(formFieldSchema).min(1).max(50),
  storagePolicy: storagePolicySchema,
  sponsor: sponsorSettingsSchema,
  createdAt: z.number(),
  creatorAddress: z.string().min(1),
})

export const submissionFieldValueSchema = z.object({
  fieldId: z.string().min(1),
  value: z.union([z.string(), z.array(z.string()), z.number(), z.boolean()]),
  encrypted: z.boolean(),
})

export const submissionDataSchema = z.object({
  formId: z.string().min(1),
  fields: z.array(submissionFieldValueSchema).min(1),
  submittedAt: z.number(),
  submitterAddress: z.string().optional(),
})

/** Default storage policy (epochs) */
export const DEFAULT_STORAGE_POLICY = {
  schemaDuration: 26,
  submissionDuration: 13,
  screenshotDuration: 13,
  videoDuration: 4,
} as const

/** Default sponsor settings */
export const DEFAULT_SPONSOR_SETTINGS = {
  enabled: false,
  budgetSUI: 0,
  maxSponsored: 0,
  maxFileSizeMB: 10,
} as const
