import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Briefcase, CheckCircle } from 'lucide-react';

// Function to format the date
function formatDate(isoString: string | null) {
  if (!isoString) return 'No date';
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Fetch the single achievement
async function getAchievement(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data: achievement, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'completed') // Only show completed ones
    .single();

  if (error || !achievement) {
    notFound(); // Triggers a 404 page
  }
  return achievement;
}

export default async function AchievementPage({ params }: { params: Promise<{ slug: string }> }) {
  // 1. Unwrap the params promise
  const clientParams = await params;
  const { slug } = clientParams;
  
  // 2. Fetch the data
  const achievement = await getAchievement(slug);
  
  const primaryImage = achievement.images?.[0] || 'https://via.placeholder.com/1200x600';

  return (
    <div className="bg-brand-50 min-h-screen">
      
      {/* Header Image (Optional) */}
      <div className="h-96 bg-gradient-to-br from-brand-800 to-brand-600 relative">
        {/* Could use the 'primaryImage' here later */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        {/* Floating Info Card */}
        <div className="glass-card p-8 md:p-10 -mt-48 relative z-10 animate-slide-up">
          <Link 
            href="/achievements" 
            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-900 font-semibold mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Achievements
          </Link>

          {/* Category */}
          <p className="text-brand-600 font-semibold mb-3">
            {achievement.industry || 'Case Study'}
          </p>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-brand-900 mb-6">
            {achievement.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-brand-700 mb-8 border-t border-b border-brand-200 py-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              <span>Client: {achievement.client_name || 'Personal'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Year: {achievement.year || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Status: {achievement.status}</span>
            </div>
          </div>
          
          {/* Main Content */}
          <div
            className="prose prose-lg max-w-none text-brand-700 leading-relaxed"
            // This will render the "Description & Results" from the admin panel
            dangerouslySetInnerHTML={{ __html: (achievement.description || 'No details provided.').replace(/\n/g, '<br />') }}
          />
        </div>

      </div>
    </div>
  );
}