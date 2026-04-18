import { Link, useLocation } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';

export default function Navbar() {
  const { user, isSignedIn } = useUser();
  const clerk = useClerk();
  const location = useLocation(); // Para saber en qué página estamos

  const handleSignOut = async () => {
    await clerk.signOut();
  };

  const firstName = user?.firstName || user?.fullName || 'Deportista';

  // Función auxiliar para saber si un link está activo
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3">
        
        {/* LOGO Y MARCA */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src="/Logo SOPLON.png" 
            alt="Logo Soplón" 
            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
          />
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
            SOPLÓN
          </span>
        </Link>

        {/* ENLACES DE NAVEGACIÓN */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`text-sm font-bold transition-all relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:bg-sky-500 after:transition-all ${
              isActive('/') ? 'text-sky-600 after:w-full' : 'text-slate-600 hover:text-sky-500 after:w-0 hover:after:w-full'
            }`}
          >
            Inicio
          </Link>
          <Link 
            to="/proyecto" 
            className={`text-sm font-bold transition-all relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:bg-sky-500 after:transition-all ${
              isActive('/proyecto') ? 'text-sky-600 after:w-full' : 'text-slate-600 hover:text-sky-500 after:w-0 hover:after:w-full'
            }`}
          >
            Proyecto
          </Link>
          <Link 
            to="/dashboard" 
            className={`text-sm font-bold transition-all relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:bg-sky-500 after:transition-all ${
              isActive('/dashboard') ? 'text-sky-600 after:w-full' : 'text-slate-600 hover:text-sky-500 after:w-0 hover:after:w-full'
            }`}
          >
            Dashboard
          </Link>
        </nav>

        {/* ÁREA DE AUTENTICACIÓN / USUARIO */}
        <div className="flex items-center">
          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-sky-50 border border-sky-100 px-3 py-1.5 text-sm font-semibold text-sky-700 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Hola, {firstName}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/sign-in"
                className="text-sm font-bold text-slate-600 transition-colors hover:text-sky-600"
              >
                Ingresar
              </Link>
              <Link
                to="/sign-up"
                className="rounded-full bg-sky-500 px-6 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_0_rgba(14,165,233,0.39)] transition-all hover:bg-sky-400 hover:shadow-[0_6px_20px_rgba(14,165,233,0.23)] hover:-translate-y-0.5 active:scale-95"
              >
                Comenzar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
