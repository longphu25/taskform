import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LandingPage } from './LandingPage'
import '../../styles/landing.css'
import './landing-motion'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LandingPage />
  </StrictMode>,
)
