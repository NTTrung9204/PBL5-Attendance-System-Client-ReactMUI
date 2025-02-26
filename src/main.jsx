import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'

const root = document.getElementById('root')
root.style.width='100%'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CssBaseline />
    <App />
  </StrictMode>,
)


