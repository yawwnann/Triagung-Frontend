import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ApiConfig from "../lib/ApiConfig";
import { ArrowLeft, ShoppingBag, Tag, Heart } from "lucide-react";

interface Product {
  id: number;
  nama: string;
  gambar: string;
  slug: string;
}

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  produk?: Product;
  price: string;
  product_name: string;
  product_image: string;
  subtotal?: string;
}

interface Cart {
  items: CartItem[];
  total_amount: string;
  grand_total: string;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { subtotal, total } = useMemo(() => {
    if (!cart?.items) {
      return { subtotal: 0, total: 0 };
    }
    const calculatedSubtotal = cart.items.reduce((acc, item) => {
      return acc + Number(item.price) * item.quantity;
    }, 0);
    // Total pembayaran = subtotal (tanpa PPN)
    return { subtotal: calculatedSubtotal, total: calculatedSubtotal };
  }, [cart?.items]);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await ApiConfig.get<Cart>("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Transform data to ensure product_image exists and items is an array
      const transformedData = {
        ...response.data,
        items: Array.isArray(response.data.items)
          ? response.data.items.map((item) => ({
              ...item,
              product_image: item.produk?.gambar || "",
            }))
          : [],
      };
      setCart(transformedData);
    } catch (err) {
      setError("Gagal memuat keranjang. Coba lagi nanti.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (loading) return <CartSkeleton />;
  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pt-20">
        <div className="container mx-auto px-4 pt-8">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Oops!</h2>
            <p className="text-red-500 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );

  if (!cart) return null;

  // Empty cart state
  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pt-20">
        <div className="container mx-auto px-4 pt-8">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Keranjang Kosong
            </h2>
            <p className="text-gray-500 mb-6">
              Belum ada produk yang ditambahkan ke keranjang
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Mulai Belanja
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm mt-40  border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-all bg-blue-50 hover:bg-blue-100 rounded-xl px-4 py-2 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                <span className="font-semibold">Kembali</span>
              </button>
              <div className="hidden sm:block h-8 w-px bg-blue-200"></div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Keranjang Belanja
                </h1>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full">
              <Tag className="h-4 w-4 text-blue-600" />
              <span className="text-blue-700 font-semibold">
                {cart.items.length} item{cart.items.length > 1 ? "" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items - Takes 8 columns on large screens */}
          <div className="lg:col-span-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-blue-100">
              {/* Items Header */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Heart className="h-6 w-6 text-white" />
                    <h2 className="text-xl font-bold text-white">
                      Produk Pilihan Anda
                    </h2>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                    <span className="text-white text-sm font-semibold">
                      {cart.items.length} produk
                    </span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-blue-50">
                {Array.isArray(cart.items) && cart.items.length > 0 ? (
                  cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-6 hover:bg-blue-50/50 transition-all duration-300 relative"
                    >
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-gray-900 mb-1">
                          {item.product_name}
                        </span>
                        <span className="text-blue-700 font-semibold">
                          Rp {Number(item.price).toLocaleString("id-ID")}
                        </span>
                        <span className="text-gray-500">
                          Jumlah: {item.quantity}
                        </span>
                      </div>
                      <div className="text-right font-bold text-blue-700">
                        Subtotal: Rp{" "}
                        {(Number(item.price) * item.quantity).toLocaleString(
                          "id-ID"
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-gray-500">Keranjang kosong</div>
                )}
              </div>
            </div>
          </div>

          {/* Summary Card - Takes 4 columns on large screens */}
          <div className="lg:col-span-4">
            <SummaryCard
              subtotal={subtotal}
              total={total}
              itemCount={cart.items.length}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Sub-components ---
const SummaryCard: React.FC<{
  subtotal: number;
  total: number;
  itemCount: number;
}> = ({ subtotal, total, itemCount }) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-24">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-blue-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 px-6 py-5">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Tag className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Ringkasan Pesanan</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Item Count */}
          <div className="flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl py-4 mb-6 border border-blue-200">
            <ShoppingBag className="h-6 w-6 text-blue-600 mr-3" />
            <span className="text-blue-800 font-bold text-lg">
              {itemCount} produk dalam keranjang
            </span>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-xl">
              <span className="text-gray-700 font-medium">Subtotal</span>
              <span className="font-bold text-gray-800 text-lg">
                Rp{" "}
                {subtotal.toLocaleString("id-ID", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
            <div className="border-t-2 border-blue-200 pt-4">
              <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-500 p-4 rounded-2xl text-white">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold">
                  Rp{" "}
                  {total.toLocaleString("id-ID", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 text-lg border border-blue-400 hover:border-blue-300"
            >
              <div className="flex items-center justify-center space-x-2">
                <ShoppingBag className="h-5 w-5" />
                <span>Lanjut ke Checkout</span>
              </div>
            </button>
            <button
              onClick={() => navigate("/products")}
              className="w-full bg-white border-2 border-blue-200 text-blue-700 font-bold py-4 rounded-2xl hover:bg-blue-50 hover:border-blue-300 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center space-x-2">
                <ShoppingBag className="h-5 w-5" />
                <span>Tambah Produk Lain</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartSkeleton: React.FC = () => (
  <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen animate-pulse">
    {/* Header Skeleton */}
    <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-28 bg-blue-200/50 rounded-xl"></div>
          <div className="h-6 w-px bg-blue-200"></div>
          <div className="h-8 w-12 bg-blue-200/50 rounded-xl"></div>
          <div className="h-8 w-48 bg-blue-200/50 rounded-lg"></div>
        </div>
      </div>
    </div>

    {/* Content Skeleton */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items Skeleton */}
        <div className="lg:col-span-8">
          <div className="bg-white/80 rounded-3xl shadow-xl overflow-hidden border border-blue-100">
            <div className="bg-blue-200/50 h-20"></div>
            <div className="divide-y divide-blue-50">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-6">
                  <div className="flex gap-6">
                    <div className="w-32 h-32 bg-blue-200/50 rounded-2xl"></div>
                    <div className="flex-1 space-y-4">
                      <div className="h-6 w-3/4 bg-blue-200/50 rounded-xl"></div>
                      <div className="h-4 w-1/3 bg-blue-200/50 rounded-lg"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-8 w-32 bg-blue-200/50 rounded-xl"></div>
                        <div className="h-12 w-36 bg-blue-200/50 rounded-2xl"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Skeleton */}
        <div className="lg:col-span-4">
          <div className="bg-white/80 rounded-3xl shadow-2xl overflow-hidden border border-blue-100">
            <div className="bg-blue-200/50 h-20"></div>
            <div className="p-6 space-y-6">
              <div className="h-16 bg-blue-100/50 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="flex justify-between p-3 bg-gray-100/50 rounded-xl">
                  <div className="h-5 w-20 bg-blue-200/50 rounded"></div>
                  <div className="h-5 w-24 bg-blue-200/50 rounded"></div>
                </div>
                <div className="flex justify-between p-3 bg-blue-100/50 rounded-xl">
                  <div className="h-5 w-16 bg-blue-200/50 rounded"></div>
                  <div className="h-5 w-20 bg-blue-200/50 rounded"></div>
                </div>
                <div className="p-4 bg-blue-200/50 rounded-2xl">
                  <div className="flex justify-between">
                    <div className="h-6 w-24 bg-white/50 rounded"></div>
                    <div className="h-6 w-32 bg-white/50 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-14 bg-blue-300/50 rounded-2xl"></div>
                <div className="h-14 bg-blue-200/50 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CartPage;
