import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AlertCircle } from 'lucide-react';
import SettingsForm from '@/components/admin/SettingsForm'; 

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('site_settings').select('*');

  if (error) {
    console.error('Error fetching settings:', error);
  }

  // Convert the array of settings into an easy-to-use object
  const settings = data?.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>) || {};

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-brand-900 mb-8">
        Site Settings
      </h1>

      <div className="glass-card p-4 mb-6 bg-blue-50 border border-blue-200">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600" />
          <p className="text-blue-700">
            Use the <strong>File Manager</strong> to upload images, then click 'Browse'
            to select them for your site.
          </p>
        </div>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}