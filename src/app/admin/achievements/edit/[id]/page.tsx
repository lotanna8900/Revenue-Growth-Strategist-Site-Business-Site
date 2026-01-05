'use client';

import { useState, useEffect, use, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateAchievement } from '@/app/admin/achievements/actions'; 
import { createClient } from '@/lib/supabase/client';
import { AlertCircle, Loader2 } from 'lucide-react';

// Define a simple type for the achievement data
type Achievement = { 
  id: string;
  title: string;
  slug: string;
  description: string | null;
  client_name: string | null;
  industry: string | null;
  year: number | null;
  status: string;
  featured: boolean;
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
        'Update Achievement' 
      )}
    </button>
  );
}

// Main page component
export default function EditAchievementPage({ params }: { params: Promise<{ id: string }> }) { 
  // 2. Unwrap the 'params' promise
  const clientParams = use(params);
  const { id } = clientParams;
  
  // 3. Use 'useActionState' for form handling
  const [state, formAction] = useActionState(updateAchievement, null); 
  
  // Local state for the form fields
  const [achievementData, setAchievementData] = useState<Achievement | null>(null); 
  const [isLoading, setIsLoading] = useState(true);
  
  // Client-side state for controlled inputs
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [clientName, setClientName] = useState('');
  const [industry, setIndustry] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('completed');
  const [featured, setFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // Fetch the achievement data on component mount
  useEffect(() => {
    if (!id) return; 

    const supabase = createClient();
    const fetchAchievement = async () => { 
      const { data, error } = await supabase
        .from('achievements') // Renamed table
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) {
        setAchievementData(data as Achievement); 
        setTitle(data.title);
        setSlug(data.slug);
        setClientName(data.client_name || '');
        setIndustry(data.industry || '');
        setYear(data.year?.toString() || '');
        setDescription(data.description || '');
        setStatus(data.status);
        setFeatured(data.featured);

        const imgs = data.images as string[] | null;
        if (imgs && imgs.length > 0) {
            setImageUrl(imgs[0]);
        }

      } else {
        console.error('Error fetching achievement:', error); 
      }
      setIsLoading(false);
    };

    fetchAchievement(); 
  }, [id]);
  

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(slugify(newTitle));
  };
  
  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!achievementData) {
     return <div className="p-8">Achievement not found.</div>; 
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-brand-900 mb-8">
        Edit Achievement
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
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-lg font-semibold text-brand-800 mb-2">
                Achievement Title
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

        {/* IMAGE UPLOAD SECTION */}
        <div className="glass-card p-6">
          <div className="space-y-4">
            <label htmlFor="image_url" className="block text-lg font-semibold text-brand-800 mb-2">
              Achievement Image
            </label>
            <p className="text-sm text-brand-600 mb-2">
              Paste the link from your File Manager here.
            </p>
            <input
              id="image_url"
              name="image_url"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
              placeholder="https://..."
            />
          </div>
        </div>
        
        {/* Context Card */}
        <div className="glass-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Name / Context */}
            <div>
              <label htmlFor="client_name" className="block text-md font-semibold text-brand-800 mb-2">
                Client / Organization (Optional)
              </label>
              <input
                id="client_name"
                name="client_name"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>
            
            {/* Industry / Category */}
            <div>
              <label htmlFor="industry" className="block text-md font-semibold text-brand-800 mb-2">
                Category
              </label>
              <input
                id="industry"
                name="industry"
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
                placeholder="e.g., Case Study, Course, Speaking"
              />
            </div>
            
            {/* Year */}
            <div>
              <label htmlFor="year" className="block text-md font-semibold text-brand-800 mb-2">
                Year
              </label>
              <input
                id="year"
                name="year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>
          </div>
        </div>

        {/* Description Card */}
        <div className="glass-card p-6">
          <label htmlFor="description" className="block text-lg font-semibold text-brand-800 mb-2">
            Description & Key Takeaways
          </label>
          <textarea
            id="description"
            name="description"
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
            placeholder="Describe the achievement, the challenge, and the results or key lessons..."
          ></textarea>
        </div>

        {/* Publish Actions */}
        <div className="glass-card p-6 flex justify-between items-center">
          <div className="flex gap-8">
            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-lg font-semibold text-brand-800 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-3 rounded-lg border border-brand-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-600"
              >
                <option value="completed">Completed</option>
                <option value="ongoing">Ongoing</option>
              </select>
            </div>
            
            {/* Featured */}
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
    </div>
  );
}