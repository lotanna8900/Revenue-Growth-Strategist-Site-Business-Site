'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updatePassword } from '../actions';
import { AlertCircle, CheckCircle, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full text-lg py-3 flex items-center justify-center gap-3"
    >
      {pending ? <Loader2 className="w-6 h-6 animate-spin" /> : null}
      {pending ? 'Updating...' : 'Update Password'}
    </button>
  );
}

export default function UpdatePasswordPage() {
  const [state, formAction] = useActionState(updatePassword, null);

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="text-3xl font-bold text-brand-800">
            Success Driven Amaka
          </Link>
        </div>

        <div className="glass-card p-8 shadow-2xl animate-slide-up">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-brand-900 mb-2">
              Set New Password
            </h1>
            <p className="text-brand-600">
              Please enter your new password below.
            </p>
          </div>

          <form action={formAction} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-brand-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  minLength={6}
                  className="w-full pl-10 px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
                  placeholder="••••••••"
                />
                <Lock className="w-5 h-5 text-brand-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-brand-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  required
                  minLength={6}
                  className="w-full pl-10 px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
                  placeholder="••••••••"
                />
                <Lock className="w-5 h-5 text-brand-400 absolute left-3 top-3.5" />
              </div>
            </div>
            
            {state?.message && (
              <div className={`flex items-center gap-3 text-sm p-3 rounded-lg ${
                state.isError 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {state.isError ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                <span>{state.message}</span>
              </div>
            )}
            
            <SubmitButton />
          </form>
        </div>
      </div>
    </div>
  );
}