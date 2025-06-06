import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Admin from './Admin.jsx'
import CssBaseline from '@mui/material/CssBaseline'

const root = document.getElementById('root')
root.style.width='100%'

function Main(){

  const [page, setPage] = useState('client');

  return (
    <StrictMode>
      <CssBaseline />
      {page==='client'&&<App/>}
      {page==='admin'&&<Admin/>}
    </StrictMode>
  )
}

createRoot(document.getElementById('root')).render(<Main/>)


