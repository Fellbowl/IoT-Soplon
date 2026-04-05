import { SignIn } from '@clerk/clerk-react';

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-78px)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in to view your IoT dashboard and sensor history.</p>
        <div className="mt-8">
          <SignIn path="/sign-in" routing="path" />
        </div>
      </div>
    </div>
  );
}
