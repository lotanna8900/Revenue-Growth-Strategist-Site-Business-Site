import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ProductDetails from '@/components/store/ProductDetails';

// Fetch the single product
async function getProduct(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (error || !product) {
    notFound(); 
  }
  return product;
}

// Main Page Component 
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await the params promise
  const clientParams = await params;
  const { slug } = clientParams;
  
  const product = await getProduct(slug);

  return <ProductDetails product={product} />;
}