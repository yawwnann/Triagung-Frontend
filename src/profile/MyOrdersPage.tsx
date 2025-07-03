import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ApiConfig from "../lib/ApiConfig";
import type { Order } from "../types/order";
import {
  // CheckCircle2,
  // XCircle,
  // Clock,
  Plus,
  ShoppingBag,
  AlertCircle,
  // Truck,
} from "lucide-react";
import { getImageUrl } from "../lib/ImageUrl";

interface Product {
  id: number;
  nama: string;
  gambar: string;
}

const statusLabels: { [key: string]: { text: string; color: string } } = {
  pending: {
    text: "Menunggu Pembayaran",
    color: "bg-orange-100 text-orange-700",
  },
  processing: { text: "Diproses", color: "bg-yellow-100 text-yellow-700" },
  completed: { text: "Selesai", color: "bg-green-100 text-green-700" },
  cancelled: { text: "Dibatalkan", color: "bg-red-100 text-red-700" },
};

const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [productsMap, setProductsMap] = useState<Map<number, Product>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchOrderData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // 1. Fetch orders
      const orderResponse = await ApiConfig.get<Order[]>("/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedOrders = orderResponse.data;
      setOrders(fetchedOrders);

      // 2. Collect all unique product IDs from orders
      const productIds = new Set<number>();
      fetchedOrders.forEach((order) => {
        order.items.forEach((item) => {
          productIds.add(item.product_id);
        });
      });

      if (productIds.size > 0) {
        // 3. Fetch all required products individually, in parallel
        const productPromises = Array.from(productIds).map((id) =>
          ApiConfig.get(`/produks/${id}`).catch((err) => {
            console.error(`Gagal memuat produk dengan ID ${id}:`, err);
            return null; // Continue even if one product fails
          })
        );

        const productResponses = await Promise.all(productPromises);

        // 4. Create a map for easy lookup from successful responses
        const newProductsMap = new Map<number, Product>();
        productResponses.forEach((response) => {
          if (response && response.data) {
            // The API might wrap the response in a 'data' object
            const product = response.data.data || response.data;
            if (product && product.id) {
              newProductsMap.set(product.id, product);
            }
          }
        });
        setProductsMap(newProductsMap);
      }
    } catch (err) {
      setError("Gagal memuat riwayat pesanan.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchOrderData();
  }, [fetchOrderData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-600">
          Terjadi Kesalahan
        </h2>
        <p className="text-gray-500 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Pesanan Saya
            </h1>
            <p className="text-gray-500 mt-1">
              Lihat status dan detail semua pesanan Anda
            </p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            <Plus className="h-5 w-5" />
            Buat Pesanan Baru
          </button>
        </div>

        {/* Ringkasan Status */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {Object.entries(statusLabels).map(([key, val]) => (
            <div
              key={key}
              className={`rounded-lg p-4 flex flex-col items-center shadow-sm ${val.color}`}
            >
              <span className="text-lg font-bold">
                {orders.filter((o) => o.status === key).length}
              </span>
              <span className="text-xs mt-1">{val.text}</span>
            </div>
          ))}
        </div>

        {/* List Pesanan */}
        {orders.length === 0 ? (
          <div className="text-center bg-white p-16 rounded-xl shadow-md ">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              Anda Belum Memiliki Pesanan
            </h3>
            <p className="mt-2 text-base text-gray-500">
              Yuk, mulai belanja dan nikmati kemudahan transaksi di toko kami!
            </p>
            <button
              onClick={() => navigate("/products")}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Belanja Sekarang
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-transform duration-200 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-500">No. Pesanan:</span>
                    <span className="font-semibold text-gray-800">
                      {order.order_number}
                    </span>
                    <span
                      className={`ml-3 px-2 py-1 rounded text-xs font-semibold ${
                        statusLabels[order.status]?.color ||
                        "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {statusLabels[order.status]?.text || order.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center mb-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2  rounded px-2 py-1 bg-gray-50"
                      >
                        <img
                          src={getImageUrl(
                            productsMap.get(item.product_id)?.gambar || ""
                          )}
                          alt={item.product_name}
                          className="w-8 h-8 object-cover rounded"
                        />
                        <span className="text-xs text-gray-700">
                          {item.product_name}
                        </span>
                        <span className="text-xs text-gray-400">
                          x{item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    Tanggal: {new Date(order.created_at).toLocaleString()}
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    Total: Rp
                    {parseInt(order.grand_total).toLocaleString("id-ID")}
                  </div>
                </div>
                <div className="flex flex-col gap-2 min-w-[150px]">
                  <button
                    onClick={() => navigate(`/profile/orders/${order.id}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    Lihat Detail
                  </button>
                  {order.status === "pending" && (
                    <button
                      onClick={() => navigate(`/checkout?order=${order.id}`)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                    >
                      Bayar Sekarang
                    </button>
                  )}
                  {order.status === "pending" && (
                    <button className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm">
                      Batalkan Pesanan
                    </button>
                  )}
                  {order.status === "processing" && (
                    <button className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm">
                      Konfirmasi Selesai
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
