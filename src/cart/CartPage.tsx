import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ApiConfig from "../lib/ApiConfig";
import FooterSection from "../common/components/FooterSection";
import { ArrowLeft, Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
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

  const fetchCart = async () => {
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

      // Transform data to ensure product_image exists
      const transformedData = {
        ...response.data,
        items: response.data.items.map((item) => ({
          ...item,
          product_image: item.produk?.gambar || "",
        })),
      };
      setCart(transformedData);
    } catch (err) {
      setError("Gagal memuat keranjang. Coba lagi nanti.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

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

  const debouncedUpdateQuantity = useCallback(
    debounce(async (itemId: number, quantity: number) => {
      const originalCart = cart;
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
        setCart(originalCart); // Revert on fail
      }
    }, 500),
    [cart]
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
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 pt-4">
          <div className="text-center py-12 text-red-500">{error}</div>
        </div>
      </div>
    );

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 pt-4">
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-xl font-bold text-gray-800">
              Keranjang Anda Kosong
            </h2>
            <p className="mt-1 text-gray-500 text-sm">
              Sepertinya Anda belum menambahkan produk apapun.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="mt-6 bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mulai Belanja
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <main className="flex-grow max-w-6xl mx-auto pt-21 pb-16 px-4 sm:px-6 lg:px-8 w-full mt-20">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Kembali
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-x-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 mb-6 lg:mb-0">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Keranjang Belanja
            </h1>
            <div className="divide-y divide-gray-200">
              {cart!.items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onRemove={handleRemoveItem}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>
          </div>
          <SummaryCard subtotal={subtotal} total={total} />
        </div>
      </main>
      <FooterSection />
    </div>
  );
};

// --- Sub-components ---
const CartItemRow: React.FC<{
  item: CartItem;
  onQuantityChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}> = ({ item, onQuantityChange, onRemove }) => {
  if (!item.produk) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-b-0">
      <img
        src={getImageUrl(item.product_image)}
        alt={item.produk.nama}
        className="w-16 h-16 object-cover rounded-md"
      />
      <div className="flex-grow min-w-0">
        <h3 className="font-semibold text-gray-800 text-sm truncate">
          {item.produk.nama}
        </h3>
        <p className="text-gray-500 text-xs mt-0.5">{`Rp ${Number(
          item.price
        ).toLocaleString("id-ID")}`}</p>
      </div>
      <div className="flex items-center border border-gray-200 rounded-md">
        <button
          onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          className="px-2 py-1.5 text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Minus size={14} />
        </button>
        <span className="px-3 text-center w-10 text-sm">{item.quantity}</span>
        <button
          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          className="px-2 py-1.5 text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>
      <p className="font-semibold w-24 text-right text-sm">{`Rp ${(
        Number(item.price) * item.quantity
      ).toLocaleString("id-ID")}`}</p>
      <button
        onClick={() => onRemove(item.id)}
        className="text-gray-400 hover:text-red-500 transition-colors p-1.5"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

const SummaryCard: React.FC<{ subtotal: number; total: number }> = ({
  subtotal,
  total,
}) => {
  const navigate = useNavigate();

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-sm p-6 sticky top-28">
        <h2 className="text-xl font-bold mb-4">Ringkasan Belanja</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{`Rp ${subtotal.toLocaleString("id-ID", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>PPN (11%)</span>
            <span>Termasuk</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2 mt-2">
            <span>Total</span>
            <span>{`Rp ${total.toLocaleString("id-ID", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}</span>
          </div>
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="w-full bg-blue-600 text-white font-bold py-3 mt-6 rounded-lg hover:bg-blue-700 transition-all"
        >
          Lanjut ke Checkout
        </button>
      </div>
    </div>
  );
};

const CartSkeleton: React.FC = () => (
  <div className="bg-gray-50 min-h-screen pt-20 pb-6 animate-pulse">
    <div className="container mx-auto px-4 pt-4">
      <div className="h-6 w-24 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-8 w-48 bg-gray-300 rounded-lg mb-6"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-3 border-b last:border-b-0"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
              <div className="flex-grow space-y-1">
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded-md"></div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="h-6 w-1/2 bg-gray-300 rounded-lg mb-3"></div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="flex justify-between pt-2 mt-2 border-t">
                <div className="h-5 w-12 bg-gray-200 rounded"></div>
                <div className="h-5 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="w-full h-10 bg-gray-300 rounded-lg mt-4"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CartPage;
