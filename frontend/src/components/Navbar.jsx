import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.75rem 2rem', borderBottom: '1px solid #e5e7eb',
      backgroundColor: '#ffffff'
    }}>
      <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none', color: '#111' }}>
        Soplón
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <SignedOut>
          <Link to="/sign-in" style={{ textDecoration: 'none', color: '#374151' }}>Iniciar sesión</Link>
          <Link to="/sign-up" style={{ textDecoration: 'none', color: '#374151' }}>Registrarse</Link>
        </SignedOut>
        <SignedIn>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: '#374151' }}>Dashboard</Link>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  )
}