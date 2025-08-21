import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Order, OrderAddress } from "../../shared/types/order";
import { ApiConfig, getImageUrl } from "../../shared/utils";
import type { AxiosResponse } from "axios";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Handshake,
  Home,
  Package,
  Truck,
  MessageSquare,
  ClipboardList,
} from "lucide-react";

// Skeleton Components
const SkeletonLine: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`}></div>
);

const SkeletonCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 ${className}`}
  >
    {children}
  </div>
);

const OrderDetailSkeleton: React.FC = () => (
  <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen py-8 px-4 mt-20 sm:px-6 lg:px-8">
    <div className="max-w-6xl mx-auto">
      {/* Back Button Skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <SkeletonLine className="w-4 h-4" />
        <SkeletonLine className="w-32 h-4" />
      </div>

      {/* Header Card Skeleton */}
      <div className="bg-gray-300 animate-pulse rounded-2xl p-8 mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex-1">
            <SkeletonLine className="w-32 h-6 mb-4 bg-gray-400" />
            <SkeletonLine className="w-48 h-8 mb-2 bg-gray-400" />
            <SkeletonLine className="w-40 h-4 bg-gray-400" />
          </div>
          <div className="flex gap-3">
            <SkeletonLine className="w-24 h-10 bg-gray-400" />
            <SkeletonLine className="w-28 h-10 bg-gray-400" />
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-400">
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            <div>
              <SkeletonLine className="w-24 h-3 mb-2 bg-gray-400" />
              <SkeletonLine className="w-36 h-5 bg-gray-400" />
            </div>
            <div className="md:text-right">
              <SkeletonLine className="w-24 h-3 mb-2 bg-gray-400" />
              <SkeletonLine className="w-32 h-6 bg-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Tracker Skeleton */}
      <SkeletonCard className="mb-8">
        <SkeletonLine className="w-32 h-6 mb-6" />
        <div className="flex items-center justify-between">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <SkeletonLine className="w-14 h-14 rounded-full mb-3" />
              <SkeletonLine className="w-16 h-3" />
            </div>
          ))}
        </div>
      </SkeletonCard>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Address Skeleton */}
          <SkeletonCard>
            <div className="flex items-center gap-3 mb-6">
              <SkeletonLine className="w-8 h-8 rounded-lg" />
              <SkeletonLine className="w-40 h-6" />
            </div>
            <div className="space-y-3">
              <SkeletonLine className="w-full h-4" />
              <SkeletonLine className="w-3/4 h-4" />
              <SkeletonLine className="w-5/6 h-4" />
            </div>
          </SkeletonCard>

          {/* Products Table Skeleton */}
          <SkeletonCard className="p-0">
            <div className="p-6 border-b">
              <SkeletonLine className="w-32 h-6" />
            </div>
            <div className="p-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-4 border-b last:border-b-0"
                >
                  <SkeletonLine className="w-16 h-16 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <SkeletonLine className="w-3/4 h-4" />
                    <SkeletonLine className="w-1/2 h-3" />
                  </div>
                  <SkeletonLine className="w-20 h-4" />
                  <SkeletonLine className="w-8 h-8 rounded-full" />
                  <SkeletonLine className="w-24 h-4" />
                </div>
              ))}
            </div>
          </SkeletonCard>
        </div>

        {/* Sidebar Skeleton */}
        <SkeletonCard className="h-fit p-0">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <SkeletonLine className="w-8 h-8 rounded-lg" />
              <SkeletonLine className="w-32 h-6" />
            </div>
          </div>
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <SkeletonLine className="w-24 h-4" />
                <SkeletonLine className="w-20 h-4" />
              </div>
            ))}
            <div className="border-t pt-4">
              <SkeletonLine className="w-full h-12 rounded-lg" />
            </div>
          </div>
        </SkeletonCard>
      </div>
    </div>
  </div>
);

interface Product {
  id: number;
  nama: string;
  gambar: string;
}

