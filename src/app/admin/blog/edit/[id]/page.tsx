'use client';

import { useState, useEffect, use } from 'react';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { updatePost } from '@/app/admin/blog/actions';
import { createClient } from '@/lib/supabase/client';
import Editor from '@/components/admin/Editor';
import { AlertCircle, Loader2 } from 'lucide-react';
import FileManagerModal from '@/components/admin/FileManagerModal';

// Define a simple type for the post
type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published';
  featured: boolean;
  featured_image: string | null;
  created_at?: string;
  updated_at?: string;
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
          Saving...
        </>
      ) : (
        'Update Post'
      )}
    </button>
  );
}

// Main page component
export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const updatePostWithState = async (state: FormState, formData: FormData) => {
    try {
      await updatePost(state, formData);
      return null;
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'An error occurred' };
    }
  };
  
  const [state, formAction] = useActionState(updatePostWithState, null);
  
  // Local state for the form fields
  const [postData, setPostData] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Client-side state for controlled inputs
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [featured, setFeatured] = useState(false); 
  const [featuredImage, setFeaturedImage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch the post data on component mount
  useEffect(() => {
    if (!id) return; 

    const supabase = createClient();
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, content, status, featured, featured_image')
        .eq('id', id)
        .single();
      
      if (data) {
        setPostData(data as BlogPost);
        // Set the controlled component state
        setTitle(data.title);
        setSlug(data.slug);
        setContent(data.content);
        setStatus(data.status as 'draft' | 'published');
        setFeatured(data.featured || false); 
        setFeaturedImage(data.featured_image || '');
      } else {
        console.error('Error fetching post:', error);
      }
      setIsLoading(false);
    };

    fetchPost();
  }, [id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(slugify(newTitle));
  };
  
  // Show a loading state while fetching
  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!postData) {
     return <div className="p-8">Post not found.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-brand-900 mb-8">
        Edit Blog Post
      </h1>

      <form action={formAction} className="max-w-4xl space-y-6">
        {/* Hidden input for the post ID */}
        <input type="hidden" name="id" value={id} />

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
          />
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
          <p className="text-sm text-brand-500 mt-2">
            For best results, use a wide (16:9) image.
          </p>
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
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="px-4 py-3 rounded-lg border border-brand-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-600"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            
            {/* 5. ADDED FEATURED CHECKBOX */}
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

      {/* 8. File manager MODAL */}
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