import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Star, CheckCircle } from 'lucide-react';

// Function to format the date
function formatDate(isoString: string | null) {
  if (!isoString) return 'No date';
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Reusable component to show star rating
function DisplayStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

export default async function ReviewList({ productId }: { productId: string }) {
  const supabase = await createServerSupabaseClient();
  
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select(`
      id,
      content,
      created_at,
      rating,
      is_verified_purchase,
      profiles ( full_name, email )
    `)
    .eq('product_id', productId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return <p className="text-red-600">Could not load reviews.</p>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-brand-800 border-b border-brand-200 pb-2">
        {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
      </h3>
      
      {reviews.length > 0 ? (
        reviews.map((review: any) => {
          const displayName = review.profiles?.full_name || review.profiles?.email.split('@')[0] || 'Anonymous';
          
          return (
            <div key={review.id} className="border-b border-brand-200 pb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-brand-900">{displayName}</h4>
                <DisplayStars rating={review.rating} />
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-500 mb-3">
                <span>{formatDate(review.created_at)}</span>
                {review.is_verified_purchase && (
                  <span className="flex items-center gap-1 text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Verified Purchase
                  </span>
                )}
              </div>
              <p className="text-brand-700">
                {review.content}
              </p>
            </div>
          );
        })
      ) : (
        <p className="text-brand-600">
          Be the first to leave a review!
        </p>
      )}
    </div>
  );
}