import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Order, OrderAddress } from "../types/order";
import ApiConfig from "../lib/ApiConfig";
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
import { getImageUrl } from "../lib/ImageUrl";

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
    <div className="flex items-center justify-between">
      {statuses.map((s, index) => {
        const isActive = index <= currentStatusIndex;
        return (
          <React.Fragment key={s.key}>
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                  isActive
                    ? "bg-blue-100 border-blue-500"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <s.icon
                  className={`h-6 w-6 ${
                    isActive ? "text-blue-600" : "text-gray-400"
                  }`}
                />
              </div>
              <p
                className={`mt-2 text-xs font-semibold ${
                  isActive ? "text-gray-800" : "text-gray-500"
                }`}
              >
                {s.label}
              </p>
            </div>
            {index < statuses.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 rounded ${
                  isActive ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
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
        const productPromises = Array.from(productIds).map((pid) =>
          ApiConfig.get(`/produks/${pid}`).catch(() => null)
        );
        const productResponses = await Promise.all(productPromises);
        const newProductsMap = new Map<number, Product>();
        productResponses.forEach((response) => {
          if (response && response.data) {
            const product = response.data.data || response.data;
            if (product && product.id) newProductsMap.set(product.id, product);
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
    return (
      <div className="flex justify-center items-center h-screen">Memuat...</div>
    );
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
    <div className="bg-gray-50 min-h-screen py-10 px-4 mt-20 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 font-medium mb-6 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Kembali ke Riwayat
        </button>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold uppercase text-blue-600 border-2 border-blue-500 bg-blue-50 px-4 py-2 rounded-md">
              {order.status.replace("_", " ")}
            </h1>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100">
                <Home size={16} /> Lihat Toko
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm border bg-blue-500 text-white rounded-md hover:bg-blue-600">
                <MessageSquare size={16} /> Chat
              </button>
            </div>
          </div>
          <div className="border-t my-4"></div>
          <div className="flex justify-between items-center text-sm">
            <p className="text-gray-500">
              No. Pesanan:{" "}
              <span className="text-gray-800 font-medium">
                {order.order_number}
              </span>
            </p>
            <p className="text-gray-500">
              Tanggal:{" "}
              <span className="text-gray-800 font-medium">
                {format(new Date(order.created_at), "dd MMMM yyyy", {
                  locale: localeID,
                })}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <OrderStatusTracker status={order.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Truck size={20} /> Alamat Pengiriman
              </h2>
              {address ? (
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-bold text-gray-800">
                    {address.recipient_name}
                  </p>
                  <p>{address.phone}</p>
                  <p>{`${address.address}, ${address.district}, ${address.city}, ${address.province} ${address.postal_code}`}</p>
                </div>
              ) : (
                <p>Alamat tidak tersedia.</p>
              )}
            </div>

            {order.notes && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare size={20} /> Catatan Pesanan
                </h2>
                <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-md">
                  <p className="whitespace-pre-wrap">{order.notes}</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left font-semibold p-3">Nama Produk</th>
                    <th className="text-right font-semibold p-3">Harga</th>
                    <th className="text-center font-semibold p-3">Jumlah</th>
                    <th className="text-right font-semibold p-3">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-3 flex items-center gap-3">
                        <img
                          src={getImageUrl(
                            productsMap.get(item.product_id)?.gambar
                          )}
                          alt={item.product_name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <span>{item.product_name}</span>
                      </td>
                      <td className="text-right p-3">
                        Rp{parseFloat(item.price).toLocaleString("id-ID")}
                      </td>
                      <td className="text-center p-3">{item.quantity}</td>
                      <td className="text-right font-medium p-3">
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

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ClipboardList size={20} /> Rincian Tagihan
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  Rp{parseFloat(order.total_amount).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pengiriman</span>
                <span className="font-medium">
                  Rp{parseFloat(order.shipping_cost).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="border-t my-2"></div>
              <div className="flex justify-between font-bold text-base">
                <span>Total Pembayaran</span>
                <span>
                  Rp{parseFloat(order.grand_total).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
            {payment && (
              <>
                <div className="border-t my-4"></div>
                <h3 className="font-semibold mb-2">Metode Pembayaran</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-bold text-gray-800">
                    {payment.payment_type?.replace("_", " ")}
                  </p>
                  <p>{payment.bank_name}</p>
                  <p>No. Rek: {payment.account_number}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
