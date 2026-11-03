'use client';

import { NavbarHome } from './components/NavbarHome';
import { HeroSection } from './components/HeroSection';
import { CaraKerjaSection } from './components/CaraKerjaSection';
import { PreviewDashboardSection } from './components/PreviewDashboardSection';
import { FiturLainSection } from './components/FiturLainSection';
import { FiturSection } from './components/FiturSection';
import { FaqSection } from './components/FaqSection';
import { CtaSection } from './components/CtaSection';
import { FooterHome } from './components/FooterHome';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F4F6FB] overflow-x-hidden">
      <NavbarHome />
      <HeroSection />
      <CaraKerjaSection />
      <PreviewDashboardSection />
      <FiturLainSection />
      <FiturSection />
      <FaqSection />
      <CtaSection />
      <FooterHome />
    </main>
  );
}