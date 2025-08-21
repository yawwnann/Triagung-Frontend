import React, { useState, useEffect, useCallback, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { ApiConfig, getImageUrl } from "../../shared/utils";
import type { Order } from "../../shared/types/order";
import type { AxiosResponse } from "axios";
import {
  Plus,
  ShoppingBag,
  AlertCircle,
  Clock,
  Package,
  CheckCircle,
  XCircle,
  CreditCard,
  Truck,
  Eye,
} from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Skeleton Components
const SkeletonLine: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`}></div>
);

const MyOrdersSkeleton: React.FC = () => (
  <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 mt-20">
      {/* Header Skeleton */}
      <div className="bg-gray-300 animate-pulse rounded-2xl p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <SkeletonLine className="w-48 h-8 mb-2 bg-gray-400" />
            <SkeletonLine className="w-64 h-5 mb-4 bg-gray-400" />
            <div className="flex items-center gap-4">
              <SkeletonLine className="w-24 h-4 bg-gray-400" />
              <SkeletonLine className="w-32 h-4 bg-gray-400" />
            </div>
          </div>
          <SkeletonLine className="w-40 h-12 bg-gray-400 rounded-xl" />
        </div>
      </div>

      {/* Status Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <SkeletonLine className="w-6 h-6" />
              <SkeletonLine className="w-8 h-8" />
            </div>
            <SkeletonLine className="w-full h-4" />
          </div>
        ))}
      </div>

      {/* Orders List Skeleton */}
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            {/* Order Header Skeleton */}
            <div className="bg-gray-100 border-b p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <SkeletonLine className="w-12 h-12 rounded-xl" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <SkeletonLine className="w-16 h-4" />
                      <SkeletonLine className="w-24 h-5" />
                    </div>
                    <div className="flex items-center gap-3">
                      <SkeletonLine className="w-20 h-6 rounded-full" />
                      <SkeletonLine className="w-32 h-4" />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <SkeletonLine className="w-24 h-4 mb-1" />
                  <SkeletonLine className="w-32 h-6" />
                </div>
              </div>
            </div>

            {/* Order Content Skeleton */}
            <div className="p-6">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                <div className="flex-1">
                  <SkeletonLine className="w-32 h-5 mb-4" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[...Array(3)].map((_, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border"
                      >
                        <SkeletonLine className="w-12 h-12 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <SkeletonLine className="w-full h-4" />
                          <SkeletonLine className="w-3/4 h-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3 min-w-[200px]">
                  <SkeletonLine className="w-full h-12 rounded-lg" />
                  <SkeletonLine className="w-full h-12 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

interface Product {
  id: number;
  nama: string;
  gambar: string;
}

const statusLabels: {
  [key: string]: {
    text: string;
    color: string;
    bgColor: string;
    icon: React.ComponentType<{ className?: string }>;
  };
} = {
  pending: {
    text: "Menunggu Pembayaran",
    color: "text-orange-700",
    bgColor: "bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200",
    icon: Clock,
  },
  processing: {
    text: "Diproses",
    color: "text-blue-700",
    bgColor: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200",
    icon: Package,
  },
  shipped: {
    text: "Dikirim",
    color: "text-purple-700",
    bgColor: "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200",
    icon: Truck,
  },
  completed: {
    text: "Selesai",
    color: "text-green-700",
    bgColor: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200",
    icon: CheckCircle,
  },
  cancelled: {
    text: "Dibatalkan",
    color: "text-red-700",
    bgColor: "bg-gradient-to-r from-red-50 to-pink-50 border-red-200",
    icon: XCircle,
  },
};

const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [productsMap, setProductsMap] = useState<Map<number, Product>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // State untuk modal konfirmasi
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [orderToConfirm, setOrderToConfirm] = useState<number | null>(null);

  const openConfirmModal = (orderId: number) => {
    setOrderToConfirm(orderId);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setOrderToConfirm(null);
  };

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
      fetchedOrders.forEach((order: Order) => {
        order.items.forEach((item: Order["items"][0]) => {
          productIds.add(item.product_id);
        });
      });

      if (productIds.size > 0) {
        // 3. Fetch all required products individually, in parallel
        const productPromises = Array.from(productIds).map((id: number) =>
          ApiConfig.get<Product>(`/produks/${id}`).catch((err: Error) => {
            console.error(`Gagal memuat produk dengan ID ${id}:`, err);
            return null; // Continue even if one product fails
          })
        );

        const productResponses = await Promise.all(productPromises);

        // 4. Create a map for easy lookup from successful responses
        const newProductsMap = new Map<number, Product>();
        productResponses.forEach((response: AxiosResponse<Product> | null) => {
          if (response && response.data) {
            const product = response.data;
            if (product && "id" in product) {
              newProductsMap.set(product.id, product);
            }
          }
        });
        setProductsMap(newProductsMap);
      }
    } catch (err: unknown) {
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
    return <MyOrdersSkeleton />;
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

  const handleConfirmOrderReceived = async (orderId: number) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Token tidak ditemukan. Silakan login kembali.");
        navigate("/login");
        return;
      }

      await ApiConfig.post(
        `/orders/${orderId}/confirm-received`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Tampilkan toast sukses
      toast.success("Pesanan berhasil dikonfirmasi diterima!");

      // Refresh orders to update status
      fetchOrderData();
    } catch (err: unknown) {
      console.error("Gagal mengkonfirmasi pesanan diterima:", err);

      // Tampilkan toast error
      toast.error("Gagal mengkonfirmasi pesanan diterima. Silakan coba lagi.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 mt-20">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                Pesanan Saya
              </h1>
              <p className="text-blue-100 text-lg">
                Pantau dan kelola semua pesanan Anda dengan mudah
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-100 text-sm">
                    {orders.length} pesanan total
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-100 text-sm">
                    {orders.filter((o) => o.status === "pending").length}{" "}
                    menunggu pembayaran
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              <Plus className="h-5 w-5" />
              Buat Pesanan Baru
            </button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {Object.entries(statusLabels).map(([key, val]) => {
            const count = orders.filter((o) => o.status === key).length;
            const Icon = val.icon;
            return (
              <div
                key={key}
                className={`${val.bgColor} border rounded-2xl p-6 transition-transform hover:scale-105 shadow-sm`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`h-6 w-6 ${val.color}`} />
                  <span className={`text-2xl font-bold ${val.color}`}>
                    {count}
                  </span>
                </div>
                <p className={`text-sm font-medium ${val.color}`}>{val.text}</p>
              </div>
            );
          })}
        </div>

        {/* List Pesanan */}
        {orders.length === 0 ? (
          <div className="text-center bg-white p-16 rounded-2xl shadow-xl border border-gray-100">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Belum Ada Pesanan
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Yuk, mulai berbelanja sekarang dan nikmati kemudahan transaksi di
              platform kami!
            </p>
            <button
              onClick={() => navigate("/produk")}
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              <ShoppingBag className="h-5 w-5" />
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = statusLabels[order.status];
              const StatusIcon = statusInfo?.icon || Package;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Order Header */}
                  <div
                    className={`${
                      statusInfo?.bgColor || "bg-gray-50"
                    } border-b p-6`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                          <StatusIcon
                            className={`h-6 w-6 ${
                              statusInfo?.color || "text-gray-600"
                            }`}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-gray-500">
                              Pesanan
                            </span>
                            <span className="font-bold text-gray-800 text-lg">
                              #{order.order_number}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                                statusInfo?.color || "text-gray-600"
                              } bg-white/70`}
                            >
                              <StatusIcon className="h-4 w-4" />
                              {statusInfo?.text || order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">
                          Total Pembayaran
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                          Rp
                          {parseInt(order.grand_total).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-6">
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                      {/* Product Items */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-4">
                          Produk yang Dipesan
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                            >
                              <div className="relative">
                                <img
                                  src={getImageUrl(
                                    productsMap.get(item.product_id)?.gambar ||
                                      ""
                                  )}
                                  alt={item.product_name}
                                  className="w-12 h-12 object-cover rounded-lg shadow-sm"
                                />
                                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                                  {item.quantity}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-800 text-sm truncate">
                                  {item.product_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Rp
                                  {parseFloat(item.price).toLocaleString(
                                    "id-ID"
                                  )}{" "}
                                  × {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3 min-w-[200px]">
                        <button
                          onClick={() =>
                            navigate(`/profile/orders/${order.id}`)
                          }
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                          <Eye className="h-4 w-4" />
                          Lihat Detail
                        </button>

                        {order.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                navigate(`/checkout?order=${order.id}`)
                              }
                              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                            >
                              <CreditCard className="h-4 w-4" />
                              Bayar Sekarang
                            </button>
                            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium">
                              <XCircle className="h-4 w-4" />
                              Batalkan
                            </button>
                          </>
                        )}

                        {order.status === "shipped" && (
                          <button
                            onClick={() => openConfirmModal(order.id)}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors font-medium"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Konfirmasi Diterima
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Konfirmasi */}
      <Transition appear show={isConfirmModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeConfirmModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Konfirmasi Penerimaan Pesanan
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Apakah Anda yakin ingin mengkonfirmasi penerimaan pesanan
                      dengan ID #{orderToConfirm}?
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      onClick={closeConfirmModal}
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        if (orderToConfirm) {
                          handleConfirmOrderReceived(orderToConfirm);
                        }
                        closeConfirmModal();
                      }}
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                    >
                      Konfirmasi
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <ToastContainer />
    </div>
  );
};

export default MyOrdersPage;
