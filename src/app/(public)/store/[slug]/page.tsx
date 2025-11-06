import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ProductDetails from '@/components/store/ProductDetails';
import ReviewList from '@/components/store/ReviewList'; 
import ReviewForm from '@/components/store/ReviewForm'; 

// Fetch the single product
async function getProduct(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (error || !product) {
    notFound();
  }
  return product;
}

// Main Page Component
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const clientParams = await params;
  const { slug } = clientParams;
  
  // Fetch data on the server
  const product = await getProduct(slug);
  
  // 3. Fetch the user
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      {/* Product Details (Client Component) */}
      <ProductDetails product={product} />

      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Review Form (Left) */}
          <div className="lg:col-span-1 glass-card p-6 md:p-8 h-fit">
            <h2 className="text-3xl font-bold text-brand-900 mb-6">
              Leave a Review
            </h2>
            <ReviewForm
              productId={product.id}
              productSlug={product.slug}
              isLoggedIn={!!user}
            />
          </div>

          {/* Review List (Right) */}
          <div className="lg:col-span-2">
            <ReviewList productId={product.id} />
          </div>
          
        </div>
      </section>
    </>
  );
}