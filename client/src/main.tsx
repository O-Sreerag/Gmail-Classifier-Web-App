import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

const clientId: string = import.meta.env.VITE_GOOGLE_CLIENT_ID
if (!clientId) {
  console.error('Google Client ID is not defined.');
}

createRoot(document.getElementById('root')!).render(  
  <GoogleOAuthProvider clientId={clientId}>
    <StrictMode>
      <App />
    </StrictMode>,
  </GoogleOAuthProvider >
)
