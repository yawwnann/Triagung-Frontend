import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiConfig from "../lib/ApiConfig";
import {
  MapPin,
  ShoppingBag,
  AlertCircle,
  CreditCard,
  Plus,
  Home,
  FileText,
  CheckCircle,
  Truck,
  Package,
  User,
  Phone,
  Edit,
  Star,
} from "lucide-react";
import type { Address } from "../profile/types";
import { getImageUrl } from "../lib/ImageUrl";
import axios from "axios";
import ShippingCalculator from "./components/ShippingCalculator";

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
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<{
    cost: number;
    service: string;
    courier: string;
  } | null>(null);

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

  // Fungsi untuk handle pemilihan ongkir
  const handleShippingSelect = async (
    cost: number,
    service: string,
    courier: string
  ) => {
    setSelectedShipping({ cost, service, courier });

    try {
      const token = localStorage.getItem("access_token");
      await ApiConfig.post(
        "/shipping/update-cart",
        {
          shipping_cost: cost,
          shipping_service: service,
          shipping_courier: courier,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh cart data
      const cartResponse = await ApiConfig.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(cartResponse.data);
    } catch (err) {
      console.error("Failed to update shipping:", err);
    }
  };

  // Fungsi untuk menangani proses pemesanan
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError("Pilih alamat pengiriman terlebih dahulu.");
      return;
    }
    if (!selectedShipping) {
      setError("Pilih metode pengiriman terlebih dahulu.");
      return;
    }
    setIsPlacingOrder(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      const response = await ApiConfig.post(
        "/checkout",
        { address_id: selectedAddressId, notes },
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
  const shippingCost = selectedShipping?.cost || 0;
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
    <div className=" min-h-screen">
      {/* Header with progress indicator */}
      <div className=" sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600 mt-1">Selesaikan pembelian Anda</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  Keranjang
                </span>
              </div>
              <div className="w-8 h-0.5 bg-blue-600"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-blue-600">
                  Pembayaran
                </span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Selesai
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bagian Kiri: Detail Pesanan */}
          <div className="lg:col-span-2 space-y-6">
            {/* Alamat Pengiriman */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <MapPin className="text-white" size={18} />
                    </div>
                    Alamat Pengiriman
                  </h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-blue-600 font-medium">
                      Wajib
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <AddressSection
                  addresses={addresses}
                  selectedAddressId={selectedAddressId}
                  onSelectAddress={setSelectedAddressId}
                  onAddAddress={() =>
                    navigate("/profile/addresses?from=checkout")
                  }
                />
              </div>
            </div>

            {/* Opsi Pengiriman */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Truck className="text-white" size={18} />
                    </div>
                    Opsi Pengiriman
                  </h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-blue-600 font-medium">
                      Wajib
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ShippingCalculator
                  selectedAddressId={selectedAddressId}
                  addresses={addresses}
                  onShippingSelect={handleShippingSelect}
                  selectedShipping={selectedShipping || undefined}
                />
              </div>
            </div>

            {/* Ringkasan Keranjang */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="text-white" size={18} />
                  </div>
                  Item Pesanan ({cart?.items.length || 0})
                </h2>
              </div>
              <div className="p-6">
                {cart && <ProductList items={cart.items} />}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Subtotal Barang
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      Rp{subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Catatan Tambahan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <FileText className="text-white" size={18} />
                  </div>
                  Catatan Tambahan
                </h2>
              </div>
              <div className="p-6">
                <NotesSection notes={notes} onNotesChange={setNotes} />
              </div>
            </div>
          </div>

          {/* Bagian Kanan: Ringkasan Pembayaran */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <OrderSummary
                subtotal={subtotal}
                shippingCost={shippingCost}
                total={total}
                onPlaceOrder={handlePlaceOrder}
                isProcessing={isPlacingOrder}
                hasAddress={!!selectedAddressId}
                hasShipping={!!selectedShipping}
              />
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start shadow-sm">
                  <AlertCircle
                    className="mr-3 mt-0.5 flex-shrink-0"
                    size={20}
                  />
                  <div>
                    <p className="font-medium">Terjadi Kesalahan</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
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
  <div className="space-y-4">
    {addresses.length === 0 && (
      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Belum Ada Alamat Tersimpan
        </h3>
        <p className="text-gray-500 mb-6">
          Tambahkan alamat pengiriman untuk melanjutkan checkout
        </p>
        <button
          onClick={onAddAddress}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          <Plus className="mr-2" size={20} />
          Tambah Alamat Pertama
        </button>
      </div>
    )}
    {addresses.map((address) => (
      <AddressCard
        key={address.id}
        address={address}
        isSelected={selectedAddressId === address.id}
        onSelect={() => onSelectAddress(address.id)}
      />
    ))}
    {addresses.length > 0 && (
      <button
        onClick={onAddAddress}
        className="w-full flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
      >
        <Plus className="mr-2" size={20} />
        Tambah Alamat Baru
      </button>
    )}
  </div>
);

const AddressCard: React.FC<{
  address: Address;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ address, isSelected, onSelect }) => (
  <div
    onClick={onSelect}
    className={`group relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${
      isSelected
        ? "border-blue-600 bg-blue-50 shadow-lg ring-2 ring-blue-200"
        : "border-gray-200 hover:border-blue-300 bg-white"
    }`}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-semibold text-gray-900">{address.label}</h3>
          {address.is_default && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Star className="w-3 h-3 mr-1" />
              UTAMA
            </span>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-700">
            <User className="w-4 h-4 mr-2 text-gray-400" />
            {address.recipient_name}
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            {address.phone}
          </div>
          <div className="flex items-start text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="leading-relaxed">
              {`${address.address}, ${address.city}, ${address.province}, ${address.postal_code}`}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"
          }`}
        >
          {isSelected && (
            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
          )}
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-gray-600">
          <Edit size={14} />
        </button>
      </div>
    </div>
  </div>
);

const NotesSection: React.FC<{
  notes: string;
  onNotesChange: (notes: string) => void;
}> = ({ notes, onNotesChange }) => (
  <div className="space-y-4">
    <div className="relative">
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Contoh: Tolong dibungkus dengan rapi, atau instruksi pengiriman khusus..."
        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[100px] transition-all duration-200"
        rows={4}
        maxLength={255}
      />
      <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-white px-2 py-1 rounded-md">
        {notes.length}/255
      </div>
    </div>
  </div>
);

const ProductList: React.FC<{ items: CartItem[] }> = ({ items }) => (
  <div className="space-y-4">
    {items.map((item) => (
      <div
        key={item.id}
        className="flex items-center p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-all duration-200"
      >
        <div className="relative">
          <img
            src={getImageUrl(item.produk.gambar)}
            alt={item.product_name}
            className="w-20 h-20 rounded-lg object-cover shadow-sm"
          />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
            {item.quantity}
          </div>
        </div>
        <div className="flex-1 ml-4">
          <h3 className="font-medium text-gray-900 mb-1">
            {item.product_name}
          </h3>
          <p className="text-sm text-gray-500">Jumlah: {item.quantity} item</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-900">
            Rp{Number(item.price).toLocaleString("id-ID")}
          </p>
          <p className="text-sm text-gray-500">
            @Rp{(Number(item.price) / item.quantity).toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    ))}
  </div>
);

const OrderSummary: React.FC<{
  subtotal: number;
  shippingCost: number;
  total: number;
  onPlaceOrder: () => void;
  isProcessing: boolean;
  hasAddress: boolean;
  hasShipping: boolean;
}> = ({
  subtotal,
  shippingCost,
  total,
  onPlaceOrder,
  isProcessing,
  hasAddress,
  hasShipping,
}) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
      <h2 className="text-xl font-bold text-white">Ringkasan Pesanan</h2>
    </div>
    <div className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-700">Subtotal Barang</span>
          <span className="font-semibold text-gray-900">
            Rp{subtotal.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-700">Ongkos Kirim</span>
          <span className="font-semibold text-gray-900">
            {shippingCost > 0 ? (
              `Rp${shippingCost.toLocaleString("id-ID")}`
            ) : (
              <span className="text-gray-500 italic">Pilih pengiriman</span>
            )}
          </span>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">
              Total Pembayaran
            </span>
            <span className="text-2xl font-bold text-blue-600">
              Rp{total.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>

      {/* Status indicators */}
      <div className="mt-6 space-y-2">
        <div className="flex items-center text-sm">
          <div
            className={`w-4 h-4 rounded-full mr-2 ${
              hasAddress ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            {hasAddress && <CheckCircle className="w-4 h-4 text-white" />}
          </div>
          <span className={hasAddress ? "text-green-700" : "text-gray-500"}>
            Alamat pengiriman {hasAddress ? "dipilih" : "belum dipilih"}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <div
            className={`w-4 h-4 rounded-full mr-2 ${
              hasShipping ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            {hasShipping && <CheckCircle className="w-4 h-4 text-white" />}
          </div>
          <span className={hasShipping ? "text-green-700" : "text-gray-500"}>
            Metode pengiriman {hasShipping ? "dipilih" : "belum dipilih"}
          </span>
        </div>
      </div>

      <button
        onClick={onPlaceOrder}
        disabled={isProcessing || !hasAddress || !hasShipping}
        className={`w-full mt-6 font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center text-lg ${
          isProcessing || !hasAddress || !hasShipping
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        }`}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white mr-3"></div>
            Memproses Pesanan...
          </>
        ) : (
          <>
            <CreditCard className="mr-3" size={24} />
            Bayar Sekarang
          </>
        )}
      </button>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami
        </p>
      </div>
    </div>
  </div>
);

const CheckoutSkeleton: React.FC = () => (
  <div className=" min-h-screen">
    <div className="bg-white ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
        <div className="lg:col-span-2 space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                <div className="h-4 bg-gray-100 rounded w-1/4"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                <div className="h-4 bg-gray-100 rounded w-1/4"></div>
              </div>
              <div className="h-12 bg-blue-200 rounded-xl mt-6"></div>
            </div>
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
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
      >
        Coba Lagi
      </button>
      <button
        onClick={onHome}
        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center shadow-md"
      >
        <Home size={16} className="mr-2" />
        Ke Beranda
      </button>
    </div>
  </div>
);

export default CheckoutPage;
