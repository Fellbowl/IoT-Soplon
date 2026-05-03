import { useAuth } from '@clerk/clerk-react'
import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth()
  const location = useLocation()

  if (!isLoaded) return null
  if (!isSignedIn) return <Navigate to="/sign-in" replace state={{ from: location }} />

  return children
}