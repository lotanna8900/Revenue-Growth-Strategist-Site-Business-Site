import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Briefcase, Plus, Dot, FileWarning } from 'lucide-react';
import { deleteProject } from './actions'; // Import the delete action

// Function to format the date
function formatDate(isoString: string | null) {
  if (!isoString) return 'No date';
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function ProjectsManagerPage() {
  const supabase = await createServerSupabaseClient();

  // Fetch all projects, ordered by the newest first
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, title, status, created_at, client_name')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-brand-900">
          Projects Manager
        </h1>
        <Link href="/admin/projects/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Project
        </Link>
      </div>

      {/* Project List */}
      <div className="glass-card p-6">
        <div className="space-y-4">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-200 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-brand-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-900 text-lg">
                      {project.title}
                    </h3>
                    <div className="flex items-center text-sm text-brand-600">
                      <span
                        className={`font-medium ${
                          project.status === 'completed'
                            ? 'text-green-600'
                            : 'text-blue-600'
                        }`}
                      >
                        {project.status === 'completed' ? 'Completed' : 'Ongoing'}
                      </span>
                      <Dot />
                      <span>{project.client_name || 'No client'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/admin/projects/edit/${project.id}`} // We'll build this next
                    className="font-medium text-brand-600 hover:text-brand-900"
                  >
                    Edit
                  </Link>
                  <form action={deleteProject}>
                    <input type="hidden" name="id" value={project.id} />
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
              <h2 className="text-xl font-semibold mb-2">No Projects Yet</h2>
              <p>Click "New Project" to add one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}