'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type FormState = {
  message: string;
  isError: boolean;
};

export async function loginUser(
  previousState: FormState | null,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createServerSupabaseClient();
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectUrl = formData.get('redirect') as string; 

  if (!email || !password) {
    return { message: 'Email and password are required.', isError: true };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { message: `Login failed: ${error.message}`, isError: true };
  }

  revalidatePath('/', 'layout');
  
  redirect(redirectUrl || '/account');
}

export async function signupUser(
  previousState: FormState | null,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createServerSupabaseClient();
  
  // 1. GET ALL FIELDS, INCLUDING fullName
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // Their validation
  if (!fullName || !email || !password || !confirmPassword) {
    return { message: 'All fields are required.', isError: true };
  }
  if (password !== confirmPassword) {
    return { message: 'Passwords do not match.', isError: true };
  }
  if (password.length < 6) {
    return { message: 'Password must be at least 6 characters long.', isError: true };
  }


  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName, 
      },
    },
  });

  if (error) {
    return { message: `Signup failed: ${error.message}`, isError: true };
  }

  revalidatePath('/', 'layout');
  
  return {
    message: 'Account created successfully! Please check your email to verify your account.',
    isError: false,
  };
}

export async function logoutUser() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function requestPasswordReset(
  previousState: FormState | null,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createServerSupabaseClient();
  const email = formData.get('email') as string;

  if (!email) {
    return { message: 'Email is required.', isError: true };
  }

  // Get the redirect path

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/auth/update-password`,
  });

  if (error) {
    console.error('Error sending reset email:', error);
    return { message: 'Failed to send reset email. Please try again.', isError: true };
  }

  return { message: 'Password reset link has been sent to your email.', isError: false };
}

export async function resetPassword(
  previousState: FormState | null,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createServerSupabaseClient();
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!password || !confirmPassword) {
    return { message: 'Both password fields are required.', isError: true };
  }

  if (password !== confirmPassword) {
    return { message: 'Passwords do not match.', isError: true };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error('Error resetting password:', error);
    return { message: `Error updating password: ${error.message}`, isError: true };
  }

  return { message: 'Your password has been reset successfully.', isError: false };
}

export async function updatePassword(previousState: any, formData: FormData) {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirm_password') as string;

  if (password !== confirmPassword) {
    return { message: 'Passwords do not match', isError: true };
  }

  if (password.length < 6) {
    return { message: 'Password must be at least 6 characters', isError: true };
  }

  const supabase = await createServerSupabaseClient();
  
  const { error } = await supabase.auth.updateUser({
    password: password
  });

  if (error) {
    return { message: error.message, isError: true };
  }

  // Redirect to login or admin dashboard with a success flag
  redirect('/auth?message=Password updated successfully');
}