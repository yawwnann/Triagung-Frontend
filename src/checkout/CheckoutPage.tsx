import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiConfig from "../lib/ApiConfig";
import {
  MapPin,
  ShoppingBag,
  AlertCircle,
  ArrowLeft,
  CreditCard,
  Plus,
  Home,
} from "lucide-react";
import type { Address } from "../profile/types";
import { getImageUrl } from "../lib/ImageUrl";
import axios from "axios";

// Definisikan tipe-tipe yang dibutuhkan
interface Product {
  id: number;
  nama: string;
  gambar: string;
}

interface CartItem {
  id: number;
  product_name: string;
  quantity: number;
  price: string;
  produk: Product;
}

interface Cart {
  items: CartItem[];
  total_amount: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();

  // State management
  const [cart, setCart] = useState<Cart | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Efek untuk memuat data saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const [cartResponse, addressResponse] = await Promise.all([
          ApiConfig.get("/cart", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          ApiConfig.get("/addresses", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!cartResponse.data?.items || cartResponse.data.items.length === 0) {
          setError("Keranjang Anda kosong. Silakan tambahkan produk.");
          setTimeout(() => navigate("/products"), 3000);
          return;
        }

        setCart(cartResponse.data);
        setAddresses(addressResponse.data);

        const primaryAddress = addressResponse.data.find(
          (addr: Address) => addr.is_default
        );
        if (primaryAddress) {
          setSelectedAddressId(primaryAddress.id);
        } else if (addressResponse.data.length > 0) {
          setSelectedAddressId(addressResponse.data[0].id);
        }
      } catch (err) {
        setError("Gagal memuat data. Coba lagi nanti.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Fungsi untuk menangani proses pemesanan
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError("Pilih alamat pengiriman terlebih dahulu.");
      return;
    }
    setIsPlacingOrder(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      const response = await ApiConfig.post(
        "/checkout",
        { address_id: selectedAddressId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { snap_token } = response.data;
      if (snap_token && window.snap) {
        window.snap.pay(snap_token, {
          onSuccess: () => navigate("/profile/orders"),
          onPending: () => navigate("/profile/orders"),
          onError: () => setError("Pembayaran gagal. Silakan coba lagi."),
          onClose: () => setIsPlacingOrder(false),
        });
      } else {
        setError("Gagal memproses pembayaran. Token tidak valid.");
        setIsPlacingOrder(false);
      }
    } catch (err) {
      let message = "Gagal membuat pesanan. Silakan coba lagi.";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        message = err.response.data.message;
      }
      setError(message);
      setIsPlacingOrder(false);
    }
  };

  // Kalkulasi total
  const subtotal = cart ? parseFloat(cart.total_amount) : 0;
  const shippingCost = 0; // Contoh, bisa dibuat dinamis
  const total = subtotal + shippingCost;

  // Render komponen skeleton saat loading
  if (loading) return <CheckoutSkeleton />;

  // Render komponen error jika ada masalah
  if (error && !cart) {
    return (
      <ErrorState
        message={error}
        onRetry={() => window.location.reload()}
        onHome={() => navigate("/")}
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <main className="max-w-7xl mx-auto pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/products")}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali Belanja
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Kolom Kiri: Detail Pengiriman dan Produk */}
          <section className="lg:col-span-7">
            {/* Pemilihan Alamat */}
            <AddressSection
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={setSelectedAddressId}
              onAddAddress={() => navigate("/profile/AddressPage")}
            />
            {/* Daftar Produk */}
            <ProductList items={cart?.items || []} />
          </section>

          {/* Kolom Kanan: Ringkasan Pesanan */}
          <section className="lg:col-span-5 mt-10 lg:mt-0">
            <OrderSummary
              subtotal={subtotal}
              shippingCost={shippingCost}
              total={total}
              onPlaceOrder={handlePlaceOrder}
              isProcessing={isPlacingOrder}
              hasAddress={!!selectedAddressId}
            />
            {error && (
              <div className="mt-4 text-red-600 text-sm text-center flex items-center justify-center">
                <AlertCircle size={16} className="mr-2" />
                {error}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

// --- Sub-Komponen untuk Checkout Page ---

const AddressSection: React.FC<{
  addresses: Address[];
  selectedAddressId: number | null;
  onSelectAddress: (id: number) => void;
  onAddAddress: () => void;
}> = ({ addresses, selectedAddressId, onSelectAddress, onAddAddress }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
    <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
      <MapPin className="mr-3 text-blue-600" size={24} />
      Alamat Pengiriman
    </h2>
    <div className="space-y-4">
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          isSelected={selectedAddressId === address.id}
          onSelect={() => onSelectAddress(address.id)}
        />
      ))}
      <button
        onClick={onAddAddress}
        className="w-full flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-all"
      >
        <Plus className="mr-2" size={18} />
        Tambah Alamat Baru
      </button>
    </div>
  </div>
);

const AddressCard: React.FC<{
  address: Address;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ address, isSelected, onSelect }) => (
  <div
    onClick={onSelect}
    className={`p-5 border rounded-xl cursor-pointer transition-all duration-300 relative ${
      isSelected
        ? "border-blue-600 ring-2 ring-blue-200 bg-blue-50/50"
        : "border-gray-200 hover:border-gray-400 bg-white"
    }`}
  >
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <p className="font-bold text-gray-900 flex items-center">
          {address.label}
          {address.is_default && (
            <span className="text-xs bg-blue-100 text-blue-800 font-medium px-2.5 py-1 rounded-full ml-3">
              Utama
            </span>
          )}
        </p>
        <p className="text-sm text-gray-700 mt-2">
          {address.recipient_name} ({address.phone})
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {`${address.address}, ${address.city}, ${address.province}`}
        </p>
      </div>
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mt-1 ${
          isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"
        }`}
      >
        {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
      </div>
    </div>
  </div>
);

const ProductList: React.FC<{ items: CartItem[] }> = ({ items }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-8">
    <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
      <ShoppingBag className="mr-3 text-blue-600" size={24} />
      Ringkasan Produk
    </h2>
    <div className="divide-y divide-gray-100">
      {items.map((item) => (
        <div key={item.id} className="flex py-5">
          <img
            src={getImageUrl(item.produk.gambar)}
            alt={item.product_name}
            className="w-20 h-20 rounded-lg object-cover mr-5"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">{item.product_name}</h3>
            <p className="text-sm text-gray-500">Jumlah: {item.quantity}</p>
          </div>
          <p className="font-semibold text-gray-800">
            Rp{Number(item.price).toLocaleString("id-ID")}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const OrderSummary: React.FC<{
  subtotal: number;
  shippingCost: number;
  total: number;
  onPlaceOrder: () => void;
  isProcessing: boolean;
  hasAddress: boolean;
}> = ({
  subtotal,
  shippingCost,
  total,
  onPlaceOrder,
  isProcessing,
  hasAddress,
}) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 sticky top-24">
    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
      Ringkasan Pesanan
    </h2>
    <div className="space-y-4">
      <div className="flex justify-between text-gray-600">
        <span>Subtotal</span>
        <span className="font-medium text-gray-900">
          Rp{subtotal.toLocaleString("id-ID")}
        </span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>Ongkos Kirim</span>
        <span className="font-medium text-gray-900">
          {shippingCost > 0
            ? `Rp${shippingCost.toLocaleString("id-ID")}`
            : "Gratis"}
        </span>
      </div>
      <div className="border-t border-dashed my-4"></div>
      <div className="flex justify-between text-lg font-bold text-gray-900">
        <span>Total</span>
        <span>Rp{total.toLocaleString("id-ID")}</span>
      </div>
    </div>
    <button
      onClick={onPlaceOrder}
      disabled={isProcessing || !hasAddress}
      className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    >
      {isProcessing ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
          Memproses...
        </>
      ) : (
        <>
          <CreditCard className="mr-3" size={20} />
          Bayar Sekarang
        </>
      )}
    </button>
  </div>
);

const CheckoutSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto pt-24 pb-16 px-4 sm:px-6 lg:px-8">
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
      <div className="lg:col-span-7">
        <div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-24 bg-gray-200 rounded-xl"></div>
            <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="flex py-4">
              <div className="w-20 h-20 rounded-lg bg-gray-200 mr-4"></div>
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-1/5"></div>
            </div>
            <div className="flex py-4">
              <div className="w-20 h-20 rounded-lg bg-gray-200 mr-4"></div>
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-1/5"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-5 mt-10 lg:mt-0">
        <div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse sticky top-24">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded-lg w-full mt-8"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ErrorState: React.FC<{
  message: string;
  onRetry: () => void;
  onHome: () => void;
}> = ({ message, onRetry, onHome }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
    <h1 className="text-2xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h1>
    <p className="text-gray-600 max-w-md">{message}</p>
    <div className="flex gap-4 mt-8">
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Coba Lagi
      </button>
      <button
        onClick={onHome}
        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
      >
        <Home size={16} className="mr-2" />
        Ke Beranda
      </button>
    </div>
  </div>
);

export default CheckoutPage;
