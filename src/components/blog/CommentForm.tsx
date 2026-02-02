'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { submitComment } from '@/app/(public)/blog/actions';
import { Send, AlertCircle, CheckCircle2, User, Mail, Loader2 } from 'lucide-react';

type FormState = {
  message: string;
  isError: boolean;
} | null;

type CommentFormProps = {
  postId: string;
  isUserLoggedIn: boolean;
};

// Submit Button Component (uses useFormStatus)
function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary inline-flex items-center gap-2 text-base group disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Posting...
        </>
      ) : (
        <>
          <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          Post Comment
        </>
      )}
    </button>
  );
}

export default function CommentForm({ postId, isUserLoggedIn }: CommentFormProps) {
  const [state, formAction] = useActionState(submitComment, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Reset form on successful submission
  useEffect(() => {
    if (state?.message && !state.isError) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div>
      {/* Form Title */}
      <h3 className="text-xl font-bold text-brand-900 mb-6">
        {isUserLoggedIn ? 'Leave a Comment' : 'Join the Conversation'}
      </h3>

      {/* Status Message */}
      {state?.message && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-start gap-3 animate-slide-down ${
            state.isError
              ? 'bg-red-50 border border-red-200 text-red-800'
              : 'bg-green-50 border border-green-200 text-green-800'
          }`}
        >
          {state.isError ? (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-semibold mb-1">
              {state.isError ? 'Oops! Something went wrong' : 'Success!'}
            </p>
            <p className="text-sm">{state.message}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form ref={formRef} action={formAction} className="space-y-6">
        <input type="hidden" name="post_id" value={postId} />

        {/* Guest Fields (only if not logged in) */}
        {!isUserLoggedIn && (
          <div className="grid md:grid-cols-2 gap-6 p-6 bg-brand-50 rounded-xl border border-brand-200">
            <div className="space-y-2">
              <label htmlFor="guest_name" className="block text-sm font-semibold text-brand-900">
                Your Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                <input
                  id="guest_name"
                  name="guest_name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 border-2 border-brand-200 rounded-xl focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition-all outline-none text-brand-900 placeholder:text-brand-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="guest_email" className="block text-sm font-semibold text-brand-900">
                Your Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                <input
                  id="guest_email"
                  name="guest_email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="w-full pl-12 pr-4 py-3 border-2 border-brand-200 rounded-xl focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition-all outline-none text-brand-900 placeholder:text-brand-400"
                />
              </div>
            </div>

            <p className="md:col-span-2 text-sm text-brand-600">
              💡 Your email will not be published or shared with third parties.
            </p>
          </div>
        )}

        {/* Comment Content */}
        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-semibold text-brand-900">
            Your Comment <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            rows={6}
            required
            placeholder="Share your thoughts, ask questions, or contribute to the discussion..."
            className="w-full px-4 py-3 border-2 border-brand-200 rounded-xl focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition-all outline-none text-brand-900 placeholder:text-brand-400 resize-none"
          />
          <p className="text-sm text-brand-500">
            Be respectful and constructive. All comments are moderated before publication.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4 border-t border-brand-200">
          <p className="text-sm text-brand-600">
            {isUserLoggedIn ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Posting as registered user
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-brand-500" />
                Posting as guest
              </span>
            )}
          </p>

          <SubmitButton />
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-8 p-6 bg-gradient-to-br from-brand-600/10 to-brand-700/10 rounded-xl border border-brand-200">
        <h4 className="font-bold text-brand-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-brand-600" />
          Comment Guidelines
        </h4>
        <ul className="space-y-2 text-sm text-brand-700">
          <li className="flex items-start gap-2">
            <span className="text-brand-600 mt-1">•</span>
            <span>All comments are reviewed before being published</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-600 mt-1">•</span>
            <span>Be respectful and constructive in your feedback</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-600 mt-1">•</span>
            <span>Spam, promotional, or offensive comments will not be approved</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-600 mt-1">•</span>
            <span>Your email address will remain private</span>
          </li>
        </ul>
      </div>
    </div>
  );
}