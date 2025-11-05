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

  // 3. THE FIX: Add the 'options.data' block back in
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