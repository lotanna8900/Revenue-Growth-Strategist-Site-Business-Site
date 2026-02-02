'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function getAchievementData(formData: FormData) {
  const imageUrl = formData.get('image_url') as string;

  return {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    client_name: formData.get('client_name') as string,
    industry: formData.get('industry') as string,
    year: formData.get('year') ? parseInt(formData.get('year') as string) : null,
    status: formData.get('status') as string,
    featured: formData.get('featured') === 'on',
    images: imageUrl ? [imageUrl] : null, 
  };
}

export async function createAchievement(previousState: any, formData: FormData) {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to create an achievement.' };
  }

  const achievementData = getAchievementData(formData);

  if (!achievementData.title || !achievementData.slug) {
    return { error: 'Title and Slug are required.' };
  }

  const { error } = await supabase.from('achievements').insert([
    {
      ...achievementData,
    },
  ]);

  if (error) {
    console.error('Error creating achievement:', error);
    return { error: 'Failed to create achievement. ' + error.message };
  }

  revalidatePath('/admin/achievements');
  revalidatePath('/achievements');
  redirect('/admin/achievements');
}

export async function updateAchievement(previousState: any, formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = formData.get('id') as string;

  if (!id) {
    return { error: 'Achievement ID is missing.' };
  }

  const achievementData = getAchievementData(formData);

  const { error } = await supabase
    .from('achievements')
    .update({
      ...achievementData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating achievement:', error);
    return { error: 'Failed to update achievement. ' + error.message };
  }

  revalidatePath('/admin/achievements');
  revalidatePath(`/admin/achievements/edit/${id}`);
  revalidatePath(`/achievements/${achievementData.slug}`); 
  redirect('/admin/achievements');
}

export async function deleteAchievement(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = formData.get('id') as string;

  if (!id) {
    throw new Error('Achievement ID is missing.');
  }

  const { error } = await supabase
    .from('achievements')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting achievement:', error);
    throw new Error('Failed to delete achievement. ' + error.message);
  }

  revalidatePath('/admin/achievements');
  redirect('/admin/achievements');
}