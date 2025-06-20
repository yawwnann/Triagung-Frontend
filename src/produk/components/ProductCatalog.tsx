import React, { useState, useMemo, useEffect } from "react";
import { motion, easeOut } from "framer-motion";
import { Search, SlidersHorizontal, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ApiConfig from "../../lib/ApiConfig";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  details: string;
}

interface ProductCatalogProps {
  isAuthenticated: boolean;
}

type ApiProduct = {
  id: number;
  nama: string;
  deskripsi: string;
  harga: string;
  stok: number;
  gambar: string;
  kategori_produk?: { nama: string };
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

const ProductCard: React.FC<{
  product: Product;
  isAuthenticated: boolean;
}> = ({ product, isAuthenticated }) => {
  const navigate = useNavigate();
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      alert("Anda harus login untuk menambahkan produk ke keranjang!");
      return;
    }
    alert(`Produk "${product.name}" berhasil ditambahkan ke keranjang!`);
  };
  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
    >
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-black mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-blue-500 text-lg font-semibold mb-3">
          {product.price}
        </p>
        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
          {product.description}
        </p>
        <div className="mt-auto flex flex-col sm:flex-row gap-3">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg text-sm hover:bg-blue-600 transition-colors duration-300 text-center"
          >
            Lihat Detail
          </Link>
          <button
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-800 font-medium rounded-lg text-sm hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center gap-1"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={18} /> Tambah
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const SKELETON_COUNT = 8;
const PRODUCTS_PER_PAGE = 8;

const ProductCatalog: React.FC<ProductCatalogProps> = ({ isAuthenticated }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await ApiConfig.get("/produks");
        const data = response.data as ApiProduct[];
        const mapped: Product[] = data.map((item) => ({
          id: item.id,
          name: item.nama,
          description: item.deskripsi,
          price: `Rp ${Number(item.harga).toLocaleString("id-ID")}`,
          image: item.gambar,
          category: item.kategori_produk?.nama || "-",
          details: `Stok: ${item.stok}`,
        }));
        setProducts(mapped);
        const uniqueCategories: string[] = Array.from(
          new Set(mapped.map((p) => p.category))
        );
        setCategories(uniqueCategories);
      } catch {
        setError("Gagal memuat data produk. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (selectedCategory !== "Semua") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(lowercasedSearchTerm) ||
          product.description.toLowerCase().includes(lowercasedSearchTerm)
      );
    }
    return filtered;
  }, [products, selectedCategory, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );
  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when filter/search changes
  }, [selectedCategory, searchTerm]);

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className="bg-gradient-to-br from-[#FFFDF6] to-[#F5F7F8] py-16 px-4 md:px-10">
      <div className="max-w-7xl mx-auto w-full">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12 text-black"
        >
          Katalog <span className="text-blue-500">Produk</span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 p-6 bg-white rounded-xl shadow-lg border border-gray-200"
        >
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-grow w-full md:w-auto">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari produk..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative w-full md:w-auto">
              <SlidersHorizontal
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-black"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="Semua">Semua Kategori</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
        {loading ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col h-full animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200 rounded-t-xl" />
                <div className="p-5 flex flex-col flex-grow gap-3">
                  <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-5 bg-gray-100 rounded w-1/3 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-full mb-4 flex-grow" />
                  <div className="flex gap-2 mt-auto">
                    <div className="h-10 bg-gray-200 rounded w-1/2" />
                    <div className="h-10 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : error ? (
          <div className="text-center py-20 text-lg text-red-500">{error}</div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isAuthenticated={isAuthenticated}
                />
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-600 text-lg col-span-full py-10"
              >
                Produk tidak ditemukan. Coba kata kunci atau filter lain.
              </motion.p>
            )}
          </motion.div>
        )}
        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-2 rounded font-semibold border transition-colors duration-200 ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCatalog;
