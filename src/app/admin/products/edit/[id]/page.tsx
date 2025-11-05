'use client';

import { useState, useEffect, use, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateProduct } from '@/app/admin/products/actions';
import { createClient } from '@/lib/supabase/client';
import { AlertCircle, Loader2 } from 'lucide-react';

// Simple type for the product data
type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  stock: number | null;
  sku: string | null;
  category: string | null;
  status: string;
  sizes: string[];
  colors: string[];
  images: string[];
};

type FormState = { error: string } | null;

// Re-usable slugify function
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

// Re-usable submit button
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
          Updating...
        </>
      ) : (
        'Update Product'
      )}
    </button>
  );
}

// Main page component
export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Unwrap the 'params' promise
  const clientParams = use(params);
  const { id } = clientParams;
  
  // 2. Use 'useActionState' for form handling
  const [state, formAction] = useActionState(updateProduct, null);
  
  // 3. State for all form fields
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('active');
  const [sizes, setSizes] = useState('');
  const [colors, setColors] = useState('');
  const [images, setImages] = useState('');

  // Fetch the product data on component mount
  useEffect(() => {
    if (!id) return; 

    const supabase = createClient();
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) {
        // Set all the controlled component states
        setName(data.name);
        setSlug(data.slug);
        setDescription(data.description || '');
        setPrice(data.price?.toString() || '');
        setSalePrice(data.sale_price?.toString() || '');
        setStock(data.stock?.toString() || '0');
        setSku(data.sku || '');
        setCategory(data.category || '');
        setStatus(data.status);
        // Convert arrays back to comma-separated strings for the form
        setSizes(data.sizes?.join(', ') || '');
        setColors(data.colors?.join(', ') || '');
        setImages(data.images?.join(', ') || '');
      } else {
        console.error('Error fetching product:', error);
      }
      setIsLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    setSlug(slugify(newName));
  };
  
  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-brand-900 mb-8">
        Edit Product
      </h1>

      <form action={formAction} className="max-w-4xl space-y-6">
        <input type="hidden" name="id" value={id} />

        {state && state.error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-100 p-3 text-sm text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span>{state.error}</span>
            </div>
        )}

        {/* Main Details Card */}
        <div className="glass-card p-6">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-lg font-semibold text-brand-800 mb-2">
                Product Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={handleNameChange}
                className="w-full px-4 py-3 rounded-lg border border-brand-200 text-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-lg font-semibold text-brand-800 mb-2">
                URL Slug
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-brand-200 bg-brand-50 text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>
          </div>
        </div>
        
        {/* Description Card */}
        <div className="glass-card p-6">
          <label htmlFor="description" className="block text-lg font-semibold text-brand-800 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
          ></textarea>
        </div>

        {/* Pricing & Inventory Card */}
        <div className="glass-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price (NGN) */}
            <div>
              <label htmlFor="price" className="block text-md font-semibold text-brand-800 mb-2">
                Price (NGN)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>
            
            {/* Sale Price (NGN) */}
            <div>
              <label htmlFor="sale_price" className="block text-md font-semibold text-brand-800 mb-2">
                Sale Price (NGN) - Optional
              </label>
              <input
                id="sale_price"
                name="sale_price"
                type="number"
                step="0.01"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>
            
            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-md font-semibold text-brand-800 mb-2">
                Stock Quantity
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            {/* SKU */}
            <div>
              <label htmlFor="sku" className="block text-md font-semibold text-brand-800 mb-2">
                SKU (Stock Keeping Unit)
              </label>
              <input
                id="sku"
                name="sku"
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>
          </div>
        </div>

        {/* Organization Card */}
        <div className="glass-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-md font-semibold text-brand-800 mb-2">
                Category
              </label>
              <input
                id="category"
                name="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>
            
            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-md font-semibold text-brand-800 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-brand-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-600"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive (Draft)</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Variants Card */}
        <div className="glass-card p-6">
          <div className="space-y-4">
            {/* Sizes */}
            <div>
              <label htmlFor="sizes" className="block text-md font-semibold text-brand-800 mb-2">
                Sizes
              </label>
              <input
                id="sizes"
                name="sizes"
                type="text"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <p className="text-sm text-brand-500 mt-2">
                Enter sizes separated by a comma.
              </p>
            </div>
            
            {/* Colors */}
            <div>
              <label htmlFor="colors" className="block text-md font-semibold text-brand-800 mb-2">
                Colors
              </label>
              <input
                id="colors"
                name="colors"
                type="text"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <p className="text-sm text-brand-500 mt-2">
                Enter colors separated by a comma.
              </p>
            </div>

            {/* Images */}
            <div>
              <label htmlFor="images" className="block text-md font-semibold text-brand-800 mb-2">
                Image URLs (Temporary)
              </label>
              <input
                id="images"
                name="images"
                type="text"
                value={images}
                onChange={(e) => setImages(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <p className="text-sm text-brand-500 mt-2">
                Enter URLs separated by a comma. We will replace this with the File Manager.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}