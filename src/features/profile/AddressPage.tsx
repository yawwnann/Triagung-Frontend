import React from "react";
import { useAddress } from "./hooks/useAddress";
import AddressList from "./components/AddressList";
import AddressForm from "./components/AddressForm";
import { useNavigate } from "react-router-dom";

const AddressPage: React.FC = () => {
  const {
    addresses,
    loading,
    error,
    showForm,
    editAddress,
    setShowForm,
    handleShowForm,
    handleDeleteAddress,
    fetchAddresses,
  } = useAddress();
  const navigate = useNavigate();

  const handleFormSuccess = () => {
    fetchAddresses();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Kembali ke Profil
        </button>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Alamat Saya
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Kelola alamat untuk kemudahan pengiriman pesanan Anda.
            </p>
          </div>
          <button
            onClick={() => handleShowForm(null)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 text-sm"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Tambah Alamat
          </button>
        </div>

        <AddressList
          addresses={addresses}
          loading={loading}
          error={error}
          onEdit={handleShowForm}
          onDelete={handleDeleteAddress}
          onAddAddress={() => handleShowForm(null)}
          fetchAddresses={fetchAddresses}
        />
      </main>

      <AddressForm
        isOpen={showForm}
        address={editAddress}
        isEditing={!!editAddress}
        onClose={() => setShowForm(false)}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default AddressPage;
