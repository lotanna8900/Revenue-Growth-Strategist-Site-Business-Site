'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

type FormState = {
  message: string;
  isError: boolean;
};

export async function submitComment(
  previousState: FormState | null,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createServerSupabaseClient();

  const content = formData.get('content') as string;
  const post_id = formData.get('post_id') as string;
  
  if (!content || !post_id) {
    return { message: 'Missing required fields.', isError: true };
  }

  // Check if a user is logged in
  const { data: { user } } = await supabase.auth.getUser();

  let commentData: any = {
    content,
    post_id,
    status: 'pending', // All comments must be approved
  };

  if (user) {
    // User is logged in
    commentData.user_id = user.id;
  } else {
    // User is a guest
    const guest_name = formData.get('guest_name') as string;
    const guest_email = formData.get('guest_email') as string;
    
    if (!guest_name || !guest_email) {
      return { message: 'Name and Email are required for guest comments.', isError: true };
    }
    commentData.guest_name = guest_name;
    commentData.guest_email = guest_email;
  }

  const { error } = await supabase.from('comments').insert([commentData]);

  if (error) {
    console.error('Error submitting comment:', error);
    return { message: 'Failed to submit comment.', isError: true };
  }

  // Don't revalidate the path, as the comment is pending
  return { message: 'Success! Your comment is awaiting moderation.', isError: false };
}