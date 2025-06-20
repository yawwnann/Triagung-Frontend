import React from "react";
import type { Address } from "../types";

interface AddressListProps {
  addresses: Address[];
  loading: boolean;
  error: string | null;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onAddAddress: () => void;
  fetchAddresses: () => void;
}

const AddressList: React.FC<AddressListProps> = ({
  addresses,
  loading,
  error,
  onEdit,
  onDelete,
  onAddAddress,
  fetchAddresses,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Memuat alamat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="text-red-500 mb-4">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchAddresses}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Belum ada alamat
        </h3>
        <p className="text-gray-500 mb-6">
          Tambahkan alamat pertama Anda untuk memudahkan pengiriman
        </p>
        <button
          onClick={onAddAddress}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          Tambah Alamat Pertama
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {addresses.map((addr) => (
        <div
          key={addr.id}
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 flex flex-col sm:flex-row gap-6"
        >
          <div className="flex-grow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-gray-800">{addr.label}</h3>
              {addr.is_default && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  Utama
                </span>
              )}
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <p className="font-semibold text-gray-800">
                {addr.recipient_name} ({addr.phone})
              </p>
              <p>
                {addr.address}, {addr.district}, {addr.city}, {addr.province},{" "}
                {addr.postal_code}
              </p>
              {addr.notes && (
                <p className="text-xs text-gray-500 italic pt-2">
                  <span className="font-semibold">Catatan:</span> {addr.notes}
                </p>
              )}
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 flex-shrink-0 pt-4 sm:pt-0 sm:border-l sm:pl-6 border-t sm:border-t-0 border-gray-100">
            <button
              onClick={() => onEdit(addr)}
              className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(addr)}
              className="w-full px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
            >
              Hapus
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressList;
