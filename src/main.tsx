import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import './styles/nonHome2026.css'

const ensureAppFavicon = () => {
  const href = '/abd-favicon.svg?v=20260311b'
  const links = document.querySelectorAll("link[rel~='icon']")

  if (links.length === 0) {
    const link = document.createElement('link')
    link.rel = 'icon'
    link.type = 'image/svg+xml'
    link.href = href
    document.head.appendChild(link)
    return
  }

  links.forEach((link) => {
    link.setAttribute('href', href)
  })
}

ensureAppFavicon()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