const OrderStatusTracker: React.FC<{ status: string }> = ({ status }) => {
  const statuses = [
    { key: "created", label: "Tanggal Pemesanan", icon: CheckCircle2 },
    { key: "processing", label: "Pesanan Diproses", icon: Clock },
    { key: "shipped", label: "Pesanan Dikirim", icon: Truck },
    { key: "delivered", label: "Pesanan Diterima", icon: Handshake },
    { key: "completed", label: "Pesanan Selesai", icon: Package },
  ];

  const currentStatusIndex = statuses.findIndex((s) => s.key === status);

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 space-y-4 sm:space-y-0">
        {statuses.map((s, index) => {
          const isActive = index <= currentStatusIndex;
          const isCurrent = index === currentStatusIndex;

          return (
            <div key={s.key} className="flex flex-col items-center">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center border-3 transition-all duration-300 ${
                  isActive
                    ? isCurrent
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-green-500 border-green-500 text-white"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                <s.icon className="h-7 w-7" />
              </div>
              <p
                className={`text-xs font-semibold mt-2 transition-colors duration-300 ${
                  isActive ? "text-gray-800" : "text-gray-500"
                }`}
              >
                {s.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [address, setAddress] = useState<OrderAddress | null>(null);
  const [productsMap, setProductsMap] = useState<Map<number, Product>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = useCallback(async () => {
    if (!id) {
      setError("ID pesanan tidak valid.");
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const orderResponse = await ApiConfig.get(`/order-detail/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedOrder = orderResponse.data;
      setOrder(fetchedOrder);

      // Fetch all addresses and find the correct one
      if (fetchedOrder.address_id) {
        try {
          const allAddressesResponse = await ApiConfig.get(`/addresses`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const allAddresses =
            allAddressesResponse.data.data || allAddressesResponse.data;
          const orderAddress = allAddresses.find(
            (addr: OrderAddress) => addr.id === fetchedOrder.address_id
          );
          setAddress(orderAddress || null);
        } catch (err) {
          console.error("Failed to fetch addresses:", err);
          setAddress(null);
        }
      }

      // Fetch products
      const productIds = new Set<number>();
      fetchedOrder.items.forEach((item: { product_id: number }) =>
        productIds.add(item.product_id)
      );
      if (productIds.size > 0) {
        const productPromises = Array.from(productIds).map((pid: number) =>
          ApiConfig.get<Product>(`/produks/${pid}`).catch(() => null)
        );
        const productResponses = await Promise.all(productPromises);
        const newProductsMap = new Map<number, Product>();
        productResponses.forEach((response: AxiosResponse<Product> | null) => {
          if (response && response.data) {
            const product = response.data;
            if (product && "id" in product)
              newProductsMap.set(product.id, product);
          }
        });
        setProductsMap(newProductsMap);
      }
    } catch (err) {
      console.error("Gagal memuat detail pesanan:", err);
      setError("Gagal memuat detail pesanan atau pesanan tidak ditemukan.");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  if (loading) {
    return <OrderDetailSkeleton />;
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500">{error || "Pesanan tidak ditemukan."}</p>
      </div>
    );
  }

  const { payment_details: payment } = order;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen py-8 px-4 mt-20 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 font-medium mb-8 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Kembali ke Riwayat
        </button>

        {/* Header Card with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 rounded-2xl shadow-xl mb-8 text-white">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <Package size={20} />
                <span className="font-semibold uppercase tracking-wide">
                  {order.status.replace("_", " ")}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Detail Pesanan
              </h1>
              <p className="text-blue-100">Pesanan #{order.order_number}</p>
            </div>
            <div className="flex gap-3">
              <a
                href="/products"
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Home size={16} /> Lihat Toko
              </a>
              <a
                href="https://wa.me/6285748057838"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                <MessageSquare size={16} /> Chat Penjual
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex flex-col md:flex-row md:justify-between gap-2 text-blue-100">
              <div>
                <span className="text-xs uppercase tracking-wide">
                  Tanggal Pemesanan
                </span>
                <p className="text-white font-medium">
                  {format(new Date(order.created_at), "dd MMMM yyyy ", {
                    locale: localeID,
                  })}
                </p>
              </div>
              <div className="md:text-right">
                <span className="text-xs uppercase tracking-wide">
                  Total Pembayaran
                </span>
                <p className="text-white font-bold text-lg">
                  Rp{parseFloat(order.grand_total).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Tracker */}
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            Status Pesanan
          </h2>
          <OrderStatusTracker status={order.status} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            {/* Alamat Pengiriman */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-800">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Truck size={20} className="text-blue-600" />
                </div>
                Alamat Pengiriman
              </h2>
              {address ? (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="font-bold text-gray-800 text-lg">
                        {address.recipient_name}
                      </p>
                    </div>
                    <p className="text-gray-700 font-medium">{address.phone}</p>
                    <p className="text-gray-600 leading-relaxed">
                      {`${address.address}, ${address.district}, ${address.city}, ${address.province} ${address.postal_code}`}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">Alamat tidak tersedia.</p>
              )}
            </div>

            {/* Catatan Pesanan */}
            {order.notes && (
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-800">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <MessageSquare size={20} className="text-yellow-600" />
                  </div>
                  Catatan Pesanan
                </h2>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-100">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {order.notes}
                  </p>
                </div>
              </div>
            )}

            {/* Daftar Produk */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                <h2 className="text-xl font-bold text-gray-800">
                  Daftar Produk
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left font-semibold p-4 text-gray-700">
                        Produk
                      </th>
                      <th className="text-right font-semibold p-4 text-gray-700">
                        Harga
                      </th>
                      <th className="text-center font-semibold p-4 text-gray-700">
                        Qty
                      </th>
                      <th className="text-right font-semibold p-4 text-gray-700">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-25"
                        } hover:bg-blue-25 transition-colors`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img
                                src={getImageUrl(
                                  productsMap.get(item.product_id)?.gambar
                                )}
                                alt={item.product_name}
                                className="w-16 h-16 object-cover rounded-lg shadow-md"
                              />
                              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                                {item.quantity}
                              </div>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {item.product_name}
                              </p>
                              <p className="text-sm text-gray-500">
                                SKU: #{item.product_id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="text-right p-4 font-medium text-gray-700">
                          Rp{parseFloat(item.price).toLocaleString("id-ID")}
                        </td>
                        <td className="text-center p-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-semibold">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="text-right font-bold p-4 text-gray-800">
                          Rp
                          {(
                            parseFloat(item.price) * item.quantity
                          ).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar - Rincian Tagihan */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-fit sticky top-8">
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-2xl border-b">
              <h2 className="text-xl font-bold flex items-center gap-3 text-gray-800">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ClipboardList size={20} className="text-green-600" />
                </div>
                Rincian Tagihan
              </h2>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Subtotal Produk</span>
                  <span className="font-semibold text-gray-800">
                    Rp{parseFloat(order.total_amount).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Biaya Pengiriman</span>
                  <span className="font-semibold text-gray-800">
                    Rp{parseFloat(order.shipping_cost).toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center py-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 rounded-lg border border-blue-100">
                    <span className="font-bold text-gray-800">
                      Total Pembayaran
                    </span>
                    <span className="font-bold text-xl text-blue-600">
                      Rp{parseFloat(order.grand_total).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metode Pembayaran */}
              {payment && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-bold mb-4 text-gray-800">
                    Metode Pembayaran
                  </h3>
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-100">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="font-bold text-gray-800 capitalize">
                          {payment.payment_type?.replace("_", " ")}
                        </p>
                      </div>
                      {payment.bank_name && (
                        <p className="text-gray-700 font-medium">
                          {payment.bank_name}
                        </p>
                      )}
                      {payment.account_number && (
                        <p className="text-gray-600">
                          No. Rekening:{" "}
                          <span className="font-mono font-semibold">
                            {payment.account_number}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
