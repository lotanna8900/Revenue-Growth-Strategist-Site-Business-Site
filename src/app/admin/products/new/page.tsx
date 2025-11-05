'use client';

import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createProduct } from '../actions';
import { AlertCircle, Loader2 } from 'lucide-react';
import FileManagerModal from '@/components/admin/FileManagerModal';

type FormState = { error: string } | null;

// Slugify function
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') 
    .replace(/[^\w-]+/g, '') 
    .replace(/--+/g, '-'); 
}

// Form submit button
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
          Saving...
        </>
      ) : (
        'Create Product'
      )}
    </button>
  );
}

// Main page component
export default function NewProductPage() {
  const [state, formAction] = useActionState(createProduct, null);
  
  // Client state for controlled inputs
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [featured, setFeatured] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    setSlug(slugify(newName));
  };

  const handleFileSelect = (url: string) => {
    const newImages = images
      ? `${images}, ${url}`
      : url;
    setImages(newImages);
    setIsModalOpen(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-brand-900 mb-8">
        Add New Product
      </h1>

      <form action={formAction} className="max-w-4xl space-y-6">
        {state?.error && (
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
                placeholder="e.g., Krystal Silk Blouse"
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
                placeholder="e.g., krystal-silk-blouse"
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
            className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
            placeholder="Describe the product, material, fit, etc..."
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
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
                placeholder="e.g., 15000.00"
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
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
                placeholder="e.g., 12500.00"
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
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
                placeholder="e.g., 50"
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
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
                placeholder="e.g., KFK-BLS-001"
              />
            </div>
          </div>
        </div>

        {/* Organization Card (UPDATED) */}
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
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
                placeholder="e.g., Tops, Shoes, Dresses"
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
                defaultValue="active"
                className="w-full px-4 py-3 rounded-lg border border-brand-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-600"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive (Draft)</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>
          
          {/* 2. FEATURED CHECKBOX */}
          <div className="flex items-center pt-6 mt-6 border-t border-brand-200">
            <input
              id="featured"
              name="featured"
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-5 w-5 rounded border-brand-300 text-brand-600 focus:ring-brand-600"
            />
            <label htmlFor="featured" className="ml-2 block text-md font-semibold text-brand-800">
              Feature on homepage?
            </label>
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
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
                placeholder="e.g., S, M, L, XL"
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
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
                placeholder="e.g., Red, Blue, Black"
              />
              <p className="text-sm text-brand-500 mt-2">
                Enter colors separated by a comma.
              </p>
            </div>

            {/* Images */}
            <div>
              <label htmlFor="images" className="block text-md font-semibold text-brand-800 mb-2">
                Image URLs
              </label>
              <div className="flex gap-2">
                <input
                  id="images"
                  name="images"
                  type="text"
                  value={images}
                  onChange={(e) => setImages(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
                  placeholder="Click 'Browse' or paste URLs..."
                />
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="btn-secondary flex-shrink-0"
                >
                  Browse
                </button>
              </div>
              <p className="text-sm text-brand-500 mt-2">
                Add URLs separated by a comma.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </form>

      {/* File manager modal */}
      <FileManagerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
}