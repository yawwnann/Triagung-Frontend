import React from "react";
import ProductHeroSection from "../components/ProductHeroSection";
import ProductCatalog from "../components/ProductCatalog";
import { Toaster } from "sonner";

interface ProductViewProps {
  isAuthenticated: boolean;
  itemCount: number;
}

const ProductView: React.FC<ProductViewProps> = ({ isAuthenticated }) => {
  return (
    <div>
      <Toaster richColors position="top-right" />
      <ProductHeroSection />
      <ProductCatalog isAuthenticated={isAuthenticated} />
    </div>
  );
};

export default ProductView;
