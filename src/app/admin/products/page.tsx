import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ShoppingBag, Plus, Dot, FileWarning } from 'lucide-react';
import { deleteProduct } from './actions'; 

// Function to format price
function formatPrice(price: number | null) {
  if (!price) return 'N/A';
  return `NGN ${new Intl.NumberFormat('en-NG').format(price)}`;
}

export default async function ProductsManagerPage() {
  const supabase = await createServerSupabaseClient();

  // Fetch all products
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, status, price, stock')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-brand-900">
          Products Manager
        </h1>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Product
        </Link>
      </div>

      {/* Product List */}
      <div className="glass-card p-6">
        <div className="space-y-4">
          {products && products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-200 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-brand-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-900 text-lg">
                      {product.name}
                    </h3>
                    <div className="flex items-center text-sm text-brand-600">
                      <span
                        className={`font-medium ${
                          product.status === 'active'
                            ? 'text-green-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                      <Dot />
                      <span>{formatPrice(product.price)}</span>
                      <Dot />
                      <span>{product.stock || 0} in stock</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/products/edit/${product.id}`}
                    className="font-medium text-brand-600 hover:text-brand-900"
                  >
                    Edit
                  </Link>
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={product.id} />
                    <button
                      type="submit"
                      className="font-medium text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center text-brand-600">
              <FileWarning className="w-12 h-12 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Products Yet</h2>
              <p>Click "New Product" to add one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}