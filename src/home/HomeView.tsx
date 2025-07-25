// HomeView.tsx
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
// Hapus import Navbar karena sudah di-render di App.tsx
// import { Navbar } from "../common/components/Navbar";
import HeroSection from "./components/HeroSection";
import ProductHighlight from "./components/ProductHighlight";
import StatsSection from "./components/StatsSection";
import TestimonialSection from "./components/TestimonialSection";

const HomeView: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div className="font-Montserrat">
      <div data-aos="fade-up">
        <HeroSection />
      </div>
      <div data-aos="fade-up" data-aos-delay="100">
        <ProductHighlight />
      </div>
      <div data-aos="fade-up" data-aos-delay="200">
        <StatsSection />
      </div>
      <div data-aos="fade-up" data-aos-delay="300">
        <TestimonialSection />
      </div>
    </div>
  );
};

export default HomeView;
