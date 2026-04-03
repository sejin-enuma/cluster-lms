import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.tsx'

async function enableMocking() {
  // In development with mock server running, skip MSW
  // In production (GitHub Pages) or dev without mock server, use MSW
  if (import.meta.env.DEV && !import.meta.env.VITE_USE_MSW) {
    return
  }

  const { worker } = await import('./mocks/browser')
  return worker.start({
    serviceWorker: {
      url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
    },
    onUnhandledRequest: 'bypass',
  })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
