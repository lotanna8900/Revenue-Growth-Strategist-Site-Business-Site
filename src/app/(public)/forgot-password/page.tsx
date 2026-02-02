'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { requestPasswordReset } from '../auth/actions';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

type FormState = { message: string; isError: boolean } | null;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full text-lg py-3 flex items-center justify-center gap-3"
    >
      {pending ? <Loader2 className="w-6 h-6 animate-spin" /> : null}
      {pending ? 'Sending...' : 'Send Reset Link'}
    </button>
  );
}

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(requestPasswordReset, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Reset the form after a successful submission
    if (state?.message && !state.isError) {
      formRef.current?.reset();
    }
  }, [state]);

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
              Forgot Password?
            </h1>
            <p className="text-brand-600">
              No problem. Enter your email and we'll send you a reset link.
            </p>
          </div>

          <form ref={formRef} action={formAction} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
                placeholder="you@example.com"
              />
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
          
          <div className="text-center mt-6">
            <Link href="/auth" className="font-medium text-brand-600 hover:text-brand-900">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}