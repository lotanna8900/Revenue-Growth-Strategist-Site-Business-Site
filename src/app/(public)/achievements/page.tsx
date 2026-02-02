import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ArrowRight, Trophy, FileWarning } from 'lucide-react'; 

function AchievementCard({ achievement }: { achievement: any }) { 
  // Can use the 'images' array from the achievements table later
  const primaryImage = achievement.images?.[0] || 'https://via.placeholder.com/400x300';
  
  return (
    <Link
      href={`/achievements/${achievement.slug}`} // Renamed link
      className="glass-card group flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Achievement Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img
          src={primaryImage}
          alt={achievement.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-brand-700 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {achievement.industry || 'Personal'} 
        </div>
      </div>
      
      {/* Achievement Info */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-900 mb-3">
            {achievement.title} 
          </h2>
          <p className="text-brand-600 mb-6 text-sm font-medium">
            {/* Updated text to be more generic */}
            Context: {achievement.client_name || 'Personal'} | Year: {achievement.year || 'N/A'}
          </p>
          <p className="text-brand-700 mb-6 leading-relaxed">
            {achievement.description ? achievement.description.substring(0, 100) + '...' : 'View details.'} 
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-brand-700 font-semibold group-hover:gap-4 transition-all">
          View Details <ArrowRight className="w-5 h-5" /> 
        </div>
      </div>
    </Link>
  );
}

export default async function AchievementsPage() { 
  const supabase = await createServerSupabaseClient();

  // Fetch only 'completed' achievements
  const { data: achievements, error } = await supabase 
    .from('achievements') 
    .select('*')
    .eq('status', 'completed') // Only show completed
    .order('year', { ascending: false });

  if (error) {
    console.error('Error fetching achievements:', error); 
  }

  return (
    <div className="bg-brand-50 min-h-screen">
      {/* Header (Updated per our discussion) */}
      <section className="bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            My Journey & Achievements
          </h1>
          <p className="text-xl md:text-2xl text-brand-100 max-w-3xl mx-auto">
            A look at the projects, courses, and experiences that shape my work.
          </p>
        </div>
      </section>

      {/* Achievement Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {achievements && achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement) => ( 
              <AchievementCard key={achievement.id} achievement={achievement} /> 
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center text-brand-600 glass-card">
            <FileWarning className="w-16 h-16 mb-6" />
            <h2 className="text-2xl font-semibold mb-4">Achievements Coming Soon</h2> 
            <p>New case studies and achievements are being added. Please check back soon!</p>
          </div>
        )}
      </section>
    </div>
  );
}