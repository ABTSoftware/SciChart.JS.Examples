import { registerSW } from 'virtual:pwa-register'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <App />,
)
