'use client';

import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

// Define the type for the subscriber object
type Subscriber = {
  id: string;
  email: string;
  full_name: string | null;
  status: string;
  created_at: string;
};

export default function ExportButton({ subscribers }: { subscribers: Subscriber[] }) {
  const [loading, setLoading] = useState(false);

  const exportToCSV = () => {
    setLoading(true);

    // 1. Filter for only active subscribers
    const activeSubscribers = subscribers.filter(s => s.status === 'subscribed');

    // 2. Define CSV headers
    const headers = 'email,full_name,status,subscribed_at\n';

    // 3. Convert JSON to CSV string
    const csvRows = activeSubscribers.map(sub => {
      const email = sub.email;
      // Ensure names with commas are wrapped in quotes
      const name = sub.full_name ? `"${sub.full_name}"` : '""';
      const status = sub.status;
      const date = new Date(sub.created_at).toLocaleDateString('en-US');
      return [email, name, status, date].join(',');
    }).join('\n');

    const csvContent = headers + csvRows;

    // 4. Create a Blob and URL for the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // 5. Trigger the download
    link.setAttribute('href', url);
    link.setAttribute('download', 'subscribers_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setLoading(false);
  };

  return (
    <button
      onClick={exportToCSV}
      disabled={loading}
      className="btn-secondary flex items-center gap-2"
    >
      <Download className="w-5 h-5" />
      {loading ? 'Exporting...' : 'Export as CSV'}
    </button>
  );
}