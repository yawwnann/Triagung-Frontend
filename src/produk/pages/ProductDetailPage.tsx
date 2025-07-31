import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  Tag,
  Heart,
  Share2,
  Star,
  Minus,
  Plus,
  ZoomIn,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import ApiConfig from "../../lib/ApiConfig";
import Notification from "../../common/components/Notification";
import axios from "axios";

// Interface matching the API response
interface KategoriProduk {
  id: number;
  nama: string;
  slug: string;
}

interface ProductImage {
  id: number;
  url: string;
}

interface Product {
  id: number;
  nama: string;
  slug: string;
  deskripsi: string;
  harga: number;
  stok: number;
  gambar: string;
  kategori_produk: KategoriProduk;
  images?: ProductImage[]; // Optional array of additional images
}

interface Address {
  id: number;
  is_default?: boolean;
}

interface ProductDetailPageProps {
  isAuthenticated: boolean;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  isAuthenticated,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Deskripsi");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );

  const tabs = ["Deskripsi", "Ulasan"];

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("ID produk tidak valid.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await ApiConfig.get(`/produks/${id}`);
        setProduct(response.data);
        if (response.data.gambar) {
          setSelectedImage(response.data.gambar);
        }
      } catch (err) {
        setError("Gagal memuat data produk atau produk tidak ditemukan.");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;
        const res = await ApiConfig.get("/addresses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const addresses = res.data;
        const defaultAddress =
          addresses.find((a: Address) => a.is_default) || addresses[0];
        setSelectedAddressId(defaultAddress ? defaultAddress.id : null);
      } catch (err) {
        console.error("Gagal memuat alamat user:", err);
      }
    };
    if (isAuthenticated) fetchAddresses();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="bg-gray-50 font-sans pt-28 pb-24 animate-pulse">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image Gallery Skeleton */}
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="bg-gray-200 w-full aspect-square rounded-xl"></div>
                  <div className="grid grid-cols-5 gap-3">
                    <div className="bg-gray-200 aspect-square rounded-lg"></div>
                    <div className="bg-gray-200 aspect-square rounded-lg"></div>
                    <div className="bg-gray-200 aspect-square rounded-lg"></div>
                    <div className="bg-gray-200 aspect-square rounded-lg"></div>
                  </div>
                </div>
              </div>

              {/* Product Info Skeleton */}
              <div className="p-6 sm:p-8 lg:p-10 border-l border-gray-100 flex flex-col">
                <div className="flex-grow space-y-6">
                  <div className="h-10 bg-gray-200 rounded-lg w-3/4"></div>
                  <div className="h-5 bg-gray-200 rounded-lg w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-5/6"></div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 h-24"></div>
                  <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="h-14 bg-gray-300 rounded-xl w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-700 mb-4">
            Produk Tidak Ditemukan
          </p>
          <p className="text-gray-500 mb-8">
            {error || "Produk yang Anda cari tidak ada atau telah dihapus."}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="mr-2" size={20} /> Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  const rating = 4.5;
  const reviewCount = 127;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!product) return;
    if (!selectedAddressId) {
      setNotification({
        message:
          "Silakan tambahkan atau pilih alamat pengiriman terlebih dahulu.",
        type: "error",
      });
      return;
    }
    try {
      const payload = {
        product_id: product.id,
        quantity: quantity,
        address_id: selectedAddressId,
      };
      await ApiConfig.post("/cart", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setNotification({
        message: "Produk berhasil ditambahkan ke keranjang!",
        type: "success",
      });
    } catch (error) {
      console.error("Gagal menambahkan produk ke keranjang:", error);
      if (axios.isAxiosError(error)) {
        console.error(
          "Detail error Axios:",
          error.response?.data || error.message,
          error.response?.status
        );
        alert(JSON.stringify(error.response?.data || error.message));
      }
      setNotification({ message: "Gagal menambahkan produk.", type: "error" });
    }
  };

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "increase" && quantity < product.stok) {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.nama,
        text: product.deskripsi,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link berhasil disalin!");
    }
  };

  const renderStars = (ratingValue: number) => {
    const stars = [];
    const fullStars = Math.floor(ratingValue);
    for (let i = 0; i < fullStars; i++)
      stars.push(
        <Star
          fill="currentColor"
          key={`full-${i}`}
          className="text-yellow-400"
          size={16}
        />
      );
    if (ratingValue % 1 !== 0)
      stars.push(
        <Star
          fill="currentColor"
          key="half"
          className="text-yellow-400"
          size={16}
        />
      );
    const remaining = 5 - Math.ceil(ratingValue);
    for (let i = 0; i < remaining; i++)
      stars.push(
        <Star key={`empty-${i}`} className="text-gray-300" size={16} />
      );
    return stars;
  };

  const rupiah = (number: unknown) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number as number);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50  pt-28 pb-24"
    >
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="container mx-auto px-4">
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
          <span className="text-gray-800">{product.nama}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {selectedImage && (
                  <div className="relative group overflow-hidden rounded-xl shadow-inner-strong">
                    <img
                      src={selectedImage}
                      alt={product.nama}
                      className="w-full h-full aspect-square object-cover transition-transform duration-300"
                    />
                    <button
                      onClick={() => setShowImageModal(true)}
                      className="absolute top-4 right-4 bg-white/70 backdrop-blur-sm rounded-full p-3 text-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white"
                    >
                      <ZoomIn size={20} />
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-5 gap-3">
                  <button
                    onClick={() => setSelectedImage(product.gambar)}
                    className="relative aspect-square rounded-lg overflow-hidden transition-transform duration-200 hover:scale-105"
                  >
                    <img
                      src={product.gambar}
                      alt="thumbnail utama"
                      className="w-full h-full object-cover"
                    />
                    {selectedImage === product.gambar && (
                      <div className="absolute inset-0 border-2 border-blue-500 rounded-lg" />
                    )}
                  </button>
                  {product.images?.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(image.url)}
                      className="relative aspect-square rounded-lg overflow-hidden transition-transform duration-200 hover:scale-105"
                    >
                      <img
                        src={image.url}
                        alt={`thumbnail ${image.id}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedImage === image.url && (
                        <div className="absolute inset-0 border-2 border-blue-500 rounded-lg" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6 sm:p-8 lg:p-10 border-l border-gray-100 flex flex-col">
              <div className="flex-grow">
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                    {product.nama}
                  </h1>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`p-2.5 rounded-full transition-colors duration-200 ${
                        isWishlisted
                          ? "bg-red-100 text-red-500"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      <Heart
                        fill={isWishlisted ? "currentColor" : "none"}
                        size={20}
                      />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors duration-200"
                    >
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-5 text-sm">
                  <div className="flex items-center gap-1">
                    {renderStars(rating)}
                  </div>
                  <span className="text-gray-500">({reviewCount} ulasan)</span>
                  <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 font-semibold px-2.5 py-1 rounded-full">
                    <Tag size={14} /> {product.kategori_produk.nama}
                  </span>
                </div>

                <div className="my-6">
                  <p className="text-gray-500 text-base">{product.deskripsi}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 my-6">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-lg text-gray-500">Harga</span>
                      <p className="text-4xl font-bold text-blue-600">
                        {rupiah(product.harga)}
                      </p>
                    </div>
                    <p className="text-base text-green-600 font-medium">
                      Stok: {product.stok}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-base font-medium text-gray-800">
                    Jumlah:
                  </span>
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange("decrease")}
                      className="px-3.5 py-3 text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                    >
                      {" "}
                      <Minus size={16} />{" "}
                    </button>
                    <span className="px-5 text-lg font-semibold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange("increase")}
                      className="px-3.5 py-3 text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity >= product.stok}
                    >
                      {" "}
                      <Plus size={16} />{" "}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-blue-500/30 hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <ShoppingCart className="mr-3" size={20} />
                  Tambah ke Keranjang
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-2 sm:space-x-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-800"
                  } relative rounded-t-lg py-3 px-4 sm:px-6 text-sm sm:text-base font-medium transition-colors`}
                >
                  {tab === "Ulasan" ? `${tab} (${reviewCount})` : tab}
                  {activeTab === tab && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                      layoutId="underline"
                    />
                  )}
                </button>
              ))}
            </nav>
          </div>
          <div className="py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="prose max-w-none text-gray-600"
              >
                {activeTab === "Deskripsi" ? (
                  <p>{product.deskripsi}</p>
                ) : (
                  <p>Belum ada ulasan untuk produk ini.</p>
                )}
              </motion.div>
            </AnimatePresence>
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
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
          >
            {selectedImage && (
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                src={selectedImage}
                alt={product.nama}
                className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <button
              className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors"
              onClick={() => setShowImageModal(false)}
            >
              <X size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductDetailPage;
