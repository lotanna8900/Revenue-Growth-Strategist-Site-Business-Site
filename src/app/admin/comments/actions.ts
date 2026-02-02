'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function approveComment(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = formData.get('id') as string;

  if (!id) {
    throw new Error('Comment ID is missing.');
  }

  const { error } = await supabase
    .from('comments')
    .update({ status: 'approved', updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error approving comment:', error);
    throw new Error('Failed to approve comment.');
  }

  revalidatePath('/admin/comments');
}

export async function deleteComment(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = formData.get('id') as string;

  if (!id) {
    throw new Error('Comment ID is missing.');
  }

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting comment:', error);
    throw new Error('Failed to delete comment.');
  }

  revalidatePath('/admin/comments');
}