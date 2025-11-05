'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';

type FormState = {
  message: string;
  isError: boolean;
};

export async function subscribeToNewsletter(
  previousState: FormState | null,
  formData: FormData,
): Promise<FormState> {
  
  const email = formData.get('email') as string;
  const name = formData.get('name') as string; // Optional name

  if (!email) {
    return { message: 'Email is required.', isError: true };
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from('subscribers')
    .insert({
      email: email,
      full_name: name || null, // Save the name if provided
    });

  if (error) {
    if (error.code === '23505') {
      return { message: 'You are already subscribed!', isError: false };
    }
    
    console.error('Error subscribing:', error);
    return { message: `Failed to subscribe: ${error.message}`, isError: true };
  }

  return { message: 'Success! You are now subscribed.', isError: false };
}