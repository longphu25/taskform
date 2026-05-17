import { nanoid } from 'nanoid'
import type { FormField, FormCategory } from '../../../types/form'

export interface FormTemplate {
  id: string
  name: string
  description: string
  rail: 'walrus' | 'bug' | 'feature' | 'survey' | 'application' | 'general'
  category: FormCategory
  title: string
  formDescription: string
  createFields: () => FormField[]
}

export const formTemplates: FormTemplate[] = [
  {
    id: 'walrus-builder-feedback',
    name: 'Walrus Builder Feedback',
    description: 'Collect build experience, blockers, and proof attachments.',
    rail: 'walrus',
    category: 'feedback',
    title: 'Walrus Builder Feedback',
    formDescription:
      'Share what you built on Walrus, what worked well, and where the developer experience can improve.',
    createFields: () => [
      shortText('Project or team name', 'TaskForm, demo app, SDK tool...'),
      richText('What did you build?', 'Describe the workflow, feature, or proof you shipped.'),
      dropdown('Build stage', 'Choose current stage', ['Prototype', 'Testnet demo', 'Production']),
      starRating('Walrus developer experience'),
      richText('Biggest blocker', 'Describe the most confusing or slow part of the build.'),
      screenshot('Screenshot or proof'),
      url('Repository or demo link'),
      confirmation('I can be contacted for follow-up', false),
    ],
  },
  {
    id: 'bug-report',
    name: 'Bug Report',
    description: 'Reproduction steps, severity, media, and environment.',
    rail: 'bug',
    category: 'bug-report',
    title: 'Bug Report',
    formDescription:
      'Report a product issue with enough detail for the team to reproduce, prioritize, and verify the fix.',
    createFields: () => [
      shortText('Bug title', 'Short summary of the issue'),
      dropdown('Severity', 'Select severity', ['Critical', 'High', 'Medium', 'Low']),
      richText('Steps to reproduce', 'List each step and the expected result.'),
      richText('Actual result', 'What happened instead?'),
      shortText('Environment', 'Browser, OS, wallet, network...'),
      screenshot('Screenshot'),
      video('Screen recording'),
      confirmation('This report does not include private keys or seed phrases'),
    ],
  },
  {
    id: 'feature-request',
    name: 'Feature Request',
    description: 'Use case, priority, value, and supporting links.',
    rail: 'feature',
    category: 'feature-request',
    title: 'Feature Request',
    formDescription:
      'Suggest a feature and explain the workflow, priority, and user value behind it.',
    createFields: () => [
      shortText('Feature title', 'Short name for the request'),
      richText('User problem', 'What workflow or pain point should this solve?'),
      richText('Proposed solution', 'Describe the behavior you expect.'),
      dropdown('Priority', 'Choose priority', ['Critical', 'High', 'Medium', 'Low']),
      dropdown('Feedback type', 'Choose type', ['UX', 'API', 'Storage', 'Encryption', 'Dashboard']),
      url('Reference link'),
      confirmation('I am available to validate the solution', false),
    ],
  },
  {
    id: 'user-survey',
    name: 'User Survey',
    description: 'Lightweight satisfaction and qualitative feedback.',
    rail: 'survey',
    category: 'survey',
    title: 'Product Feedback Survey',
    formDescription:
      'Help us understand how the product feels, what is useful, and what should improve next.',
    createFields: () => [
      starRating('Overall satisfaction'),
      dropdown('Primary role', 'Select role', [
        'Developer',
        'Founder',
        'Designer',
        'Investor',
        'Other',
      ]),
      checkbox('What did you use?', [
        'Form builder',
        'Public form',
        'Dashboard',
        'Walrus storage',
        'Seal encryption',
      ]),
      richText('What worked well?', 'Share the strongest part of the experience.'),
      richText('What should improve?', 'Share the biggest opportunity.'),
      shortText('Contact email or wallet', 'Optional'),
    ],
  },
  {
    id: 'application-form',
    name: 'Application Form',
    description: 'Collect applicant details, motivation, and portfolio.',
    rail: 'application',
    category: 'application',
    title: 'Application Form',
    formDescription:
      'Submit your application with relevant background, motivation, and supporting materials.',
    createFields: () => [
      shortText('Full name', 'Your full name'),
      shortText('Email or wallet address', 'How we can reach you'),
      richText('Background', 'Describe your relevant experience or skills.'),
      richText('Motivation', 'Why are you applying? What excites you about this?'),
      url('Portfolio or GitHub link'),
      screenshot('Resume or supporting document'),
      confirmation('I confirm the information above is accurate'),
    ],
  },
  {
    id: 'general-feedback',
    name: 'General Feedback',
    description: 'Open-ended feedback for any topic or product area.',
    rail: 'general',
    category: 'general',
    title: 'General Feedback',
    formDescription:
      'Share your thoughts, suggestions, or concerns about any aspect of the product.',
    createFields: () => [
      shortText('Subject', 'Brief topic of your feedback'),
      dropdown('Area', 'Which area does this relate to?', [
        'Product',
        'Documentation',
        'Community',
        'Support',
        'Other',
      ]),
      richText('Your feedback', 'Share as much detail as you like.'),
      starRating('Overall experience'),
      shortText('Contact (optional)', 'Email or wallet if you want a reply'),
    ],
  },
]

function shortText(label: string, placeholder: string, sensitive = false): FormField {
  return {
    id: nanoid(),
    type: 'short-text',
    label,
    placeholder,
    required: false,
    sensitive,
  }
}

function richText(label: string, placeholder: string, sensitive = false): FormField {
  return {
    id: nanoid(),
    type: 'rich-text',
    label,
    placeholder,
    required: true,
    sensitive,
  }
}

function dropdown(label: string, placeholder: string, options: string[]): FormField {
  return {
    id: nanoid(),
    type: 'dropdown',
    label,
    placeholder,
    required: true,
    sensitive: false,
    options: options.map((option) => ({
      label: option,
      value: option.toLowerCase().replace(/\s+/g, '-'),
    })),
  }
}

function checkbox(label: string, options: string[]): FormField {
  return {
    id: nanoid(),
    type: 'checkbox',
    label,
    required: false,
    sensitive: false,
    options: options.map((option) => ({
      label: option,
      value: option.toLowerCase().replace(/\s+/g, '-'),
    })),
  }
}

function starRating(label: string): FormField {
  return {
    id: nanoid(),
    type: 'star-rating',
    label,
    required: true,
    sensitive: false,
  }
}

function screenshot(label: string): FormField {
  return {
    id: nanoid(),
    type: 'screenshot-upload',
    label,
    required: false,
    sensitive: false,
    uploadSettings: { maxSizeMB: 10, allowedTypes: ['image/png', 'image/jpeg', 'image/webp'] },
  }
}

function video(label: string): FormField {
  return {
    id: nanoid(),
    type: 'video-upload',
    label,
    required: false,
    sensitive: false,
    uploadSettings: { maxSizeMB: 50, allowedTypes: ['video/mp4', 'video/webm'] },
  }
}

function url(label: string): FormField {
  return {
    id: nanoid(),
    type: 'url',
    label,
    placeholder: 'https://...',
    required: false,
    sensitive: false,
  }
}

function confirmation(label: string, required = true): FormField {
  return {
    id: nanoid(),
    type: 'confirmation',
    label,
    required,
    sensitive: false,
  }
}
