import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PublicFormPage } from './PublicFormPage'
import '../../styles/form.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PublicFormPage />
  </StrictMode>,
)
