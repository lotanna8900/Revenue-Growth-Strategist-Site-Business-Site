'use client';

// Removed unused useState and Loader2 to keep code clean, but kept everything else
import Link from 'next/link';
import { ArrowLeft, CheckCircle, ShoppingCart, FileText, MonitorPlay } from 'lucide-react';

function formatPrice(price: number | null) {
  if (!price) return 'N/A';
  return `NGN ${new Intl.NumberFormat('en-NG').format(price)}`;
}

export default function ProductDetails({ product }: { product: any }) {
  const primaryImage = product.images?.[0] || 'https://via.placeholder.com/600';
  
  // Logic: Digital products are infinite stock; physical checks the DB stock count
  const inStock = product.is_digital ? true : (product.stock ? product.stock > 0 : false);

  return (
    <div className="bg-brand-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          href="/store" 
          className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-900 font-semibold mb-6 animate-fade-in"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-slide-up">
          {/* Image Display */}
          <div className="glass-card p-6">
            <div className="w-full aspect-square rounded-lg overflow-hidden">
              <img 
                src={primaryImage} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="py-6">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider mb-4">
              {product.type || 'Product'}
            </span>

            <h1 className="text-4xl lg:text-5xl font-bold text-brand-900 mb-4">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <p className={`font-bold text-4xl ${product.sale_price ? 'text-red-600' : 'text-brand-800'}`}>
                {formatPrice(product.sale_price || product.price)}
              </p>
              {product.sale_price && (
                <p className="text-2xl text-brand-500 line-through">{formatPrice(product.price)}</p>
              )}
            </div>

            <div className="mb-8">
              <p className="text-brand-700 leading-relaxed">
                {product.description || 'No description provided.'}
              </p>
            </div>

            {/* Digital Badge or Stock Status */}
            {product.is_digital ? (
              <div className="flex items-center gap-2 text-brand-600 font-semibold mb-6 bg-white w-fit px-4 py-2 rounded-full shadow-sm border border-brand-100">
                {product.type === 'course' ? <MonitorPlay className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                <span>Instant Digital Access</span>
              </div>
            ) : (
              <div className={`flex items-center gap-2 font-semibold mb-6 ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                {inStock ? <CheckCircle className="w-5 h-5" /> : null}
                <span>{inStock ? 'In Stock' : 'Out of Stock'}</span>
              </div>
            )}

            {/* Variants (Hidden if Digital) */}
            {!product.is_digital && (
              <div className="space-y-6">
                {/* Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-brand-800 mb-3">Available Sizes</h3>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map((size: string) => (
                        <span key={size} className="px-4 py-2 rounded-lg border border-brand-300 text-brand-700 bg-white">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-brand-800 mb-3">Available Colors</h3>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((color: string) => (
                        <span key={color} className="px-4 py-2 rounded-lg border border-brand-300 text-brand-700 bg-white">
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Purchase Action */}
            <div className="mt-10">
              <Link 
                href={`/store/checkout/${product.slug}`}
                className={`btn-primary w-full text-lg py-4 flex items-center justify-center gap-3 ${!inStock ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
              >
                <ShoppingCart className="w-6 h-6" />
                <span>{inStock ? 'Buy Now' : 'Out of Stock'}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}