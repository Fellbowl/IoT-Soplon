// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { UserButton, useAuth } from '@clerk/clerk-react';

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const location = useLocation(); // Nos sirve para saber en qué página estamos

  return (
    <nav style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 50, 
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(0,0,0,0.05)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)' // Sombra flotante muy suave
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        height: '75px' 
      }}>
        
        {/* Logo */}
        <Link to="/" style={{ 
          textDecoration: 'none', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          transition: 'opacity 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <img 
            src="/Logo SOPLON.png" 
            alt="Logo SOPLÓN" 
            style={{ height: '36px', width: 'auto', objectFit: 'contain' }} 
          />
          <span style={{ 
            fontWeight: '800', 
            fontSize: '1.25rem', 
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)'
          }}>
            SOPLÓN
          </span>
        </Link>

        {/* Links & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <NavLink to="/" currentPath={location.pathname}>
            Inicio
          </NavLink>
          
          {/* NUEVO ENLACE: Visible para todos */}
          <NavLink to="/proyecto" currentPath={location.pathname}>
            Proyecto
          </NavLink>
          
          {isSignedIn ? (
            <>
              <NavLink to="/dashboard" currentPath={location.pathname}>
                Dashboard
              </NavLink>
              
              {/* Separador vertical sutil */}
              <div style={{ 
                height: '24px', 
                width: '1px', 
                backgroundColor: 'var(--border)', 
                margin: '0 -1rem' 
              }}></div>

              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <Link 
              to="/sign-in" 
              style={{ 
                backgroundColor: 'var(--text-primary)', 
                color: '#fff', 
                padding: '0.6rem 1.5rem', 
                borderRadius: '9999px', // Forma de píldora
                fontSize: '0.9rem',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.15)';
                e.currentTarget.style.backgroundColor = '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                e.currentTarget.style.backgroundColor = 'var(--text-primary)';
              }}
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

// Componente auxiliar para manejar el estilo de los links activos y efectos hover
function NavLink({ to, currentPath, children }) {
  const isActive = currentPath === to;
  
  return (
    <Link 
      to={to} 
      style={{ 
        textDecoration: 'none', 
        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', 
        fontWeight: isActive ? '700' : '600', 
        fontSize: '0.95rem',
        position: 'relative',
        transition: 'color 0.2s ease',
        padding: '0.5rem 0'
      }}
      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
      onMouseLeave={(e) => e.currentTarget.style.color = isActive ? 'var(--text-primary)' : 'var(--text-secondary)'}
    >
      {children}
      
      {/* Indicador de página activa (Un puntito verde debajo del texto) */}
      {isActive && (
        <span style={{
          position: 'absolute',
          bottom: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '5px',
          height: '5px',
          backgroundColor: 'var(--accent)', 
          borderRadius: '50%'
        }} />
      )}
    </Link>
  );
}
