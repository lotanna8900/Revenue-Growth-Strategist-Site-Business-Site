import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Trophy, Plus, Dot, FileWarning } from 'lucide-react'; // Changed icon
import { deleteAchievement } from './actions'; // Renamed import

// Function to format the date
function formatDate(isoString: string | null) {
  if (!isoString) return 'No date';
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function AchievementsManagerPage() { // Renamed function
  const supabase = await createServerSupabaseClient();

  // Fetch all achievements, ordered by the newest first
  const { data: achievements, error } = await supabase // Renamed variable
    .from('achievements') // Renamed table
    .select('id, title, status, created_at, client_name')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching achievements:', error); // Renamed error
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-brand-900">
          Achievements Manager
        </h1>
        <Link href="/admin/achievements/new" className="btn-primary flex items-center gap-2"> {/* Renamed link */}
          <Plus className="w-5 h-5" />
          New Achievement
        </Link>
      </div>

      {/* Achievement List */}
      <div className="glass-card p-6">
        <div className="space-y-4">
          {achievements && achievements.length > 0 ? (
            achievements.map((achievement) => ( // Renamed variable
              <div
                key={achievement.id} // Renamed variable
                className="flex items-center justify-between p-4 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-200 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-brand-700" /> {/* Changed icon */}
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-900 text-lg">
                      {achievement.title} {/* Renamed variable */}
                    </h3>
                    <div className="flex items-center text-sm text-brand-600">
                      <span
                        className={`font-medium ${
                          achievement.status === 'completed' // Renamed variable
                            ? 'text-green-600'
                            : 'text-blue-600'
                        }`}
                      >
                        {achievement.status === 'completed' ? 'Completed' : 'Ongoing'} {/* Renamed variable */}
                      </span>
                      <Dot />
                      <span>{achievement.client_name || 'Personal'}</span> {/* Renamed variable, updated fallback */}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/achievements/edit/${achievement.id}`} // Renamed link & variable
                    className="font-medium text-brand-600 hover:text-brand-900"
                  >
                    Edit
                  </Link>
                  <form action={deleteAchievement}> {/* Renamed action */}
                    <input type="hidden" name="id" value={achievement.id} /> {/* Renamed variable */}
                    <button
                      type="submit"
                      className="font-medium text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center text-brand-600">
              <FileWarning className="w-12 h-12 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Achievements Yet</h2> {/* Renamed text */}
              <p>Click "New Achievement" to add one.</p> {/* Renamed text */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}