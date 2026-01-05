'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { subscribeToNewsletter } from './actions';
import { AlertCircle, CheckCircle, Loader2, Send } from 'lucide-react';
import Link from 'next/link';

type FormState = { message: string; isError: boolean } | null;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-3"
    >
      {pending ? (
        <>
          <Loader2 className="w-6 h-6 animate-spin" />
          Subscribing...
        </>
      ) : (
        'Subscribe Now'
      )}
    </button>
  );
}

export default function NewsletterPage() {
  const [state, formAction] = useActionState(subscribeToNewsletter, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.message && !state.isError) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo/Link back home */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-brand-800">
            Success Driven Amaka
          </Link>
        </div>

        <div className="glass-card p-8 md:p-10 shadow-2xl animate-slide-up">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center shadow-lg">
              <Send className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-brand-900 mb-2">
              Join My Newsletter
            </h1>
            <p className="text-brand-600 text-lg">
              Get exclusive insights on revenue growth, scaling and brand building delivered to your inbox every Monday.
            </p>

            <p className="text-brand-600 text-lg">
              Let's build something extraordinary.
            </p>
          </div>

          <form ref={formRef} action={formAction} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-brand-700 mb-1">
                First Name (Optional)
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
                placeholder="e.g., Amaka"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-700 mb-1">
                Email Address
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
            
            <div className="pt-2">
              <SubmitButton />
            </div>

            {state?.message && (
              <div className={`flex items-center gap-3 text-sm p-4 rounded-lg ${
                state.isError 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {state.isError ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                <span>{state.message}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}