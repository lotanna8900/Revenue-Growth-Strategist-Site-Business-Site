'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get the currently authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('You must be logged in to create a post.');
    }

    // Get form data
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string; 
    const status = formData.get('status') as string;
    
    // Simple validation
    if (!title || !slug || !content) {
      throw new Error('Title, Slug, and Content are required.');
    }

    // Insert into the database
    const { error } = await supabase
      .from('blog_posts')
      .insert([
        {
          title: title,
          slug: slug,
          content: content,
          status: status,
          author_id: user.id, 
          published_at: status === 'published' ? new Date().toISOString() : null,
        },
      ])
      .select();

    if (error) {
      console.error('Error creating post:', error);
      throw new Error('Failed to create post. ' + error.message);
    }

    revalidatePath('/admin/blog');
    revalidatePath('/blog'); 
    redirect('/admin/blog');
  } catch (error) {
    console.error('Error in createPost:', error);
    throw error;
  }
}

export async function updatePost(formData: FormData) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get form data
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const content = formData.get('content') as string;
    const status = formData.get('status') as string;

    if (!id) {
      throw new Error('Post ID is missing.');
    }
    
    // Update the post in the database
    const { error } = await supabase
      .from('blog_posts')
      .update({
        title: title,
        slug: slug,
        content: content,
        status: status,
        published_at: status === 'published' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating post:', error);
      throw new Error('Failed to update post. ' + error.message);
    }

    // Clear cache and redirect
    revalidatePath('/admin/blog');
    revalidatePath(`/admin/blog/edit/${id}`);
    revalidatePath(`/blog/${slug}`);
    redirect('/admin/blog');
  } catch (error) {
    console.error('Error in updatePost:', error);
    throw error;
  }
}

export async function deletePost(formData: FormData) {
  try {
    const supabase = await createServerSupabaseClient();
    const id = formData.get('id') as string;

    if (!id) {
      throw new Error('Post ID is missing.');
    }

    // Delete the post
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
      throw new Error('Failed to delete post. ' + error.message);
    }

    // Clear cache and redirect
    revalidatePath('/admin/blog');
    redirect('/admin/blog');
  } catch (error) {
    console.error('Error in deletePost:', error);
    throw error;
  }
}