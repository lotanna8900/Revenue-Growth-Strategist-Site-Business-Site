'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateSettings(
  previousState: any, 
  formData: FormData
) {
  const supabase = await createServerSupabaseClient();
  
  const settingsToUpdate = [
    { key: 'heroTitle', value: formData.get('heroTitle') as string },
    { key: 'heroSubtitle', value: formData.get('heroSubtitle') as string },
    { key: 'homepageImage1', value: formData.get('homepageImage1') as string }, 
    { key: 'homepageImage2', value: formData.get('homepageImage2') as string },
    { key: 'aboutImageUrl', value: formData.get('aboutImageUrl') as string },
    { key: 'aboutStory', value: formData.get('aboutStory') as string },
    { key: 'linkedinUrl', value: formData.get('linkedinUrl') as string },
    { key: 'instagramUrl', value: formData.get('instagramUrl') as string },
    { key: 'tiktokUrl', value: formData.get('tiktokUrl') as string },
    { key: 'twitterUrl', value: formData.get('twitterUrl') as string },
  ];

  const { error } = await supabase
    .from('site_settings')
    .upsert(settingsToUpdate, { onConflict: 'key' });

  if (error) {
    console.error('Error updating settings:', error);
    return { error: 'Failed to update settings.' };
  }

  revalidatePath('/about');
  revalidatePath('/');
  return { message: 'Settings saved successfully!' };
}