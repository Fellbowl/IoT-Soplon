import { Link } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';

export default function Navbar() {
  const { user, isSignedIn } = useUser();
  const clerk = useClerk();

  const handleSignOut = async () => {
    await clerk.signOut();
  };

  const firstName = user?.firstName || user?.fullName || 'Member';

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-semibold tracking-tight text-slate-900">
          IoT Soplon
        </Link>

        <nav className="flex items-center gap-4">
          <Link className="text-sm font-medium text-slate-600 transition hover:text-slate-900" to="/">
            Home
          </Link>
          <Link className="text-sm font-medium text-slate-600 transition hover:text-slate-900" to="/dashboard">
            Dashboard
          </Link>
          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                Hi, {firstName}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/sign-in"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                Log in
              </Link>
              <Link
                to="/sign-up"
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Get started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
