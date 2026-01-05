'use client'; 

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { submitContactForm } from '@/app/(public)/contact/actions'; 
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-3"
    >
      {pending ? <><Loader2 className="w-6 h-6 animate-spin" /> Sending...</> : 'Send Message'}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.message && !state.isError) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="lg:col-span-2 glass-card p-8 md:p-10">
        <form ref={formRef} action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label htmlFor="name" className="block text-sm font-medium text-brand-700 mb-1">Your Name</label>
                 <input type="text" id="name" name="name" required className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600" />
               </div>
               <div>
                 <label htmlFor="email" className="block text-sm font-medium text-brand-700 mb-1">Your Email</label>
                 <input type="email" id="email" name="email" required className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600" />
               </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-brand-700 mb-1">Subject</label>
              <input type="text" id="subject" name="subject" required className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-brand-700 mb-1">Message</label>
              <textarea id="message" name="message" rows={8} required className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"></textarea>
            </div>
            <div className="pt-2"><SubmitButton /></div>
            
            {state?.message && (
            <div className={`flex items-center gap-3 text-sm p-4 rounded-lg ${state.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {state.isError ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                <span>{state.message}</span>
            </div>
            )}
        </form>
    </div>
  );
}