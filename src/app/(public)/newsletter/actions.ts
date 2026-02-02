'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Resend } from 'resend'; 

const resend = new Resend(process.env.RESEND_API_KEY); 

type FormState = {
  message: string;
  isError: boolean;
};

export async function subscribeToNewsletter(
  previousState: FormState | null,
  formData: FormData,
): Promise<FormState> {
  
  const email = formData.get('email') as string;
  const name = formData.get('name') as string; 

  if (!email) {
    return { message: 'Email is required.', isError: true };
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from('subscribers')
    .insert({
      email: email,
      full_name: name || null, 
    });

  if (error) {
    if (error.code === '23505') {
      return { message: 'You are already subscribed!', isError: false };
    }
    
    console.error('Error subscribing:', error);
    return { message: `Failed to subscribe: ${error.message}`, isError: true };
  }

  try {
    await resend.emails.send({
      from: 'Success Driven Amaka <hello@yourdomain.com>',
      to: email,
      subject: 'You are in! (Revenue Growth Strategies)',
      text: `Hi ${name || 'there'},\n\nThanks for joining my newsletter. I'm excited to share my revenue growth strategies with you.\n\nKeep an eye on your inbox—I'll be sending over insights to help you scale your business soon.\n\nTo your success,\n\nAmaka\nRevenue Growth Strategist`,
    });
  } catch (resendError) {
    console.error('Resend failed to send welcome email:', resendError);
  }

  return { message: 'Success! You are now subscribed.', isError: false };
}