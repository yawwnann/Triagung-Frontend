import React from "react";
import { useAddress } from "./hooks/useAddress";
// import AddressHeader from "./components/AddressHeader";
import AddressList from "./components/AddressList";
import AddressForm from "./components/AddressForm";

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

  const handleFormSuccess = () => {
    fetchAddresses();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* <AddressHeader onAddAddress={() => handleShowForm(null)} /> */}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-32">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-blue-800 mb-2 tracking-tight drop-shadow-sm">
            Daftar Alamat
          </h1>
          <p className="text-gray-600">
            Kelola alamat pengiriman Anda dengan mudah dan aman.
          </p>
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
      </div>

      <AddressForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={handleFormSuccess}
        address={editAddress}
        isEditing={!!editAddress}
      />
    </div>
  );
};

export default AddressPage;
