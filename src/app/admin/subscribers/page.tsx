import { createServerSupabaseClient } from '@/lib/supabase/server';
import { deleteSubscriber, unsubscribeSubscriber } from './actions';
import { FileWarning, Trash2, UserX } from 'lucide-react';
import ExportButton from '@/components/admin/ExportButton'; 

// Helper function to format the date
function formatDate(isoString: string | null) {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function SubscribersPage() {
  const supabase = await createServerSupabaseClient();
  
  const { data: subscribers, error } = await supabase
    .from('subscribers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching subscribers:', error);
  }
  
  const subscriberList = subscribers || [];
  const subscribedCount = subscriberList.filter(s => s.status === 'subscribed').length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-brand-900">
            Newsletter Subscribers
          </h1>
        </div>
        
        {/* 2. ADD THE BUTTON AND WRAP CARDS */}
        <div className="flex gap-4 items-center">
          <div className="glass-card p-4 text-center">
            <p className="text-brand-600 font-medium">Total Active</p>
            <p className="text-3xl font-bold text-brand-900">{subscribedCount}</p>
          </div>
          <ExportButton subscribers={subscriberList} />
        </div>
        
      </div>
      
      {/* Subscriber List Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-brand-50 border-b border-brand-200">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-brand-700">Email</th>
              <th className="p-4 text-left text-sm font-semibold text-brand-700">Name</th>
              <th className="p-4 text-left text-sm font-semibold text-brand-700">Subscribed On</th>
              <th className="p-4 text-left text-sm font-semibold text-brand-700">Status</th>
              <th className="p-4 text-left text-sm font-semibold text-brand-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriberList.length > 0 ? (
              subscriberList.map((sub) => (
                <tr key={sub.id} className="border-b border-brand-100 hover:bg-brand-50">
                  <td className="p-4 text-brand-900 font-medium">{sub.email}</td>
                  <td className="p-4 text-brand-700">{sub.full_name || 'N/A'}</td>
                  <td className="p-4 text-brand-700">{formatDate(sub.created_at)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      sub.status === 'subscribed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    {sub.status === 'subscribed' && (
                      <form action={unsubscribeSubscriber}>
                        <input type="hidden" name="id" value={sub.id} />
                        <button title="Unsubscribe" className="p-2 text-yellow-600 hover:text-yellow-800">
                          <UserX className="w-4 h-4" />
                        </button>
                      </form>
                    )}
                    <form action={deleteSubscriber}>
                      <input type="hidden" name="id" value={sub.id} />
                      <button title="Delete (Permanent)" className="p-2 text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>
                  <div className="flex flex-col items-center justify-center p-12 text-center text-brand-600">
                    <FileWarning className="w-12 h-12 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">No Subscribers Yet</h2>
                    <p>Once users sign up for the newsletter, they will appear here.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}