'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function unsubscribeSubscriber(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = formData.get('id') as string;

  if (!id) {
    throw new Error('Subscriber ID is missing.');
  }

  // Update the status to 'unsubscribed' instead of deleting
  const { error } = await supabase
    .from('subscribers')
    .update({ status: 'unsubscribed' })
    .eq('id', id);

  if (error) {
    console.error('Error unsubscribing:', error);
    throw new Error('Failed to unsubscribe subscriber.');
  }

  revalidatePath('/admin/subscribers');
}

export async function deleteSubscriber(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = formData.get('id') as string;

  if (!id) {
    throw new Error('Subscriber ID is missing.');
  }

  // Permanently delete the subscriber
  const { error } = await supabase
    .from('subscribers')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting subscriber:', error);
    throw new Error('Failed to delete subscriber.');
  }
  
  revalidatePath('/admin/subscribers');
}