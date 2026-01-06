import { Mail, Linkedin, Instagram, Twitter } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/TikTokIcon';
import ContactForm from '@/components/contact-form'; 
import { createServerSupabaseClient } from '@/lib/supabase/server'; 
export default async function ContactPage() {
  // 1. Fetch settings (Server Side)
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from('site_settings').select('*');
  
  const settings = data?.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>) || {};

  const linkedinUrl = settings.linkedinUrl || '#';
  const instagramUrl = settings.instagramUrl || '#';
  const twitterUrl = settings.twitterUrl || '#';
  const tiktokUrl = settings.tiktokUrl || '#';

  return (
    <div className="min-h-screen bg-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-brand-900 mb-4">
            Get In Touch
          </h1>
          <p className="text-xl md:text-2xl text-brand-600 max-w-2xl mx-auto">
            Book a 35-minute Revenue Acceleration Strategy Call, where we'll identify the bottleneck preventing your business from scaling to 8-figures and outline actionable steps to overcome it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* 2. Render the Client Form here */}
          <ContactForm />

          {/* 3. Render the Server Data here */}
          <div className="space-y-8">
            <div className="glass-card p-8">
              <Mail className="w-10 h-10 text-brand-600 mb-4" />
              <h3 className="text-2xl font-semibold text-brand-900 mb-2">Email</h3>
              <a 
                href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'chiamaka@successdrivenamaka.com.ng'}`} 
                className="font-semibold text-brand-600 hover:text-brand-900"
              >
                {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'chiamaka@successdrivenamaka.com.ng'}
              </a>
            </div>

            <div className="glass-card p-8">
              <h3 className="text-2xl font-semibold text-brand-900 mb-4">
                Follow Me
              </h3>
              <div className="flex gap-4">
                {[
                    { icon: Linkedin, url: linkedinUrl },
                    { icon: Instagram, url: instagramUrl },
                    { icon: Twitter, url: twitterUrl },
                    { icon: TikTokIcon, url: tiktokUrl },
                ].map((social, i) => (
                    <a 
                        key={i} 
                        href={social.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-12 h-12 rounded-full bg-brand-100 hover:bg-brand-200 flex items-center justify-center transition-all"
                    >
                        <social.icon className="w-6 h-6 text-brand-700" />
                    </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}