import React from "react";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import VisiMisiSection from "./components/VisiMisiSection";
import JourneySection from "./components/JourneySection";

const AboutView: React.FC = () => {
  return (
    <div className="bg-gray-50">
      <HeroSection />
      <AboutSection />
      <JourneySection />
      <VisiMisiSection />
    </div>
  );
};

export default AboutView;
