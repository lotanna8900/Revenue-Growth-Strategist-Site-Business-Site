'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

type FormState = {
  error?: string;
  message?: string;
};

export async function uploadFile(
  previousState: FormState | null,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createServerSupabaseClient();
  const file = formData.get('file') as File;

  if (!file || file.size === 0) {
    return { error: 'No file provided.' };
  }

  // Ppload everything to a 'public_assets' bucket in a 'uploads' folder
  const filePath = `uploads/${new Date().getTime()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from('public_assets') // My public bucket
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading file:', error);
    return { error: `Failed to upload file: ${error.message}` };
  }

  revalidatePath('/admin/files');
  return { message: 'File uploaded successfully!' };
}

export async function deleteFile(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const filePath = formData.get('file_path') as string;

  if (!filePath) {
    throw new Error('File path is missing.');
  }

  const { error } = await supabase.storage
    .from('public_assets')
    .remove([filePath]); // Pass the full path, e.g., "uploads/file.png"

  if (error) {
    console.error('Error deleting file:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }

  revalidatePath('/admin/files');
  return { message: 'File deleted.' };
}