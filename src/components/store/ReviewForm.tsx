'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitReview } from '@/app/(public)/store/actions';
import { AlertCircle, CheckCircle, Loader2, Star } from 'lucide-react';
import Link from 'next/link';

type FormState = { error?: string; message?: string } | null;

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
        'Submit Review'
      )}
    </button>
  );
}

// Star Rating Component
function StarRating({ rating, setRating }: { rating: number, setRating: (r: number) => void }) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => setRating(star)}
          className="text-gray-300 transition-colors"
        >
          <Star
            className={`w-8 h-8 ${
              (hoverRating || rating) >= star
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
      <input type="hidden" name="rating" value={rating} />
    </div>
  );
}

export default function ReviewForm({
  productId,
  productSlug,
  isLoggedIn,
}: {
  productId: string;
  productSlug: string;
  isLoggedIn: boolean;
}) {
  const [state, formAction] = useActionState(submitReview, null);
  const formRef = useRef<HTMLFormElement>(null);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    // Reset the form after a successful submission
    if (state?.message && !state.error) {
      formRef.current?.reset();
      setRating(0);
    }
  }, [state]);

  if (!isLoggedIn) {
    return (
      <div className="text-center text-brand-600 bg-brand-50 p-6 rounded-lg">
        You must be{' '}
        <Link href={`/auth?redirect=/store/${productSlug}`} className="font-semibold text-brand-700 underline">
          logged in
        </Link>{' '}
        to leave a review.
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="productSlug" value={productSlug} />

      <div>
        <label className="block text-lg font-semibold text-brand-800 mb-2">
          Your Rating
        </label>
        <StarRating rating={rating} setRating={setRating} />
      </div>

      <div>
        <label htmlFor="content" className="block text-lg font-semibold text-brand-800 mb-2">
          Your Review (Optional)
        </label>
        <textarea
          id="content"
          name="content"
          rows={5}
          className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
          placeholder="Share your thoughts on the product..."
        ></textarea>
      </div>
      
      <div className="flex items-center justify-between">
        <SubmitButton />
        
        {state?.message && (
          <div className={`flex items-center gap-2 text-sm ${
            state.error ? 'text-red-700' : 'text-green-700'
          }`}>
            {state.error ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span>{state.message}</span>
          </div>
        )}
      </div>
    </form>
  );
}