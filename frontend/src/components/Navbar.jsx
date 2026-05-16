// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { UserButton, useAuth } from '@clerk/clerk-react';

export default function Navbar() {
  const { isSignedIn } = useAuth();

  return (
    <nav className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 50, width: '100%' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🚴‍♂️</span>
          <span style={{ fontWeight: '800', fontSize: '1.2rem', letterSpacing: '-0.02em' }}>SOPLÓN</span>
        </Link>

        {/* Links & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.95rem' }}>
            Inicio
          </Link>
          
          {isSignedIn ? (
            <>
              <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.95rem' }}>
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <Link to="/sign-in" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
