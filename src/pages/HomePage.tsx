import { HeroSection } from "@/components/sections/HeroSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WhySection } from "@/components/sections/WhySection";
import { StylesSection } from "@/components/sections/StylesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { PricingPlansSection } from "@/components/sections/PricingPlansSection";
import { BookingCtaSection } from "@/components/sections/BookingCtaSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { FaqSection } from "@/components/sections/FaqSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <WhySection />
      <StylesSection />
      <TestimonialsSection />
      <TeamSection />
      <PricingPlansSection />
      <BookingCtaSection />
      <GallerySection />
      <FaqSection />
      <ContactSection />
      <SiteFooter />
    </>
  );
}
