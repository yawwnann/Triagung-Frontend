import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  Tag,
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Minus,
  Plus,
  ZoomIn,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import { products } from "../../data/ProductsData";

interface ProductDetailPageProps {
  isAuthenticated: boolean;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  isAuthenticated,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  if (!id) {
    return (
      <div className="py-10 px-4 md:px-8 lg:px-16">
        <Link
          to="/products"
          className="inline-flex items-center text-[#0260FD99] hover:text-blue-700 transition-colors duration-300 mb-4"
        >
          <ArrowLeft className="mr-2" size={20} /> Kembali ke Katalog
        </Link>
        <div className="text-center text-gray-600 py-20">
          ID Produk tidak valid atau tidak ditemukan di URL.
        </div>
      </div>
    );
  }

  const productId = parseInt(id, 10);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="py-10 px-4 md:px-8 lg:px-16">
        <Link
          to="/products"
          className="inline-flex items-center text-[#0260FD99] hover:text-blue-700 transition-colors duration-300 mb-4"
        >
          <ArrowLeft className="mr-2" size={20} /> Kembali ke Katalog
        </Link>
        <div className="text-center text-gray-600 py-20">
          Produk tidak ditemukan.
        </div>
      </div>
    );
  }

  const rating = 4.5;
  const reviewCount = 127;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      alert("Anda harus login untuk menambahkan produk ke keranjang!");
      return;
    }
    console.log(
      `Produk "${product.name}" sebanyak ${quantity} ditambahkan ke keranjang.`
    );
    alert(`Produk "${product.name}" berhasil ditambahkan ke keranjang!`);
  };

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link berhasil disalin!");
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          fill="currentColor"
          key={i}
          className="text-yellow-400"
          size={16}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          fill="currentColor"
          key="half"
          className="text-yellow-400"
          size={16}
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="text-gray-300" size={16} />
      );
    }

    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="py-10 px-4 md:px-8 lg:px-16 bg-gradient-to-r from-[#002C7400] to-[#0260FD4D] font-Montserrat min-h-screen"
    >
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-[#0260FD99]">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-[#0260FD99]">
          Produk
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{product.name}</span>
      </div>

      <Link
        to="/products"
        className="inline-flex items-center text-[#0260FD99] hover:text-blue-700 transition-colors duration-300 mb-8"
      >
        <ArrowLeft className="mr-2" size={20} /> Kembali ke Katalog
      </Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Gambar Produk */}
          <div className="space-y-4">
            <div className="relative shadow-md group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 border-4 rounded-2xl border-[#0260FD99]"
              />
              <button
                onClick={() => setShowImageModal(true)}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <ZoomIn className="text-gray-700" size={20} />
              </button>
            </div>
          </div>

          {/* Detail Produk */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-2 rounded-full transition-colors ${
                      isWishlisted
                        ? "bg-red-100 text-red-500"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Heart
                      fill={isWishlisted ? "currentColor" : "none"}
                      size={20}
                    />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {renderStars(rating)}
                </div>
                <span className="text-sm text-gray-600">
                  ({reviewCount} ulasan)
                </span>
                <div className="flex items-center">
                  <Tag className="text-gray-400 mr-1" size={14} />
                  <span className="text-sm text-gray-600">
                    {product.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-4">
              <p className="text-4xl font-bold text-black">{product.price}</p>
              <p className="text-sm text-gray-500 mt-1">
                Harga sudah termasuk PPN
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Jumlah:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange("decrease")}
                  className="p-2 hover:bg-gray-100 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("increase")}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#2e74ee] hover:bg-[#0260FD] text-white font-semibold py-4 px-6 rounded-lg shadow-md transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Tambah ke Keranjang
              </button>
              <button className="w-full bg-[#2e74ee] hover:bg-[#0260FD] text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-300">
                Beli Sekarang
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Truck className="mx-auto mb-2 text-blue-500" size={24} />
                <p className="text-xs text-gray-600">Gratis Ongkir</p>
              </div>
              <div className="text-center">
                <Shield className="mx-auto mb-2 text-blue-500" size={24} />
                <p className="text-xs text-gray-600">Garansi Resmi</p>
              </div>
              <div className="text-center">
                <RefreshCw className="mx-auto mb-2 text-blue-500" size={24} />
                <p className="text-xs text-gray-600">30 Hari Retur</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200">
          <div className="flex border-b border-gray-200">
            {["description", "details", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "description" && "Deskripsi"}
                {tab === "details" && "Detail Produk"}
                {tab === "reviews" && "Ulasan"}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === "details" && product.details && (
              <div>
                <ul className="space-y-2">
                  {product.details.split(", ").map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold">{rating}</span>
                      <div className="flex">{renderStars(rating)}</div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {reviewCount} ulasan
                    </p>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Tulis Ulasan
                  </button>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-4">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-b border-gray-200 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            U{review}
                          </div>
                          <span className="font-medium">User {review}</span>
                          <div className="flex">{renderStars(5)}</div>
                        </div>
                        <span className="text-sm text-gray-500">
                          2 hari lalu
                        </span>
                      </div>
                      <p className="text-gray-700">
                        Produk sangat bagus, sesuai dengan deskripsi. Pengiriman
                        cepat dan packaging aman.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowImageModal(false)}
          >
            <div
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2"
              >
                <X size={20} className="text-gray-700" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductDetailPage;
