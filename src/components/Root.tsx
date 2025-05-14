import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import "../tailwind.css"
import { getTheme } from '../utils/utils.ts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

getTheme()
export const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
