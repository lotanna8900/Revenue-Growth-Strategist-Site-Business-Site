'use client';

import { useState, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { updateSettings } from '@/app/admin/settings/actions';
import { Settings, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import FileManagerModal from './FileManagerModal';
import Editor from '@/components/admin/Editor';

type SettingsProps = {
  settings: Record<string, string>;
};
type FormState = { error?: string; message?: string } | null;

// Reusable input field component
function SettingInput({ label, name, value, onChange, placeholder }: {
  label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-lg font-semibold text-brand-800 mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
      />
    </div>
  );
}

// Image Input with "Browse" button
function SettingImageInput({ label, name, value, onChange, onBrowse, placeholder }: {
  label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onBrowse: () => void, placeholder?: string
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-lg font-semibold text-brand-800 mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={name}
          name={name}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
        />
        <button
          type="button"
          onClick={onBrowse}
          className="btn-secondary flex-shrink-0"
        >
          Browse
        </button>
      </div>
    </div>
  );
}

// Textarea component
function SettingTextarea({ label, name, value, onChange, placeholder }: {
  label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, placeholder?: string
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-lg font-semibold text-brand-800 mb-2">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={8}
        className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-600"
      />
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary flex items-center justify-center gap-2"
    >
      {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Settings className="w-5 h-5" />}
      {pending ? 'Saving...' : 'Save Settings'}
    </button>
  );
}

// Main Form Component
export default function SettingsForm({ settings }: SettingsProps) {
  const [state, formAction] = useActionState(updateSettings, null);
  const [formData, setFormData] = useState(settings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalKey, setActiveModalKey] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBrowseClick = (key: string) => {
    setActiveModalKey(key);
    setIsModalOpen(true);
  };

  const handleFileSelect = (url: string) => {
    if (activeModalKey) {
      setFormData(prev => ({ ...prev, [activeModalKey]: url }));
    }
    setIsModalOpen(false);
    setActiveModalKey(null);
  };

  // Handler for the Rich Text Editor
  const handleEditorChange = (html: string) => {
    setFormData(prev => ({ ...prev, aboutStory: html }));
  };

  return (
    <>
      <form action={formAction} className="max-w-4xl space-y-6">
        
        {/* Homepage Settings */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-brand-800 border-b border-brand-200 pb-2">Homepage</h2>
          <SettingInput
            label="Hero Title"
            name="heroTitle"
            value={formData.heroTitle || ''}
            onChange={handleChange}
          />
          <SettingInput
            label="Hero Subtitle"
            name="heroSubtitle"
            value={formData.heroSubtitle || ''}
            onChange={handleChange}
          />
          <SettingImageInput
            label="Homepage Image 1 URL"
            name="homepageImage1"
            value={formData.homepageImage1 || ''}
            onChange={handleChange}
            onBrowse={() => handleBrowseClick('homepageImage1')}
            placeholder="https://..._your_image.jpg"
          />
          <SettingImageInput
            label="Homepage Image 2 URL"
            name="homepageImage2"
            value={formData.homepageImage2 || ''}
            onChange={handleChange}
            onBrowse={() => handleBrowseClick('homepageImage2')}
            placeholder="https://..._your_image.jpg"
          />
        </div>

        {/* About Page Settings */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-brand-800 border-b border-brand-200 pb-2">About Page</h2>
          <SettingImageInput
            label="About Page Image URL"
            name="aboutImageUrl"
            value={formData.aboutImageUrl || ''}
            onChange={handleChange}
            onBrowse={() => handleBrowseClick('aboutImageUrl')}
            placeholder="https://..._your_image.jpg"
          />
          {/* Rich Text Editor for Story */}
          <div>
            <label className="block text-lg font-semibold text-brand-800 mb-2">
               About Page Story
            </label>
            <div className="prose-container border border-brand-200 rounded-lg overflow-hidden">
               <Editor 
                 content={formData.aboutStory || ''} 
                 onChange={handleEditorChange} 
               />
            </div>
            {/* ⚠️ Hidden input is required to send data to the server action */}
            <input 
              type="hidden" 
              name="aboutStory" 
              value={formData.aboutStory || ''} 
            />
          </div>
        </div>
        
        {/* Social Links */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-brand-800 border-b border-brand-200 pb-2">Social Links</h2>
          <SettingInput label="LinkedIn URL" name="linkedinUrl" value={formData.linkedinUrl || ''} onChange={handleChange} placeholder="https://www.linkedin.com/in/..." />
          <SettingInput label="Instagram URL" name="instagramUrl" value={formData.instagramUrl || ''} onChange={handleChange} placeholder="https://www.instagram.com/..." />
          <SettingInput label="Twitter URL" name="twitterUrl" value={formData.twitterUrl || ''} onChange={handleChange} placeholder="https://www.twitter.com/..." />
          <SettingInput label="TikTok URL" name="tiktokUrl" value={formData.tiktokUrl || ''} onChange={handleChange} placeholder="https://www.tiktok.com/@..." />
        </div>

        <div className="flex justify-end items-center gap-4">
          {state?.message && (
            <div className={`flex items-center gap-2 text-sm ${
              state.error ? 'text-red-700' : 'text-green-700'
            }`}>
              {state.error ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
              <span>{state.message}</span>
            </div>
          )}
          <SubmitButton />
        </div>
      </form>

      <FileManagerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFileSelect={handleFileSelect}
      />
    </>
  );
}