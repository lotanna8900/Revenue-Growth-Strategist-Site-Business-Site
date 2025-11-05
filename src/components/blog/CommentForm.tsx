'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { submitComment } from '@/app/blog/actions';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

type FormState = { message: string; isError: boolean } | null;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Submitting...
        </>
      ) : (
        'Submit Comment'
      )}
    </button>
  );
}

export default function CommentForm({
  postId,
  isUserLoggedIn,
}: {
  postId: string;
  isUserLoggedIn: boolean;
}) {
  const [state, formAction] = useActionState(submitComment, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Reset the form after a successful submission
    if (state?.message && !state.isError) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="post_id" value={postId} />
      
      {/* Guest fields - only show if NOT logged in */}
      {!isUserLoggedIn && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="guest_name" className="block text-sm font-medium text-brand-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="guest_name"
              name="guest_name"
              required
              className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
          </div>
          <div>
            <label htmlFor="guest_email" className="block text-sm font-medium text-brand-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="guest_email"
              name="guest_email"
              required
              className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
          </div>
        </div>
      )}

      {/* Comment content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-brand-700 mb-1">
          Your Comment
        </label>
        <textarea
          id="content"
          name="content"
          rows={5}
          required
          className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
          placeholder={isUserLoggedIn ? "Leave a comment..." : "Leave a comment... (your name & email are required)"}
        ></textarea>
      </div>
      
      <div className="flex items-center justify-between">
        <SubmitButton />
        
        {/* Form state message */}
        {state?.message && (
          <div className={`flex items-center gap-2 text-sm ${
            state.isError ? 'text-red-700' : 'text-green-700'
          }`}>
            {state.isError ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span>{state.message}</span>
          </div>
        )}
      </div>
    </form>
  );
}