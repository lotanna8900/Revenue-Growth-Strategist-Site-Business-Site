'use client';

import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createAchievement } from '../actions'; 
import { AlertCircle, Loader2 } from 'lucide-react';

// Define the state type for the form
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
        'Create Achievement' // Renamed text
      )}
    </button>
  );
}

// Main page component
export default function NewAchievementPage() { 
  // Use 'useActionState' and pass the action directly
  const [state, formAction] = useActionState(createAchievement, null); 
  
  // Client state for controlled inputs
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(slugify(newTitle));
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-brand-900 mb-8">
        Create New Achievement
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
                placeholder="e.g., Grew Client Revenue by 300%"
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
                placeholder="e.g., client-revenue-grew-300-percent"
              />
            </div>
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
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
                placeholder="e.g., ABC Corp or 'Personal'"
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
                className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
                placeholder="e.g., 2025"
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
                defaultValue="completed"
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