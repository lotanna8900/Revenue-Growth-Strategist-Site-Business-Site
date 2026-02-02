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
  
  // Digital/Course specific states
  const [type, setType] = useState<'physical' | 'course' | 'video' | 'download'>('physical');
  const [isDigital, setIsDigital] = useState(false);
  const [accessUrl, setAccessUrl] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    setSlug(slugify(newName));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value as any;
    setType(selectedType);
    setIsDigital(selectedType !== 'physical');
  };

  const handleFileSelect = (url: string) => {
    const newImages = images ? `${images}, ${url}` : url;
    setImages(newImages);
    setIsModalOpen(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-brand-900 mb-8">
        Add New Product
      </h1>

      <form action={formAction} className="max-w-4xl space-y-6">
        {/* Hidden field for digital boolean */}
        <input type="hidden" name="is_digital" value={isDigital ? 'on' : 'off'} />

        {state?.error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Main Details Card */}
        <div className="glass-card p-6">
          <div className="space-y-4">
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
                placeholder="e.g., Revenue Growth Masterclass"
              />
            </div>

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
                placeholder="e.g., revenue-growth-masterclass"
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
            placeholder="Describe the value proposition of this course or product..."
          ></textarea>
        </div>

        {/* Pricing & Inventory Card */}
        <div className="glass-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                placeholder="e.g., 50000.00"
              />
            </div>
            
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
                placeholder="e.g., 35000.00"
              />
            </div>
            
            {/* Show stock only for physical products */}
            {!isDigital && (
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
            )}

            <div>
              <label htmlFor="sku" className="block text-md font-semibold text-brand-800 mb-2">
                SKU / Reference ID
              </label>
              <input
                id="sku"
                name="sku"
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
                placeholder="e.g., COURSE-001"
              />
            </div>
          </div>
        </div>

        {/* Organization Card */}
        <div className="glass-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="type" className="block text-md font-semibold text-brand-800 mb-2">
                Product Type
              </label>
              <select
                id="type"
                name="type"
                value={type}
                onChange={handleTypeChange}
                className="w-full px-4 py-3 rounded-lg border border-brand-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-600"
              >
                <option value="physical">Physical Product</option>
                <option value="course">Online Course</option>
                <option value="video">Paid Masterclass Video</option>
                <option value="download">Digital Download (PDF)</option>
              </select>
            </div>
            
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
              </select>
            </div>
          </div>

          {/* Digital Access URL - Only show for digital products */}
          {isDigital && (
            <div className="mt-6 pt-6 border-t border-brand-200">
              <label htmlFor="access_url" className="block text-md font-semibold text-brand-800 mb-2 text-brand-900">
                Access URL (Course/Video Link)
              </label>
              <input
                id="access_url"
                name="access_url"
                type="url"
                required
                value={accessUrl}
                onChange={(e) => setAccessUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-brand-600 bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-600"
                placeholder="https://vimeo.com/your-private-link"
              />
              <p className="text-sm text-brand-500 mt-2 italic">
                This link will be sent to the customer via email once payment is confirmed.
              </p>
            </div>
          )}
          
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
        
        {/* Variants Card - Hide for digital products */}
        {!isDigital && (
          <div className="glass-card p-6">
            <div className="space-y-4">
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
              </div>
              
              <div>
                <label htmlFor="colors" className="block text-md font-semibold text-brand-800 mb-2">
                  Colors
                </label>
                <input
                  id="colors"
                  name="colors"
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
                  placeholder="e.g., Gold, Brown, White"
                />
              </div>
            </div>
          </div>
        )}

        {/* Images Card */}
        <div className="glass-card p-6">
          <label htmlFor="images" className="block text-md font-semibold text-brand-800 mb-2">
            Product Images
          </label>
          <div className="flex gap-2">
            <input
              id="images"
              name="images"
              type="text"
              value={images}
              onChange={(e) => setImages(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
              placeholder="Paste URLs or click Browse..."
            />
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn-secondary flex-shrink-0"
            >
              Browse
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </form>

      <FileManagerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
}