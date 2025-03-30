import { Suspense } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <Suspense fallback={<div>Carregando...</div>}>
        <HeroSection />
      </Suspense>
      
      <Suspense fallback={<div>Carregando...</div>}>
        <AboutSection />
      </Suspense>
      
      <Suspense fallback={<div>Carregando...</div>}>
        <ServicesSection />
      </Suspense>
      
      <Suspense fallback={<div>Carregando...</div>}>
        <TestimonialsSection />
      </Suspense>
      
      <Suspense fallback={<div>Carregando...</div>}>
        <ContactSection />
      </Suspense>
      
      <Footer />
    </main>
  );
}
