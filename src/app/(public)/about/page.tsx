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
  Calendar,
  ArrowRight,
  Award,
  Zap,
  Heart,
  BarChart3,
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

// Expertise with icons and descriptions
const expertiseList = [
  {
    icon: TrendingUp,
    title: "Revenue Growth Strategy",
    description: "Building scalable revenue engines that drive sustainable business growth"
  },
  {
    icon: Sparkles,
    title: "Brand Strategy",
    description: "Creating powerful brand identities that resonate and convert"
  },
  {
    icon: Target,
    title: "Career Clarity Coaching",
    description: "Guiding professionals to discover and achieve their true potential"
  },
];

// Stats/Impact Numbers
const impactStats = [
  { icon: TrendingUp, value: '45%', label: 'Avg Revenue Growth', color: 'from-green-600 to-emerald-700' },
  { icon: Users, value: '100+', label: 'Clients Served', color: 'from-brand-600 to-brand-700' },
  { icon: Award, value: '50+', label: 'Projects Delivered', color: 'from-accent-gold to-amber-600' },
  { icon: Trophy, value: '15+', label: 'Industry Awards', color: 'from-blue-600 to-indigo-700' },
];

// Values/Principles
const coreValues = [
  {
    icon: Heart,
    title: 'Authenticity',
    description: 'Being genuine in every interaction, whether in boardrooms or conversations.'
  },
  {
    icon: Zap,
    title: 'Excellence',
    description: 'Pursuing the highest standards in strategy, execution, and results.'
  },
  {
    icon: Users,
    title: 'Impact',
    description: 'Creating meaningful change that transforms businesses and careers.'
  },
  {
    icon: BarChart3,
    title: 'Results-Driven',
    description: 'Focused on measurable outcomes and sustainable growth.'
  }
];

