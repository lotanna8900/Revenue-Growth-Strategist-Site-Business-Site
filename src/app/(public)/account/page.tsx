import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { FileWarning, Package, User } from 'lucide-react';
import { logoutUser } from '@/app/(public)/auth/actions';

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

// Fetches the user's profile and orders
async function getAccountData() {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    notFound();
  }

  // Fetch profile and orders in parallel
  const [
    { data: profile },
    { data: orders }
  ] = await Promise.all([
    supabase.from('profiles').select('full_name, email').eq('id', user.id).single(),
    supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  ]);

  return { profile, orders: orders || [] };
}

export default async function AccountPage() {
  const { profile, orders } = await getAccountData();

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
                  <h2 className="font-bold text-brand-900 text-xl">{profile?.full_name || 'Registered User'}</h2>
                  <p className="text-sm text-brand-600">{profile?.email}</p>
                </div>
              </div>
              <form action={logoutUser} className="mt-4">
                <button type="submit" className="btn-secondary w-full">
                  Logout
                </button>
              </form>
            </div>
            {/* Can add a "Manage Profile" card here later */}
          </div>

          {/* Right Column: Order History */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6">
              <h2 className="text-2xl font-semibold text-brand-800 border-b border-brand-200 pb-4 mb-4">
                Order History
              </h2>
              <div className="space-y-6">
                {orders.length > 0 ? (
                  orders.map(order => (
                    <div key={order.id} className="p-4 border border-brand-200 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-brand-900">
                          Order #{order.paystack_ref.substring(0, 8)}...
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'completed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-sm text-brand-600 space-y-1">
                        <p><strong>Date:</strong> {formatDate(order.created_at)}</p>
                        <p><strong>Total:</strong> {formatPrice(order.amount)}</p>
                      </div>
                      {/* Can fetch and list 'order_items' here later */}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-center text-brand-600">
                    <FileWarning className="w-12 h-12 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
                    <p>When you purchase a course or product, it will appear here.</p>
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