import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { GoogleOAuthProvider } from '@react-oauth/google'

import './index.css'
import './styles/vendor.css'
import './styles/main.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <HelmetProvider>

      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      >

        <App />

      </GoogleOAuthProvider>

    </HelmetProvider>

  </StrictMode>,
)