'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function getProjectData(formData: FormData) {
  return {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    client_name: formData.get('client_name') as string,
    industry: formData.get('industry') as string,
    year: formData.get('year') ? parseInt(formData.get('year') as string) : null,
    status: formData.get('status') as string,
    featured: formData.get('featured') === 'on', // Checkbox value
  };
}

export async function createProject(previousState: any, formData: FormData) {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to create a project.' }; // FIX 2: Return error
  }

  const projectData = getProjectData(formData);

  if (!projectData.title || !projectData.slug) {
    return { error: 'Title and Slug are required.' }; // FIX 3: Return error
  }

  const { error } = await supabase.from('projects').insert([
    {
      ...projectData,
    },
  ]);

  if (error) {
    console.error('Error creating project:', error);
    return { error: 'Failed to create project. ' + error.message }; // FIX 4: Return error
  }

  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  redirect('/admin/projects');
}

export async function updateProject(previousState: any, formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = formData.get('id') as string;

  if (!id) {
  return { error: 'Project ID is missing.' };
}

  const projectData = getProjectData(formData);

  const { error } = await supabase
    .from('projects')
    .update({
      ...projectData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
  console.error('Error updating project:', error);
  return { error: 'Failed to update project. ' + error.message };
}

  revalidatePath('/admin/projects');
  revalidatePath(`/admin/projects/edit/${id}`);
  revalidatePath(`/projects/${projectData.slug}`); 
  redirect('/admin/projects');
}

export async function deleteProject(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = formData.get('id') as string;

  if (!id) {
    throw new Error('Project ID is missing.');
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project. ' + error.message);
  }

  revalidatePath('/admin/projects');
  redirect('/admin/projects');
}