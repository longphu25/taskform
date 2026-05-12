import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CreateFormPage } from './CreateFormPage'
import '../../styles/create-form.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CreateFormPage />
  </StrictMode>,
)
