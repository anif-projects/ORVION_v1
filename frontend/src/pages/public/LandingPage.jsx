import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants } from '../../utils/animations';
import HeroSection from '../../components/hero/HeroSection';
import WhyOrvionSection from '../../components/why-orvion/WhyOrvionSection';
import HowItWorksSection from '../../components/how-it-works/HowItWorksSection';
import StudentSuccessStoriesSection from '../../components/testimonials/StudentSuccessStoriesSection';
import OfflineProgramsSection from '../../components/courses/OfflineProgramsSection';

export default function LandingPage() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full flex flex-col items-center">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Why Orvion Section */}
      <WhyOrvionSection />

      {/* 3. Featured Courses Section (Offline Classroom Programs) */}
      <section className="w-full py-[48px] sm:py-[64px] lg:py-[80px] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <OfflineProgramsSection />
        </div>
      </section>

      {/* 4. How It Works Section */}
      <HowItWorksSection />

      {/* 5. Testimonials Section */}
      <StudentSuccessStoriesSection />
    </motion.div>
  );
}
