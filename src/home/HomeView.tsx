import HeroSection from "./components/HeroSection";
import ProductHighlight from "./components/ProductHighlight";
import StatsSection from "./components/StatsSection";
import TestimonialSection from "./components/TestimonialSection";

const HomeView: React.FC = () => {
  return (
    <div className="font-Montserrat">
      <div>
        <HeroSection />
      </div>
      <div>
        <ProductHighlight />
      </div>
      <div>
        <StatsSection />
      </div>
      <div>
        <TestimonialSection />
      </div>
    </div>
  );
};

export default HomeView;
