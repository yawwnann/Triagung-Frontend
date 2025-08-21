import React, { useState, useEffect } from "react";
import ApiConfig from "../../lib/ApiConfig";
import BaseModal from "../../common/components/BaseModal";

interface AddressFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  address?: Address | null;
  isEditing?: boolean;
}

interface Address {
  id?: number;
  recipient_name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  postal_code: string;
  address: string;
  is_primary?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  address,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<Address>({
    recipient_name: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    postal_code: "",
    address: "",
    is_primary: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      setFormData(address);
    } else {
      setFormData({
        recipient_name: "",
        phone: "",
        province: "",
        city: "",
        district: "",
        postal_code: "",
        address: "",
        is_primary: false,
      });
    }
    setError(null);
  }, [address, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing && address?.id) {
        await ApiConfig.put(`/addresses/${address.id}`, formData);
      } else {
        await ApiConfig.post("/addresses", formData);
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("Failed to save address:", err);
      const errorMessage =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
          ? String(err.response.data.message)
          : "Gagal menyimpan alamat";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Alamat" : "Tambah Alamat Baru"}
      onSubmit={handleSubmit}
      submitText={isEditing ? "Update Alamat" : "Simpan Alamat"}
      cancelText="Batal"
      showActions={true}
      size="lg"
      submitDisabled={loading}
    >
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Penerima *
            </label>
            <input
              type="text"
              name="recipient_name"
              value={formData.recipient_name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Masukkan nama penerima"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Telepon *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Masukkan nomor telepon"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provinsi *
            </label>
            <input
              type="text"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Provinsi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kota/Kabupaten *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Kota/Kabupaten"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kecamatan *
            </label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Kecamatan"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kode Pos
            </label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Kode pos"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="is_primary"
              id="is_primary"
              checked={formData.is_primary}
              onChange={handleInputChange}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="is_primary"
              className="text-sm font-medium text-gray-700"
            >
              Jadikan alamat utama
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alamat Lengkap *
          </label>
          <textarea
            name="address"
            rows={3}
            value={formData.address}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="Masukkan alamat lengkap (jalan, nomor rumah, dll)"
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default AddressForm;
