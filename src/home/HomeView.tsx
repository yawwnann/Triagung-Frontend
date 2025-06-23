// HomeView.tsx
import React from "react";
// Hapus import Navbar karena sudah di-render di App.tsx
// import { Navbar } from "../common/components/Navbar";
import HeroSection from "./components/HeroSection";
import ProductHighlight from "./components/ProductHighlight";
import StatsSection from "./components/StatsSection";
import TestimonialSection from "./components/TestimonialSection";

const HomeView: React.FC = () => {
  return (
    <div className="font-Montserrat">
      <HeroSection />
      <ProductHighlight />
      <StatsSection />
      <TestimonialSection />
    </div>
  );
};

export default HomeView;
