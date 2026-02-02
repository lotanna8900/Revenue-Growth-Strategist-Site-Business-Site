import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, FileWarning } from 'lucide-react';

// Function to format price in NGN
function formatPrice(price: number | null) {
  if (!price) return 'N/A';
  return `NGN ${new Intl.NumberFormat('en-NG').format(price)}`;
}

// A reusable Product Card component for this page
function ProductCard({ product }: { product: any }) {
  // Get the primary image. For now, I'll just take the first.
  const primaryImage = product.images?.[0] || 'https://via.placeholder.com/300';
  
  return (
    <Link
      href={`/store/${product.slug}`}
      className="glass-card group flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Product Image */}
      <div className="relative w-full aspect-square overflow-hidden">
        {/* I can use Next/Image here later for optimization */}
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.sale_price && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            SALE
          </span>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-900 mb-2 truncate">
            {product.name}
          </h2>
          <p className="text-brand-600 mb-4 text-sm">
            {product.category || 'Uncategorized'}
          </p>
        </div>
        <div className="flex items-baseline gap-2">
          <p className={`font-bold text-2xl ${
            product.sale_price ? 'text-red-600' : 'text-brand-800'
          }`}>
            {formatPrice(product.sale_price || product.price)}
          </p>
          {product.sale_price && (
            <p className="text-lg text-brand-500 line-through">
              {formatPrice(product.price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default async function StorePage() {
  const supabase = await createServerSupabaseClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active') // Only show active products
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <div className="bg-brand-50 min-h-screen">
      {/* Store Header */}
      <section className="bg-gradient-to-br from-accent-rose via-brand-500 to-accent-gold text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            The Success Shop
          </h1>
          <p className="text-xl md:text-2xl text-brand-100 max-w-3xl mx-auto">
            Discover curated pieces that empower and inspire.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center text-brand-600 glass-card">
            <FileWarning className="w-16 h-16 mb-6" />
            <h2 className="text-2xl font-semibold mb-4">Store Coming Soon</h2>
            <p>New products are being added. Please check back soon!</p>
          </div>
        )}
      </section>
    </div>
  );
}