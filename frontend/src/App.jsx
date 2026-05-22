import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Proyecto from './pages/Proyecto.jsx'
import Dashboard from './pages/Dashboard.jsx'
import SignInPage from './pages/SignInPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin

function AppRoutes() {
  const navigate = useNavigate()

  // Clerk Dev (pk_test_) necesita navegar a URLs absolutas de clerk.accounts.dev
  // durante el dev-browser handshake. React Router ignora URLs absolutas,
  // así que las redirigimos con window.location.
  const clerkNavigate = (to) => {
    if (to.startsWith('http')) {
      window.location.href = to
    } else {
      navigate(to)
    }
  }

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      navigate={clerkNavigate}
      allowedRedirectOrigins={[APP_URL]}
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/proyecto" element={<Proyecto />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ClerkProvider>
  )
}

export default function App() {
  return <AppRoutes />
}
