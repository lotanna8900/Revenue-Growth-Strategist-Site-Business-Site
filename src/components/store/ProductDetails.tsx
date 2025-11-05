'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, ShoppingCart, Loader2 } from 'lucide-react';
import { createCheckoutSession } from '@/app/store/actions';

// Function to format price in NGN
function formatPrice(price: number | null) {
  if (!price) return 'N/A';
  return `NGN ${new Intl.NumberFormat('en-NG').format(price)}`;
}

// Main component:
export default function ProductDetails({ product }: { product: any }) {
  const primaryImage = product.images?.[0] || 'https://via.placeholder.com/600';
  const inStock = product.stock ? product.stock > 0 : false;

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
          {/* Image Gallery */}
          <div className="glass-card p-6">
            <div className="w-full aspect-square rounded-lg overflow-hidden">
              <img
                src={primaryImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="py-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-900 mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <p className={`font-bold text-4xl ${
                product.sale_price ? 'text-red-600' : 'text-brand-800'
              }`}>
                {formatPrice(product.sale_price || product.price)}
              </p>
              {product.sale_price && (
                <p className="text-2xl text-brand-500 line-through">
                  {formatPrice(product.price)}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <p className="text-brand-700 leading-relaxed">
                {product.description || 'No description provided.'}
              </p>
            </div>

            {/* Stock Status */}
            {inStock ? (
              <div className="flex items-center gap-2 text-green-600 font-semibold mb-6">
                <CheckCircle className="w-5 h-5" />
                <span>In Stock</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600 font-semibold mb-6">
                <span>Out of Stock</span>
              </div>
            )}

            {/* Variants (Sizes) */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-brand-800 mb-3">
                  Size
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size: string) => (
                    <button 
                      key={size}
                      className="px-4 py-2 rounded-lg border border-brand-300 text-brand-700 font-medium hover:bg-white hover:border-brand-600"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Checkout link */}
            <div className="mt-10">
              <Link 
                href={`/store/checkout/${product.slug}`}
                aria-disabled={!inStock}
                className={`btn-primary w-full text-lg py-4 flex items-center justify-center gap-3 ${
                  !inStock ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ShoppingCart className="w-6 h-6" />
                <span>
                  {inStock ? 'Buy Now' : 'Out of Stock'}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}