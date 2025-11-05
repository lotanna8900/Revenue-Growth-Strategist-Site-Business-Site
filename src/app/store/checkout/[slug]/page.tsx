import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CheckoutForm from '@/components/store/CheckoutForm';

// Function to format price in NGN
function formatPrice(price: number | null) {
  if (!price) return 'N/A';
  return `NGN ${new Intl.NumberFormat('en-NG').format(price)}`;
}

// Fetch the single product
async function getProduct(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data: product, error } = await supabase
    .from('products')
    .select('id, name, slug, price, sale_price, images, stock')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (error || !product) {
    notFound(); // Triggers a 404 page
  }
  return product;
}

// Main Page Component
export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const clientParams = await params;
  const { slug } = clientParams;
  
  const product = await getProduct(slug);
  const primaryImage = product.images?.[0] || 'https://via.placeholder.com/300';
  const priceToCharge = product.sale_price || product.price;
  
  return (
    <div className="bg-brand-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Simple Header */}
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-bold text-brand-800">
            Success Driven Amaka
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Order Summary (Left Side) */}
          <div className="lg:order-2">
            <div className="glass-card p-6">
              <h2 className="text-2xl font-semibold text-brand-800 border-b border-brand-200 pb-4 mb-4">
                Order Summary
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-brand-100 flex-shrink-0">
                  <img
                    src={primaryImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-brand-900">{product.name}</h3>
                  <p className="text-sm text-brand-600">Quantity: 1</p>
                </div>
                <div className="font-semibold text-brand-900">
                  {formatPrice(priceToCharge)}
                </div>
              </div>
              <div className="border-t border-brand-200 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-brand-700">
                  <span>Subtotal</span>
                  <span>{formatPrice(priceToCharge)}</span>
                </div>
                <div className="flex justify-between text-brand-700">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-brand-900">
                  <span>Total</span>
                  <span>{formatPrice(priceToCharge)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Checkout Form (Right Side) */}
          <div className="lg:order-1">
            <CheckoutForm product={product} />
          </div>

        </div>
      </div>
    </div>
  );
}