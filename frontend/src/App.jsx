// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Proyecto from './pages/Proyecto.jsx' // <-- 1. Importación agregada
import Dashboard from './pages/Dashboard.jsx'
import SignInPage from './pages/SignInPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* <-- 2. Ruta agregada para que funcione el Navbar */}
        <Route path="/proyecto" element={<Proyecto />} /> 
        
        {/* IMPORTANTE: El /* permite que Clerk maneje sus sub-rutas internas */}
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return <AppRoutes />
}
