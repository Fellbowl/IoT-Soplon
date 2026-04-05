import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SignInPage from './pages/SignInPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function AppRoutes() {
  const navigate = useNavigate();

  return (
    // For production deployment, VITE_CLERK_PUBLISHABLE_KEY should be a pk_live_... key from Clerk dashboard.
    <ClerkProvider publishableKey={clerkPublishableKey} navigate={(to) => navigate(to)}>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <main className="px-4 pb-12 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </ClerkProvider>
  );
}

export default function App() {
  if (!clerkPublishableKey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-2xl rounded-3xl border border-red-200 bg-red-50 p-10 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-red-900">Clerk publishable key is missing.</h1>
          <p className="mt-4 text-sm leading-6 text-red-700">
            Check your environment variables. VITE_CLERK_PUBLISHABLE_KEY must be configured for authentication to work.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
