import type { FieldType, FormField } from '../../../types/form'
import { nanoid } from 'nanoid'
import {
  Type,
  AlignLeft,
  List,
  CheckSquare,
  Star,
  Image,
  Video,
  Link,
  CircleCheck,
} from 'lucide-react'
import type { ReactNode } from 'react'

export interface ElementConfig {
  type: FieldType
  label: string
  icon: ReactNode
  defaultField: () => FormField
}

export const formElementConfigs: ElementConfig[] = [
  {
    type: 'short-text',
    label: 'Short Text',
    icon: <Type className="size-4" />,
    defaultField: () => ({
      id: nanoid(),
      type: 'short-text',
      label: 'Short Text',
      placeholder: 'Enter text...',
      required: false,
      sensitive: false,
    }),
  },
  {
    type: 'rich-text',
    label: 'Rich Text',
    icon: <AlignLeft className="size-4" />,
    defaultField: () => ({
      id: nanoid(),
      type: 'rich-text',
      label: 'Description',
      placeholder: 'Enter detailed text...',
      required: false,
      sensitive: false,
    }),
  },
  {
    type: 'dropdown',
    label: 'Dropdown',
    icon: <List className="size-4" />,
    defaultField: () => ({
      id: nanoid(),
      type: 'dropdown',
      label: 'Select Option',
      placeholder: 'Choose...',
      required: false,
      sensitive: false,
      options: [
        { label: 'Option 1', value: 'option-1' },
        { label: 'Option 2', value: 'option-2' },
      ],
    }),
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: <CheckSquare className="size-4" />,
    defaultField: () => ({
      id: nanoid(),
      type: 'checkbox',
      label: 'Select all that apply',
      required: false,
      sensitive: false,
      options: [
        { label: 'Option A', value: 'option-a' },
        { label: 'Option B', value: 'option-b' },
      ],
    }),
  },
  {
    type: 'star-rating',
    label: 'Star Rating',
    icon: <Star className="size-4" />,
    defaultField: () => ({
      id: nanoid(),
      type: 'star-rating',
      label: 'Rating',
      required: false,
      sensitive: false,
    }),
  },
  {
    type: 'screenshot-upload',
    label: 'Screenshot',
    icon: <Image className="size-4" />,
    defaultField: () => ({
      id: nanoid(),
      type: 'screenshot-upload',
      label: 'Screenshot',
      required: false,
      sensitive: false,
      uploadSettings: { maxSizeMB: 10, allowedTypes: ['image/png', 'image/jpeg', 'image/webp'] },
    }),
  },
  {
    type: 'video-upload',
    label: 'Video',
    icon: <Video className="size-4" />,
    defaultField: () => ({
      id: nanoid(),
      type: 'video-upload',
      label: 'Video',
      required: false,
      sensitive: false,
      uploadSettings: { maxSizeMB: 50, allowedTypes: ['video/mp4', 'video/webm'] },
    }),
  },
  {
    type: 'url',
    label: 'URL',
    icon: <Link className="size-4" />,
    defaultField: () => ({
      id: nanoid(),
      type: 'url',
      label: 'URL',
      placeholder: 'https://...',
      required: false,
      sensitive: false,
    }),
  },
  {
    type: 'confirmation',
    label: 'Confirmation',
    icon: <CircleCheck className="size-4" />,
    defaultField: () => ({
      id: nanoid(),
      type: 'confirmation',
      label: 'I agree to the terms',
      required: true,
      sensitive: false,
    }),
  },
]

export const formElementMap = Object.fromEntries(
  formElementConfigs.map((c) => [c.type, c]),
) as Record<FieldType, ElementConfig>
