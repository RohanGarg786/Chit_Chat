import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast'
import { GlobalStateProvider } from './components/ContextApi/GlobalStateProvide.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <GlobalStateProvider>
   <Toaster/>
   <App />
   </GlobalStateProvider>
  </StrictMode>,
)
