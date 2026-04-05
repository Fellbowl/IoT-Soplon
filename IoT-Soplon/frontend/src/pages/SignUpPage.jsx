import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-78px)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-slate-900">Create an account</h1>
        <p className="mt-2 text-sm text-slate-600">Sign up to start visualizing your device telemetry in real time.</p>
        <div className="mt-8">
          <SignUp path="/sign-up" routing="path" />
        </div>
      </div>
    </div>
  );
}
