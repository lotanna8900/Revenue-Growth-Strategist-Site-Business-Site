'use client';

import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom'; 
import { createPost } from '../actions';

type FormState = { error: string } | null;
import Editor from '@/components/admin/Editor';
import { AlertCircle, Loader2 } from 'lucide-react';
import FileManagerModal from '@/components/admin/FileManagerModal';

// slugify function
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') 
    .replace(/[^\w-]+/g, '') 
    .replace(/--+/g, '-'); 
}

// SubmitButton function
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
        'Create Post'
      )}
    </button>
  );
}

// Main page component
export default function NewPostPage() {
  const [state, formAction] = useActionState(createPost, null);
  
  // Client state for editor
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [featured, setFeatured] = useState(false);
  const [featuredImage, setFeaturedImage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(slugify(newTitle));
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-brand-900 mb-8">
        Create New Blog Post
      </h1>

      <form action={formAction} className="max-w-4xl space-y-6">
        {/* This error display is now correct */}
        {state && state.error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-100 p-3 text-sm text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span>{state.error}</span>
            </div>
        )}

        {/* Title */}
        <div className="glass-card p-6">
          <label htmlFor="title" className="block text-lg font-semibold text-brand-800 mb-2">
            Post Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={title}
            onChange={handleTitleChange}
            className="w-full px-4 py-3 rounded-lg border border-brand-200 text-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
            placeholder="Your amazing blog post title"
          />
        </div>

        {/* Slug */}
        <div className="glass-card p-6">
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
            placeholder="your-amazing-blog-post-title"
          />
          <p className="text-sm text-brand-500 mt-2">
            (This is generated automatically from the title, but you can change it.)
          </p>
        </div>

        {/* IMAGE CARD */}
        <div className="glass-card p-6">
          <label htmlFor="featured_image" className="block text-lg font-semibold text-brand-800 mb-2">
            Featured Image
          </label>
          <div className="flex gap-2">
            <input
              id="featured_image"
              name="featured_image"
              type="text"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
              placeholder="Click 'Browse' or paste a URL..."
            />
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn-secondary flex-shrink-0"
            >
              Browse
            </button>
          </div>
          {featuredImage && (
            <img src={featuredImage} alt="Preview" className="mt-4 rounded-lg object-cover w-full h-48" />
          )}
        </div>

        {/* Content Editor */}
        <div className="glass-card p-6">
          <label className="block text-lg font-semibold text-brand-800 mb-2">
            Post Content
          </label>
          <Editor
            content={content}
            onChange={(html) => setContent(html)}
          />
          {/* Hidden input to send HTML to the server action */}
          <input type="hidden" name="content" value={content} />
        </div>

        {/* Publish Actions */}
        <div className="glass-card p-6 flex justify-between items-center">
          <div className="flex flex-wrap gap-8">
            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-lg font-semibold text-brand-800 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue="draft"
                className="px-4 py-3 rounded-lg border border-brand-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-600"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            
            {/* Featured Checkbox */}
            <div className="flex items-center pt-8">
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
          
          <SubmitButton />
        </div>
      </form>

      {/* Filemanager Modal */}
      <FileManagerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFileSelect={(url) => {
          setFeaturedImage(url);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}