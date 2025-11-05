'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Helper function to get and format product data
function getProductData(formData: FormData) {
  const price = parseFloat(formData.get('price') as string);
  const salePrice = formData.get('sale_price') ? parseFloat(formData.get('sale_price') as string) : null;
  const stock = formData.get('stock') ? parseInt(formData.get('stock') as string) : 0;
  
  // Helper to split comma-separated strings into arrays
  const stringToArray = (str: string | null) => {
    if (!str) return [];
    return str.split(',').map(s => s.trim()).filter(Boolean);
  };

  return {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    status: formData.get('status') as string,
    price: price,
    sale_price: salePrice,
    stock: stock,
    sku: formData.get('sku') as string,
    sizes: stringToArray(formData.get('sizes') as string),
    colors: stringToArray(formData.get('colors') as string),
    images: stringToArray(formData.get('images') as string),
    featured: formData.get('featured') === 'on', // 1. ADDED THIS
  };
}

export async function createProduct(previousState: any, formData: FormData) {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to create a product.' };
  }

  const productData = getProductData(formData);

  if (!productData.name || !productData.slug || !productData.price) {
    return { error: 'Name, Slug, and Price are required.' };
  }

  const { error } = await supabase.from('products').insert([productData]);

  if (error) {
    console.error('Error creating product:', error);
    return { error: 'Failed to create product. ' + error.message };
  }

  revalidatePath('/admin/products');
  revalidatePath('/store');
  revalidatePath('/'); // Revalidate homepage
  redirect('/admin/products');
}

export async function updateProduct(previousState: any, formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = formData.get('id') as string;

  if (!id) {
    return { error: 'Product ID is missing.' };
  }

  const productData = getProductData(formData);

  const { error } = await supabase
    .from('products')
    .update({
      ...productData, // This now includes the 'featured' field
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating product:', error);
    return { error: 'Failed to update product. ' + error.message };
  }

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/edit/${id}`);
  revalidatePath(`/store/${productData.slug}`);
  revalidatePath('/'); 
  redirect('/admin/products');
}

export async function deleteProduct(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const id = formData.get('id') as string;

  if (!id) {
    throw new Error('Product ID is missing.');
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product. ' + error.message);
  }

  revalidatePath('/admin/products');
  revalidatePath('/store');
  revalidatePath('/'); 
  redirect('/admin/products');
}