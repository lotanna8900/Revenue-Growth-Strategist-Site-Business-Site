'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyPayment } from '@/app/(public)/store/actions';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) {
      setStatus('error');
      setError('No payment reference found.');
      return;
    }

    const verify = async () => {
      const result = await verifyPayment(reference);
      if (result.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setError(result.error || 'An unknown error occurred.');
      }
    };

    verify();
  }, [reference]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <Loader2 className="w-16 h-16 animate-spin text-brand-600 mb-6" />
        <h1 className="text-3xl font-bold text-brand-900 mb-2">
          Verifying Your Payment...
        </h1>
        <p className="text-brand-600">Please do not close this page.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-16 h-16 text-red-600 mb-6" />
        <h1 className="text-3xl font-bold text-red-700 mb-2">
          Payment Failed
        </h1>
        <p className="text-brand-600 mb-4">
          There was an error processing your payment.
        </p>
        <p className="text-sm text-brand-500 mb-6">Error: {error}</p>
        <Link href="/store" className="btn-secondary">
          Back to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <CheckCircle className="w-16 h-16 text-green-600 mb-6" />
      <h1 className="text-3xl font-bold text-brand-900 mb-2">
        Thank You!
      </h1>
      <p className="text-brand-600 mb-6">
        Your order has been confirmed and your payment was successful.
      </p>
      <Link href="/store" className="btn-primary">
        Continue Shopping
      </Link>
      {/* We can add a link to "My Orders" page here later */}
    </div>
  );
}

// Main page export with Suspense
export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <div className="glass-card p-12 w-full max-w-lg">
        <Suspense fallback={<div>Loading...</div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}