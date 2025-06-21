import React from "react";
import ProductHeroSection from "../components/ProductHeroSection";
import ProductCatalog from "../components/ProductCatalog";
import ShoppingCartIcon from "../components/ShoppingCartIcon";
import { Toaster } from "sonner";

interface ProductViewProps {
  isAuthenticated: boolean;
  itemCount: number;
}

const ProductView: React.FC<ProductViewProps> = ({
  isAuthenticated,
  itemCount,
}) => {
  return (
    <div>
      <Toaster richColors position="top-right" />
      <ProductHeroSection />
      <ProductCatalog isAuthenticated={isAuthenticated} />
      <ShoppingCartIcon itemCount={itemCount} />
    </div>
  );
};

export default ProductView;
