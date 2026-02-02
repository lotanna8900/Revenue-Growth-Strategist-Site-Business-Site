import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { FileWarning, Package, User, PlayCircle, FileText, ExternalLink, Download } from 'lucide-react';
import { logoutUser } from '@/app/(public)/auth/actions';
import Link from 'next/link';

// Helper function to format the date
function formatDate(isoString: string | null) {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Function to format price in NGN
function formatPrice(price: number | null) {
  if (!price) return 'N/A';
  return `NGN ${new Intl.NumberFormat('en-NG').format(price)}`;
}

// Fetches the user's profile, orders, and digital access
async function getAccountData() {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth'); // Redirect to login if not authenticated
  }

  // Fetch profile, orders, and library in parallel
  const [
    { data: profile },
    { data: orders },
    { data: library }
  ] = await Promise.all([
    // 1. Profile
    supabase.from('profiles').select('full_name, email').eq('id', user.id).single(),
    
    // 2. Orders (with product names included)
    supabase
      .from('orders')
      .select('*, order_items ( id, price, products ( name ) )')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
      
    // 3. Digital Library (from user_access)
    supabase
      .from('user_access')
      .select('products ( id, name, images, type, access_url, is_digital, slug )')
      .eq('user_id', user.id)
  ]);

  return { 
    profile, 
    orders: orders || [],
    library: library ? library.map((item: any) => item.products) : [] // Flatten the structure
  };
}

export default async function AccountPage() {
  const { profile, orders, library } = await getAccountData();

  return (
    <div className="bg-brand-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-brand-900 mb-2">
            My Account
          </h1>
          <p className="text-brand-600 text-lg">
            Welcome back, {profile?.full_name || profile?.email}!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Navigation/Profile */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-2xl flex-shrink-0">
                  {profile?.full_name ? profile.full_name[0].toUpperCase() : (profile?.email ? profile.email[0].toUpperCase() : '?')}
                </div>
                <div>
                  <h2 className="font-bold text-brand-900 text-xl">{profile?.full_name || 'User'}</h2>
                  <p className="text-sm text-brand-600 break-all">{profile?.email}</p>
                </div>
              </div>
              <form action={logoutUser} className="mt-4">
                <button type="submit" className="btn-secondary w-full">
                  Logout
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Dashboard Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* SECTION 1: MY LEARNING LIBRARY */}
            <div className="glass-card p-6 border border-brand-200">
              <h2 className="text-2xl font-semibold text-brand-800 border-b border-brand-200 pb-4 mb-6 flex items-center gap-2">
                <PlayCircle className="w-6 h-6 text-brand-600" />
                My Learning Library
              </h2>

              {library.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {library.map((product: any) => (
                    <div key={product.id} className="bg-white rounded-lg border border-brand-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {/* Thumbnail */}
                      <div className="h-32 bg-brand-100 relative">
                        {product.images?.[0] ? (
                           <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-brand-300">
                            <Package className="w-10 h-10" />
                          </div>
                        )}
                        <span className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded uppercase font-bold">
                          {product.type}
                        </span>
                      </div>
                      
                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-bold text-brand-900 mb-2 line-clamp-1" title={product.name}>
                          {product.name}
                        </h3>
                        
                        {product.access_url ? (
                          <a 
                            href={product.access_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn-primary w-full text-sm py-2 flex items-center justify-center gap-2"
                          >
                            {product.type === 'download' ? <Download className="w-4 h-4"/> : <PlayCircle className="w-4 h-4"/>}
                            {product.type === 'download' ? 'Download File' : 'Start Learning'}
                          </a>
                        ) : (
                          <button disabled className="btn-secondary w-full text-sm py-2 opacity-50 cursor-not-allowed">
                            Coming Soon
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-brand-50 rounded-lg border border-dashed border-brand-200">
                  <Package className="w-10 h-10 text-brand-400 mx-auto mb-3" />
                  <p className="text-brand-700 font-medium">Your library is empty.</p>
                  <p className="text-sm text-brand-500 mb-4">Start your journey today.</p>
                  <Link href="/store" className="text-brand-600 font-semibold hover:underline">
                    Browse the Shop
                  </Link>
                </div>
              )}
            </div>

            {/* SECTION 2: ORDER HISTORY */}
            <div className="glass-card p-6">
              <h2 className="text-2xl font-semibold text-brand-800 border-b border-brand-200 pb-4 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-brand-600" />
                Order History
              </h2>
              
              <div className="space-y-4">
                {orders.length > 0 ? (
                  orders.map((order: any) => (
                    <div key={order.id} className="p-4 border border-brand-200 rounded-lg hover:bg-brand-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-2">
                        <span className="font-semibold text-brand-900">
                          Order #{order.paystack_ref?.substring(0, 8)}...
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-brand-500">
                            {formatDate(order.created_at)}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === 'completed' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      
                      {/* Order Items Summary */}
                      <div className="text-sm text-brand-600 mb-2">
                         {order.order_items?.map((item: any, index: number) => (
                           <span key={item.id}>
                             {item.products?.name}
                             {index < order.order_items.length - 1 ? ', ' : ''}
                           </span>
                         ))}
                      </div>

                      <div className="font-bold text-brand-800 text-sm">
                        Total: {formatPrice(order.amount)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-brand-600">
                    <FileWarning className="w-10 h-10 mb-3 text-brand-400" />
                    <p>No orders yet.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}