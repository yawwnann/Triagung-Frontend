import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FooterSection from "../common/components/FooterSection";
import ApiConfig from "../lib/ApiConfig";
import { MapPin, ShoppingBag, AlertCircle, ArrowLeft } from "lucide-react";
import { getImageUrl } from "../lib/ImageUrl";

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
  grand_total: string;
}

interface Address {
  id: number;
  label: string;
  recipient_name: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  province: string;
  postal_code: string;
  is_default: boolean;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState<Cart | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const cartData = cartResponse.data;
        const addressesData = addressResponse.data;

        if (!cartData || !cartData.items || cartData.items.length === 0) {
          setError(
            "Keranjang Anda kosong. Silakan tambahkan produk terlebih dahulu."
          );
          setTimeout(() => navigate("/products"), 3000);
          return;
        }

        setCart(cartData);
        setAddresses(addressesData);

        const primaryAddress = addressesData.find(
          (addr: Address) => addr.is_default
        );
        if (primaryAddress) {
          setSelectedAddressId(primaryAddress.id);
        } else if (addressesData.length > 0) {
          setSelectedAddressId(addressesData[0].id);
        }
      } catch (err) {
        setError("Gagal memuat data checkout. Silakan coba lagi.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      alert("Silakan pilih alamat pengiriman terlebih dahulu.");
      return;
    }

    console.log(
      "Placing order with address ID:",
      selectedAddressId,
      "and cart:",
      cart
    );
    alert("Fungsi pemesanan belum diimplementasikan.");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Memuat data checkout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Terjadi Kesalahan
        </h1>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const subtotal = cart ? parseFloat(cart.total_amount) : 0;
  const shippingCost = 0;
  const total = subtotal + shippingCost;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto mt-28 mb-16 px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Kembali
          </button>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Checkout</h1>
        <div className="lg:grid lg:grid-cols-3 lg:gap-x-12">
          {/* Left Column: Address and Items */}
          <div className="lg:col-span-2">
            {/* Address Selection */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <MapPin className="mr-3 text-blue-600" />
                Pilih Alamat Pengiriman
              </h2>
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => setSelectedAddressId(address.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedAddressId === address.id
                        ? "border-blue-600 ring-2 ring-blue-200 bg-blue-50"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-800">
                          {address.label}{" "}
                          {address.is_default && (
                            <span className="text-xs bg-blue-100 text-blue-800 font-medium px-2 py-0.5 rounded-full ml-2">
                              Utama
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.recipient_name} ({address.phone})
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {`${address.address}, ${address.district}, ${address.city}, ${address.province}, ${address.postal_code}`}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedAddressId === address.id
                            ? "bg-blue-600 border-blue-600"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedAddressId === address.id && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {addresses.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-2">
                      Anda belum memiliki alamat.
                    </p>
                    <button
                      onClick={() => navigate("/profile/addresses")}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      + Tambah Alamat Baru
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <ShoppingBag className="mr-3 text-blue-600" />
                Ringkasan Pesanan
              </h2>
              <div className="space-y-4">
                {cart?.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={getImageUrl(item.produk?.gambar)}
                      alt={item.product_name}
                      className="w-20 h-20 rounded-lg object-cover bg-gray-100"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800">
                        {item.product_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x Rp{" "}
                        {parseFloat(item.price).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-800">
                      Rp{" "}
                      {(item.quantity * parseFloat(item.price)).toLocaleString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-28">
              <h2 className="text-xl font-bold mb-4">Total Belanja</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkos Kirim</span>
                  <span>
                    {shippingCost > 0
                      ? `Rp ${shippingCost.toLocaleString("id-ID")}`
                      : "Dihitung nanti"}
                  </span>
                </div>
                <div className="border-t border-gray-200 my-3"></div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>Rp {total.toLocaleString("id-ID")}</span>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={!selectedAddressId || addresses.length === 0}
                className="w-full bg-blue-600 text-white font-bold py-3 mt-6 rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Buat Pesanan
              </button>
            </div>
          </div>
        </div>
      </main>
      <FooterSection />
    </div>
  );
};

export default CheckoutPage;
