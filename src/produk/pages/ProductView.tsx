import React from "react";
import FooterSection from "../../common/components/FooterSection";
import WhatsappButton from "../../home/components/WhatsappButton";
import ProductHeroSection from "../components/ProductHeroSection";
import ProductCatalog from "../components/ProductCatalog";

interface ProductViewProps{
    isAuthenticated : boolean;
}


const ProductView: React.FC<ProductViewProps> = ({ isAuthenticated }) => {
    return (
        <>
        <div className="font-Montserrat">
            <ProductHeroSection />
            <ProductCatalog isAuthenticated = {isAuthenticated} />
            <FooterSection />
            <WhatsappButton />
        </div>
        </>
    )
}

export default ProductView;