export default async function AboutPage() {
  const { settings, achievements } = await getAboutPageData();

  // Set defaults
  const heroTitle = settings.heroTitle || 'Success Driven Amaka';
  const heroSubtitle = settings.heroSubtitle || 'Revenue Growth Strategist';
  const aboutImageUrl = settings.aboutImageUrl || 'https://via.placeholder.com/600x800';
  const aboutStory = settings.aboutStory || '<p>My story is coming soon. Edit this in the admin settings!</p>';
  const linkedinUrl = settings.linkedinUrl || '#';
  const instagramUrl = settings.instagramUrl || '#';
  const twitterUrl = settings.twitterUrl || '#';
  const tiktokUrl = settings.tiktokUrl || '#';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-brand-50 to-white">
      {/* Hero Section - Enhanced */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white py-24 md:py-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent-gold/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-rose/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-semibold tracking-wide">{heroSubtitle}</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Hi, I'm
                <span className="block mt-2 bg-gradient-to-r from-accent-gold via-accent-rose to-white bg-clip-text text-transparent">
                  {heroTitle.split(' ').slice(-1)[0]}
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl md:text-2xl mb-10 text-brand-100 leading-relaxed max-w-xl">
                My name is Chiamaka Success Iwuala and <b>I'm a Revenue Growth Strategist, Brand Expert and Career Clarity Coach.</b> I didn't stumble into this work - I built my way here, intentionally.
              </p>

              <p className="text-xl md:text-2xl mb-10 text-brand-100 leading-relaxed max-w-xl">
                I was supposed to be a medical doctor. That was the plan. The expectation. The " <b>right path.</b>" But somewhere between the pressure and the prestige, I realized something: this wasn't <b>MY</b> path.
              </p>

              <p>
                Keep scrolling to read my story.
              </p>

              {/* Social Links - Enhanced */}
              <div className="flex gap-4 mb-12">
                {[
                  { url: linkedinUrl, icon: Linkedin, label: 'LinkedIn' },
                  { url: instagramUrl, icon: Instagram, label: 'Instagram' },
                  { url: twitterUrl, icon: Twitter, label: 'Twitter' },
                  { url: tiktokUrl, icon: TikTokIcon, label: 'TikTok' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl group"
                  >
                    <social.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/contact" 
                  className="btn-primary bg-white text-brand-900 hover:bg-brand-50 inline-flex items-center gap-2 group"
                >
                  Work With Me 
                  <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Link>
                <Link 
                  href="/achievements" 
                  className="btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20 inline-flex items-center gap-2 group"
                >
                  View My Work 
                  <Trophy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right: Image - Enhanced */}
            <div className="relative animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="relative z-10">
                {/* Main Image */}
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm transform transition-all duration-500 hover:scale-105 hover:rotate-1">
                  <img
                    src={aboutImageUrl}
                    alt={heroTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent-gold/30 rounded-full blur-2xl"></div>
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-accent-rose/30 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section - NEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {impactStats.map((stat, i) => (
            <div 
              key={i}
              className="glass-card p-6 text-center group hover:scale-105 transition-all animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-brand-900 mb-1">{stat.value}</div>
              <div className="text-sm text-brand-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* My Expertise Section - Enhanced */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 rounded-full mb-4">
            <Target className="w-4 h-4 text-brand-600" />
            <span className="text-sm font-semibold text-brand-700">WHAT I DO</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-900 mb-4">
            My Expertise
          </h2>
          <p className="text-xl text-brand-600 max-w-2xl mx-auto">
            Three core areas where I create transformative results
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {expertiseList.map((skill, i) => (
            <div 
              key={skill.title}
              className="glass-card p-8 group hover:shadow-2xl transition-all transform hover:-translate-y-2 animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                <skill.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-brand-900 mb-3">
                {skill.title}
              </h3>
              <p className="text-brand-600 leading-relaxed">
                {skill.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* My Story Section - Enhanced */}
      <section className="bg-gradient-to-br from-brand-700 to-brand-600 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4">
              <Heart className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white">MY JOURNEY</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              My Story
            </h2>
            <p className="text-xl text-brand-100">
              How I went from aspiring medical doctor to revenue growth strategist
            </p>
          </div>

          <div className="glass-card p-8 md:p-12 bg-white/95 backdrop-blur-xl">
            <div
              className="prose prose-lg max-w-none
                prose-headings:text-brand-900 prose-headings:font-bold
                prose-p:text-brand-700 prose-p:leading-relaxed prose-p:mb-6
                prose-strong:text-brand-900 prose-strong:font-bold
                prose-a:text-brand-600 prose-a:no-underline hover:prose-a:text-brand-800
              "
              dangerouslySetInnerHTML={{ __html: aboutStory.replace(/\n/g, '<br />') }}
            />
          </div>
        </div>
      </section>

      {/* Core Values - NEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span className="text-sm font-semibold text-brand-700">PRINCIPLES</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-900 mb-4">
            What I Stand For
          </h2>
          <p className="text-xl text-brand-600 max-w-2xl mx-auto">
            The values that guide every decision and relationship
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreValues.map((value, i) => (
            <div 
              key={value.title}
              className="glass-card p-8 text-center group hover:shadow-xl transition-all transform hover:-translate-y-2 animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-brand-600 to-brand-700 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <value.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-900 mb-3">
                {value.title}
              </h3>
              <p className="text-brand-600 text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline/Achievements Section - Enhanced */}
      <section className="bg-brand-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-4 shadow-sm">
              <Calendar className="w-4 h-4 text-brand-600" />
              <span className="text-sm font-semibold text-brand-700">MILESTONES</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-900 mb-4">
              My Journey
            </h2>
            <p className="text-xl text-brand-600 max-w-2xl mx-auto">
              Key case studies, courses, and milestones from my career
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {achievements.map((item, i) => (
              <div
                key={item.id}
                className="relative pl-8 md:pl-32 pb-12 group animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Timeline line */}
                {i !== achievements.length - 1 && (
                  <div className="absolute left-[15px] md:left-[60px] top-12 w-0.5 h-full bg-gradient-to-b from-brand-400 to-brand-200"></div>
                )}
                
                {/* Year badge */}
                <div className="absolute left-0 md:left-8 top-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-white font-bold shadow-lg md:hidden">
                    {item.year ? item.year.toString().slice(-2) : 'N'}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-2xl font-bold text-brand-600 mb-1">
                      {item.year || 'Ongoing'}
                    </div>
                    {item.industry && (
                      <div className="text-sm text-brand-500 font-medium">
                        {item.industry}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Content card */}
                <Link
                  href={`/achievements/${item.slug}`}
                  className="glass-card p-8 hover:shadow-2xl transition-all transform group-hover:-translate-y-1 block bg-white"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-2xl font-bold text-brand-900 group-hover:text-brand-700 transition-colors flex-1">
                      {item.title}
                    </h3>
                    <ArrowRight className="w-6 h-6 text-brand-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all flex-shrink-0" />
                  </div>
                  
                  <p className="text-brand-600 leading-relaxed mb-4">
                    {item.description}
                  </p>
                  
                  {item.industry && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-medium md:hidden">
                      {item.industry}
                    </span>
                  )}
                </Link>
              </div>
            ))}
          </div>

          {achievements.length > 0 && (
            <div className="text-center mt-12">
              <Link 
                href="/achievements" 
                className="btn-primary text-lg inline-flex items-center gap-2 group"
              >
                View All Achievements
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="glass-card p-12 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-200/30 to-transparent rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-brand-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-brand-900 mb-4">
              Ready to Build Your Success Intentionally?
            </h2>
            <p className="text-xl text-brand-600 mb-10 max-w-2xl mx-auto">
              Whether you're an entrepreneur ready to scale or a professional seeking career clarity, I'd love to work with you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="btn-primary text-lg inline-flex items-center gap-2 group"
              >
                Schedule a Consultation
                <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              <Link 
                href="/store" 
                className="btn-secondary text-lg inline-flex items-center gap-2 group"
              >
                Browse Courses & Products
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}