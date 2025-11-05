'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { submitContactForm } from './actions';
import { AlertCircle, CheckCircle, Loader2, Mail, Linkedin, Instagram, Twitter } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/TikTokIcon';
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
          Sending...
        </>
      ) : (
        'Send Message'
      )}
    </button>
  );
}

export default function ContactPage() {
  const [state, formAction] = useActionState(submitContactForm, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Reset the form after a successful submission
    if (state?.message && !state.isError) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="min-h-screen bg-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-brand-900 mb-4">
            Get In Touch
          </h1>
          <p className="text-xl md:text-2xl text-brand-600 max-w-2xl mx-auto">
            Have a question, a proposal, or just want to say hello?
            Go ahead.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Form */}
          <div className="lg:col-span-2 glass-card p-8 md:p-10">
            <form ref={formRef} action={formAction} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-brand-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-brand-700 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-brand-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-brand-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={8}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
                ></textarea>
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

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="glass-card p-8">
              <Mail className="w-10 h-10 text-brand-600 mb-4" />
              <h3 className="text-2xl font-semibold text-brand-900 mb-2">Email</h3>
              <p className="text-brand-700 mb-3">
                The best way to reach me for proposals or consultations.
              </p>
              <a 
                href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'chiamaka@successdrivenamaka.com.ng'}`} 
                className="font-semibold text-brand-600 hover:text-brand-900"
              >
                {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'chiamaka@successdrivenamaka.com.ng'}
              </a>
            </div>

            <div className="glass-card p-8">
              <h3 className="text-2xl font-semibold text-brand-900 mb-4">
                Follow Me
              </h3>
              <div className="flex gap-4">
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-brand-100 hover:bg-brand-200 flex items-center justify-center transition-all">
                  <Linkedin className="w-6 h-6 text-brand-700" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-brand-100 hover:bg-brand-200 flex items-center justify-center transition-all">
                  <Instagram className="w-6 h-6 text-brand-700" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-brand-100 hover:bg-brand-200 flex items-center justify-center transition-all">
                  <Twitter className="w-6 h-6 text-brand-700" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-brand-100 hover:bg-brand-200 flex items-center justify-center transition-all">
                  <TikTokIcon className="w-6 h-6 text-brand-700" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}