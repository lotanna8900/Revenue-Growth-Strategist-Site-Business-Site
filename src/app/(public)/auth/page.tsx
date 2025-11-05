'use client';

import { useState, useActionState, useEffect, useRef, Suspense } from 'react';
import { useFormStatus } from 'react-dom';
import { loginUser, signupUser } from './actions';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; 

type FormState = { message: string; isError: boolean } | null;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-4 py-3 text-white bg-brand-600 rounded-lg font-semibold hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending && <Loader2 className="w-5 h-5 animate-spin" />}
      {label}
    </button>
  );
}

function FormMessage({ state }: { state: FormState }) {
  if (!state?.message) return null;
  
  return (
    <div className={`flex items-center gap-3 text-sm p-4 rounded-lg ${
      state.isError 
        ? 'bg-red-100 text-red-700' 
        : 'bg-green-100 text-green-700'
    }`}>
      {state.isError 
        ? <AlertCircle className="w-5 h-5" /> 
        : <CheckCircle className="w-5 h-5" />
      }
      <span>{state.message}</span>
    </div>
  );
}

// 2. Wrap the main component in Suspense to read searchParams
function AuthForm() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  
  const [loginState, loginAction] = useActionState(loginUser, null);
  const [signupState, signupAction] = useActionState(signupUser, null);
  
  const loginFormRef = useRef<HTMLFormElement>(null);
  const signupFormRef = useRef<HTMLFormElement>(null);

  // 3. Read the 'redirect' param from the URL
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  useEffect(() => {
    if (signupState?.message && !signupState.isError) {
      signupFormRef.current?.reset();
    }
  }, [signupState]);

  return (
    <div className="glass-card p-8 shadow-2xl animate-slide-up">
      {/* Tabs */}
      <div className="flex mb-6 border-b border-brand-200">
        <button
          onClick={() => setTab('login')}
          className={`flex-1 py-3 font-semibold text-center ${
            tab === 'login' 
              ? 'text-brand-700 border-b-2 border-brand-700' 
              : 'text-brand-400'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setTab('signup')}
          className={`flex-1 py-3 font-semibold text-center ${
            tab === 'signup' 
              ? 'text-brand-700 border-b-2 border-brand-700' 
              : 'text-brand-400'
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Sign In Form */}
      <div className={tab === 'login' ? 'block' : 'hidden'}>
        <form ref={loginFormRef} action={loginAction} className="space-y-6">
          {/* 4. Add the hidden input field */}
          <input type="hidden" name="redirect" value={redirectUrl || '/account'} />

          <FormMessage state={loginState} />
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-brand-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="login-email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-brand-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="login-password"
              name="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
          </div>
          <SubmitButton label="Sign In" />
        </form>
      </div>

      {/* Sign Up Form */}
      <div className={tab === 'signup' ? 'block' : 'hidden'}>
        <form ref={signupFormRef} action={signupAction} className="space-y-6">
          <FormMessage state={signupState} />
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-brand-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
          </div>
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-brand-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="signup-email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
          </div>
          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-brand-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="signup-password"
              name="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
          </div>
          <SubmitButton label="Create Account" />
        </form>
      </div>
    </div>
  );
}

// 5. Export the main page, wrapping the form in Suspense
export default function AuthPage() {
  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="text-3xl font-bold text-brand-800">
            Success Driven Amaka
          </Link>
        </div>
        <Suspense fallback={<Loader2 className="w-8 h-8 mx-auto animate-spin" />}>
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
}