import Hero from '@/components/sections/Hero';
import ScannerWidget from '@/components/ui/ScannerWidget';
import BenefitsSection from '@/components/sections/home/BenefitsSection';
import OurSolutionSection from '@/components/sections/home/OurSolutionSection';
import FeaturesSection from '@/components/sections/home/FeaturesSection';
import WhyChooseUs from '@/components/sections/home/WhyChooseUs';
import OurExpertise from '@/components/sections/home/OurExpertise';
import AboutSection from '@/components/sections/home/AboutSection';
import Benefits from '@/components/sections/home/Benefits';
import DigitalSolutions from '@/components/sections/home/DigitalSolutions';
import PricingPlan from '@/components/sections/home/PricingPlan';
import Process from '@/components/sections/home/Process';
import Projects from '@/components/sections/home/Projects';
import Values from '@/components/sections/home/Values';
import LetsWorkTogether from '@/components/sections/home/LetsWorkTogether';
import Faq from '@/components/sections/home/Faq';
import Testimonials from '@/components/sections/home/Testimonials';
import CallToAction from '@/components/sections/home/CallToAction';
import ContactUs from '@/components/sections/home/ContactUs';

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="pageShell">
        <div id="scanners" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#c8ff00', letterSpacing: '2px', fontWeight: 'bold' }}>
                INSTANT AI FRAUD AUDIT
              </span>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff', marginTop: '6px' }}>
                Check Before You Trust
              </h2>
            </div>
            <ScannerWidget />
          </div>
        </div>
        <BenefitsSection />
        <OurSolutionSection />
        <FeaturesSection />
        <WhyChooseUs />
        <OurExpertise />
        <AboutSection />
        <Benefits />
        <DigitalSolutions />
        <PricingPlan />
        <Process />
        <Values />
        <LetsWorkTogether />
        <Faq />
        <Testimonials />
        <CallToAction />
        <ContactUs />
      </div>
    </>
  );
}
