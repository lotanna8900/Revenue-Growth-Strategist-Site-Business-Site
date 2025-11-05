import {
  Mail,
  Linkedin,
  Instagram,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Trophy,
  CheckCircle,
  Twitter,
} from 'lucide-react';
import { TikTokIcon } from '@/components/icons/TikTokIcon';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Helper function to fetch all data in parallel
async function getAboutPageData() {
  const supabase = await createServerSupabaseClient();

  const [settingsData, achievementsData] = await Promise.all([
    supabase.from('site_settings').select('*'),
    supabase
      .from('achievements')
      .select('*')
      .eq('status', 'completed')
      .order('year', { ascending: false }),
  ]);

  // Convert settings array to a simple object
  const settings = settingsData.data?.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>) || {};

  return {
    settings,
    achievements: achievementsData.data || [],
  };
}

// NEW: Expertise List (Hard-coded for now, as requested)
const expertiseList = [
  "Revenue Growth Strategy",
  "Brand Strategy",
  "Career Clarity Coaching",
];

export default async function AboutPage() {
  const { settings, achievements } = await getAboutPageData();

  // Set defaults for text and images
  const heroTitle = settings.heroTitle || 'Success Driven Amaka';
  const heroSubtitle = settings.heroSubtitle || 'Revenue Growth Strategist';
  const aboutImageUrl = settings.aboutImageUrl || 'https://via.placeholder.com/600x800';
  const aboutStory = settings.aboutStory || '<p>My story is coming soon. Edit this in the admin settings!</p>';
  const linkedinUrl = settings.linkedinUrl || '#';
  const instagramUrl = settings.instagramUrl || '#';
  const twitterUrl = settings.twitterUrl || '#';   // ADDED
  const tiktokUrl = settings.tiktokUrl || '#';     // ADDED

  return (
    <div className="min-h-screen bg-brand-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent-gold/20 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">{heroSubtitle}</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Hi, I'm
                <span className="block mt-2 bg-gradient-to-r from-accent-gold to-accent-rose bg-clip-text text-transparent">
                  Success
                </span>
              </h1>

              <p className="text-xl md:text-2xl mb-8 text-brand-100 leading-relaxed">
                I build brands that generates millions and guide professionals that wants to achieve the same.
              </p>

              {/* Social Links (UPDATED) */}
              <div className="flex gap-4 mt-8">
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all transform hover:scale-110"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all transform hover:scale-110"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                {/* NEW ICONS */}
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all transform hover:scale-110"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all transform hover:scale-110"
                >
                  <TikTokIcon className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Right: Image (Dynamic) */}
            <div
              className="relative animate-slide-up"
              style={{ animationDelay: '200ms' }}
            >
              <div className="relative z-10">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm">
                  <img
                    src={aboutImageUrl}
                    alt="Success Driven Amaka"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* My Expertise Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="glass-card p-8 md:p-12">
          <h2 className="text-4xl font-bold text-brand-900 mb-8 text-center">
            My Expertise
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {expertiseList.map((skill) => (
              <li key={skill} className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-lg text-brand-700">{skill}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Main Content: My Story (Now Dynamic) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="glass-card p-8 md:p-12">
          <h2 className="text-4xl font-bold text-brand-900 mb-8 text-center">
            My Story
          </h2>
          <div
            className="prose prose-lg max-w-none text-brand-700 leading-relaxed"
            // We use dangerouslySetInnerHTML here, but we can switch to
            // a safer markdown renderer later if needed.
            dangerouslySetInnerHTML={{ __html: aboutStory.replace(/\n/g, '<br />') }}
          />
        </div>
      </section>

      {/* My Journey / Achievements Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-900 mb-4">
            My Journey
          </h2>
          <p className="text-xl text-brand-600 max-w-2xl mx-auto">
            Key case studies, courses, and milestones from my career.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {achievements.map((item, i) => (
            <div
              key={item.id}
              className="relative pl-8 md:pl-32 pb-12 group"
            >
              {/* Timeline line */}
              {i !== achievements.length - 1 && (
                <div className="absolute left-[15px] md:left-[60px] top-12 w-0.5 h-full bg-gradient-to-b from-brand-400 to-brand-200"></div>
              )}
              {/* Year badge */}
              <div className="absolute left-0 md:left-8 top-0 w-8 h-8 md:w-24 md:h-auto md:text-left">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-white font-bold shadow-lg md:hidden">
                  {item.year ? item.year.toString().slice(-2) : 'N/A'}
                </div>
                <div className="hidden md:block text-2xl font-bold text-brand-600">
                  {item.year || 'Ongoing'}
                </div>
              </div>
              {/* Content card */}
              <div className="glass-card p-6 hover:shadow-xl transition-all transform group-hover:-translate-y-1">
                <p className="text-brand-600 font-medium mb-3">
                  {item.industry || 'Case Study'}
                </p>
                <h3 className="text-2xl font-bold text-brand-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-brand-700 mb-4">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="glass-card p-12 text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-6 text-brand-600" />
          <h2 className="text-4xl font-bold text-brand-900 mb-4">
            Let's Build Your Revenue Engine
          </h2>
          <p className="text-xl text-brand-600 mb-8 max-w-2xl mx-auto">
            Ready to take your business to the next level?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary text-lg">
              Schedule a Consultation
            </Link>
            <Link href="/store" className="btn-secondary text-lg">
              Browse Courses & Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}