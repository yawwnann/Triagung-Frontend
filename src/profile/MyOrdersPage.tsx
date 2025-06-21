import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ApiConfig from "../lib/ApiConfig";
import type { Order } from "../types/order";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  ShoppingBag,
  AlertCircle,
  Truck,
} from "lucide-react";
import { getImageUrl } from "../lib/ImageUrl";

interface Product {
  id: number;
  nama: string;
  gambar: string;
}

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

  const getOrderStatusInfo = (status: string) => {
    switch (status?.toLowerCase()) {
      case "processing":
        return {
          text: "Pesanan Diproses",
          icon: <Clock className="h-4 w-4" />,
          color: "text-yellow-600",
        };
      case "shipped":
        return {
          text: "Dikirim",
          icon: <Truck className="h-4 w-4" />,
          color: "text-blue-600",
        };
      case "delivered":
        return {
          text: "Tiba di Tujuan",
          icon: <CheckCircle2 className="h-4 w-4" />,
          color: "text-green-600",
        };
      case "cancelled":
        return {
          text: "Dibatalkan",
          icon: <XCircle className="h-4 w-4" />,
          color: "text-red-600",
        };
      default:
        return {
          text: "Status Tidak Dikenal",
          icon: <AlertCircle className="h-4 w-4" />,
          color: "text-gray-500",
        };
    }
  };

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
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Riwayat Pesanan
          </h1>
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            <Plus className="h-5 w-5" />
            Buat Pesanan Baru
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center bg-white p-16 rounded-xl shadow-md border border-gray-100">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              Anda Belum Memiliki Pesanan
            </h3>
            <p className="mt-2 text-base text-gray-500">
              Semua pesanan yang Anda buat akan muncul di sini.
            </p>
            <div className="mt-8">
              <button
                onClick={() => navigate("/products")}
                type="button"
                className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Mulai Belanja Sekarang
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const orderStatusInfo = getOrderStatusInfo(order.status);
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="p-4 flex justify-between items-center border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="h-5 w-5 text-gray-600" />
                      <span className="font-bold text-gray-800">
                        Pesanan #{order.order_number}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 text-sm font-semibold ${orderStatusInfo.color}`}
                    >
                      {orderStatusInfo.icon}
                      <span>{orderStatusInfo.text}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 items-start py-4 border-b border-gray-100 last:border-b-0"
                      >
                        <img
                          src={getImageUrl(
                            productsMap.get(item.product_id)?.gambar
                          )}
                          alt={item.product_name}
                          className="w-20 h-20 bg-gray-100 rounded-md object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {item.product_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            x{item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-md font-semibold text-gray-800">
                            Rp
                            {parseFloat(item.price).toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-end items-center mb-4">
                      <span className="text-gray-600 mr-2">Total Pesanan:</span>
                      <span className="font-bold text-lg text-orange-600">
                        Rp
                        {parseFloat(order.grand_total).toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex justify-end items-center gap-3">
                      <button
                        onClick={() => {}}
                        className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Hubungi Penjual
                      </button>
                      <button
                        onClick={() => navigate(`/order/${order.id}`)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                      >
                        Lihat Rincian
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
