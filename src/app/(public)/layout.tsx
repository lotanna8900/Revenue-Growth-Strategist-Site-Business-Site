import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedLayout from '@/components/AnimatedLayout';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import MobileMenu from '@/components/MobileMenu'; // 1. IMPORT

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <>
      {/* 3. RENDER AS SIBLINGS */}
      <Navbar isLoggedIn={isLoggedIn} />
      <MobileMenu isLoggedIn={isLoggedIn} /> 
      
      <main>
        <AnimatedLayout>
          {children}
        </AnimatedLayout>
      </main>
      <Footer />
    </>
  );
}