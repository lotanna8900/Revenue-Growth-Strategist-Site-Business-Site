'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { createCheckoutSession } from '@/app/(public)/store/actions';
import { AlertCircle, Loader2, Info } from 'lucide-react';

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
          Processing...
        </>
      ) : (
        'Confirm & Pay'
      )}
    </button>
  );
}

export default function CheckoutForm({ product }: { product: any }) {
  const [state, formAction] = useActionState(createCheckoutSession, null);

  useEffect(() => {
    if (state?.authorization_url) {
      window.location.href = state.authorization_url;
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="productId" value={product.id} />
      
      <h2 className="text-2xl font-semibold text-brand-800">
        {product.is_digital ? 'Customer Information' : 'Shipping Information'}
      </h2>
      
      {/* Basic Contact Info (Always Shown) */}
      <div className="space-y-4">
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
          <label htmlFor="phone" className="block text-sm font-medium text-brand-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
          />
        </div>
      </div>

      {/* Conditional Shipping Fields */}
      {!product.is_digital ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-brand-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              required
              className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-brand-700 mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-brand-700 mb-1">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                required
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Digital Product Notice */
        <div className="p-4 bg-brand-50 border border-brand-200 rounded-lg flex gap-3">
          <Info className="w-5 h-5 text-brand-600 flex-shrink-0" />
          <div className="text-sm text-brand-700">
            <strong>Digital Delivery:</strong> No shipping address required. Your course access link will be sent to your email immediately after payment.
          </div>
          {/* Hidden fields to satisfy the Server Action requirements */}
          <input type="hidden" name="address" value="Digital" />
          <input type="hidden" name="city" value="Digital" />
          <input type="hidden" name="state" value="Digital" />
        </div>
      )}

      {state?.error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-100 p-3 text-sm text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>{state.error}</span>
        </div>
      )}

      <SubmitButton />
    </form>
  );
}