import React, { useState, useEffect, useCallback } from "react";
import { Truck, Package, Clock, AlertCircle, CheckCircle } from "lucide-react";
import ApiConfig from "../../lib/ApiConfig";
import axios from "axios";
import type { Address } from "../../profile/types";

interface ShippingCost {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
  note?: string;
}

interface ShippingData {
  weight: number;
  costs: ShippingCost[];
}

interface ShippingCalculatorProps {
  selectedAddressId: number | null;
  addresses: Address[];
  onShippingSelect: (cost: number, service: string, courier: string) => void;
  selectedShipping?: {
    cost: number;
    service: string;
    courier: string;
  };
}

const ShippingCalculator: React.FC<ShippingCalculatorProps> = ({
  selectedAddressId,
  addresses,
  onShippingSelect,
  selectedShipping,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [couriers, setCouriers] = useState<{ [key: string]: string }>({});

  // Fetch available couriers
  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await ApiConfig.get("/shipping/couriers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCouriers(response.data.data);
      } catch (err) {
        console.error("Failed to fetch couriers:", err);
      }
    };

    fetchCouriers();
  }, []);

  // Calculate shipping when address or courier changes
  const calculateShipping = useCallback(async () => {
    if (!selectedAddressId) return;

    setLoading(true);
    setError(null);

    try {
      const selectedAddress = addresses.find(
        (addr) => addr.id === selectedAddressId
      );
      if (!selectedAddress) {
        setError("Alamat tidak ditemukan");
        return;
      }

      // Find city ID from the address
      const cityId = selectedAddress.regency_id;
      if (!cityId) {
        setError("ID kota tidak ditemukan");
        return;
      }

      const token = localStorage.getItem("access_token");
      const response = await ApiConfig.post(
        "/shipping/calculate",
        {
          destination_city_id: String(cityId),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setShippingData(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Gagal menghitung ongkir");
      } else {
        setError("Gagal menghitung ongkir");
      }
    } finally {
      setLoading(false);
    }
  }, [selectedAddressId, addresses]);

  useEffect(() => {
    if (selectedAddressId && couriers) {
      calculateShipping();
    }
  }, [selectedAddressId, couriers, calculateShipping]);

  const handleShippingSelect = (cost: ShippingCost) => {
    onShippingSelect(cost.cost, cost.service, cost.code.toUpperCase());
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatWeight = (weight: number) => {
    if (weight >= 1000) {
      return `${(weight / 1000).toFixed(1)} kg`;
    }
    return `${weight} g`;
  };

  if (!selectedAddressId) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
          <Truck className="mr-3 text-blue-600" size={24} />
          Pengiriman
        </h2>
        <div className="text-center py-8 text-gray-500">
          <Package className="mx-auto mb-3 text-gray-300" size={48} />
          <p>Pilih alamat pengiriman terlebih dahulu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
        <Truck className="mr-3 text-blue-600" size={24} />
        Pengiriman
      </h2>

      {/* Shipping Info */}
      {shippingData && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="mt-2 text-sm text-gray-600">
            <span className="font-medium">Berat:</span>{" "}
            {formatWeight(shippingData.weight)}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600">Menghitung ongkir...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <AlertCircle className="mx-auto mb-3 text-red-500" size={48} />
          <p className="text-red-600">{error}</p>
          <button
            onClick={calculateShipping}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Shipping Options */}
      {shippingData && !loading && !error && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-800 mb-3">Pilihan Layanan</h3>
          {shippingData.costs
            .slice()
            .sort((a, b) => a.cost - b.cost)
            .slice(0, 5)
            .map((cost, index) => (
              <div
                key={index}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedShipping?.service === cost.service &&
                  selectedShipping?.courier === cost.code.toUpperCase()
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleShippingSelect(cost)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-800">
                        {cost.name}{" "}
                        <span className="text-xs text-gray-500 font-normal">
                          ({cost.service})
                        </span>
                      </h4>
                      {selectedShipping?.service === cost.service &&
                        selectedShipping?.courier ===
                          cost.code.toUpperCase() && (
                          <CheckCircle className="text-blue-600" size={16} />
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {cost.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{cost.etd} hari</span>
                      </div>
                      {cost.note && (
                        <span className="text-orange-600">{cost.note}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-800">
                      {formatCurrency(cost.cost)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* No Shipping Options */}
      {shippingData &&
        shippingData.costs.length === 0 &&
        !loading &&
        !error && (
          <div className="text-center py-8">
            <Package className="mx-auto mb-3 text-gray-300" size={48} />
            <p className="text-gray-500">
              Tidak ada layanan pengiriman yang tersedia
            </p>
          </div>
        )}
    </div>
  );
};

export default ShippingCalculator;
