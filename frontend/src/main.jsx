import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { LoadingProvider } from './context/LoadingContext'
import router from './routes/index'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadingProvider>
      <RouterProvider router={router} />
    </LoadingProvider>
  </StrictMode>,
)

