import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ApiConfig from "../lib/ApiConfig";
import { ArrowLeft, Trash2, Minus, Plus, ShoppingBag, Tag } from "lucide-react";
import debounce from "lodash.debounce";
import { getImageUrl } from "../lib/ImageUrl";

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
  produk: Product;
  price: string;
  product_name: string;
  product_image: string;
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
    const calculatedTotal = calculatedSubtotal * 1.11;
    return { subtotal: calculatedSubtotal, total: calculatedTotal };
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

  const handleRemoveItem = async (itemId: number) => {
    // Optimistic UI Update: Remove item from state immediately
    const originalCart = cart;
    setCart((prevCart) => {
      if (!prevCart) return null;
      return {
        ...prevCart,
        items: prevCart.items.filter((item) => item.id !== itemId),
      };
    });

    try {
      const token = localStorage.getItem("access_token");
      await ApiConfig.delete(`/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Failed to remove item:", error);
      // Revert state if API call fails
      setCart(originalCart);
      // You can also show a notification here
    }
  };

  const debouncedUpdateQuantity = useMemo(
    () =>
      debounce(async (itemId: number, quantity: number) => {
        try {
          const token = localStorage.getItem("access_token");
          await ApiConfig.patch(
            `/cart/${itemId}`,
            { quantity },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          // We don't need to refetch anymore as totals are calculated locally
        } catch (error) {
          console.error("Failed to update quantity:", error);
          fetchCart(); // Revert on fail by refetching
        }
      }, 500),
    [fetchCart]
  );

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCart((prevCart) => {
      if (!prevCart) return null;
      return {
        ...prevCart,
        items: prevCart.items.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        ),
      };
    });
    debouncedUpdateQuantity(itemId, newQuantity);
  };

  if (loading) return <CartSkeleton />;
  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
        <div className="container mx-auto px-4 pt-4">
          <div className="text-center py-12 text-red-500 bg-white rounded-2xl shadow-lg max-w-md mx-auto">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold mb-2">Terjadi Kesalahan</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center p-4">
        <div className="bg-white shadow-2xl rounded-3xl px-12 py-20 flex flex-col items-center max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Keranjang Kosong
          </h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Waktunya untuk mengisi keranjang Anda dengan produk-produk menarik!
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold px-10 py-4 rounded-xl shadow-lg hover:brightness-110 transition-all transform hover:scale-105 text-lg"
          >
            Jelajahi Produk
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors bg-gray-100 hover:bg-blue-50 rounded-xl px-4 py-2"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                <span className="font-medium">Kembali</span>
              </button>
              <div className="h-8 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">
                Keranjang Belanja
              </h1>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
              <Tag className="h-4 w-4" />
              <span>
                {cart.items.length} item{cart.items.length > 1 ? "s" : ""}
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
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Items Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    Produk Pilihan Anda
                  </h2>
                  <div className="bg-white/20 rounded-full px-3 py-1">
                    <span className="text-white text-sm font-medium">
                      {cart.items.length} item{cart.items.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-100">
                {cart.items.map((item, index) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    index={index}
                    onRemove={handleRemoveItem}
                    onQuantityChange={handleQuantityChange}
                  />
                ))}
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
const CartItemRow: React.FC<{
  item: CartItem;
  index: number;
  onQuantityChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}> = ({ item, index, onQuantityChange, onRemove }) => {
  if (!item.produk) return null;

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors duration-200 group">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              src={getImageUrl(item.product_image)}
              alt={item.produk.nama}
              className="w-28 h-28 object-cover rounded-2xl shadow-md group-hover:shadow-lg transition-shadow"
            />
            <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {index + 1}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                {item.produk.nama}
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-gray-500">Harga satuan:</span>
                <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-lg">
                  Rp {Number(item.price).toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
              <button
                onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                className="px-4 py-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-l-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={item.quantity <= 1}
              >
                <Minus size={18} />
              </button>
              <span className="px-6 py-2 text-lg font-bold text-gray-800 bg-white border-l border-r border-gray-200 min-w-[60px] text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                className="px-4 py-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-r-xl"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Price and Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Total harga:</span>
              <span className="text-2xl font-bold text-blue-600">
                Rp{" "}
                {(Number(item.price) * item.quantity).toLocaleString("id-ID")}
              </span>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-3 rounded-full hover:bg-red-50 group"
              aria-label="Hapus item"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{
  subtotal: number;
  total: number;
  itemCount: number;
}> = ({ subtotal, total, itemCount }) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Ringkasan Pesanan</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Item Count */}
          <div className="flex items-center justify-center bg-gray-50 rounded-xl py-3 mb-6">
            <ShoppingBag className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-gray-700 font-medium">
              {itemCount} produk dalam keranjang
            </span>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-800">
                Rp{" "}
                {subtotal.toLocaleString("id-ID", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">PPN (11%)</span>
              <span className="text-gray-500 text-sm">Sudah termasuk</span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">
                  Total Pembayaran
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  Rp{" "}
                  {total.toLocaleString("id-ID", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg hover:brightness-110 transition-all transform hover:scale-105 text-lg"
            >
              Lanjut ke Checkout
            </button>
            <button
              onClick={() => navigate("/products")}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Tambah Produk Lain
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartSkeleton: React.FC = () => (
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen animate-pulse">
    {/* Header Skeleton */}
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-24 bg-gray-200 rounded-xl"></div>
          <div className="h-6 w-px bg-gray-300"></div>
          <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>

    {/* Content Skeleton */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items Skeleton */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gray-200 h-16"></div>
            <div className="divide-y divide-gray-100">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-6">
                  <div className="flex gap-6">
                    <div className="w-28 h-28 bg-gray-200 rounded-2xl"></div>
                    <div className="flex-1 space-y-4">
                      <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                      <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-8 w-32 bg-gray-200 rounded"></div>
                        <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
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
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gray-200 h-16"></div>
            <div className="p-6 space-y-4">
              <div className="h-12 bg-gray-100 rounded-xl"></div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-5 w-20 bg-gray-200 rounded"></div>
                  <div className="h-5 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-5 w-16 bg-gray-200 rounded"></div>
                  <div className="h-5 w-20 bg-gray-200 rounded"></div>
                </div>
                <div className="flex justify-between pt-4">
                  <div className="h-6 w-24 bg-gray-200 rounded"></div>
                  <div className="h-6 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="space-y-3 pt-4">
                <div className="h-12 bg-gray-300 rounded-xl"></div>
                <div className="h-10 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CartPage;
