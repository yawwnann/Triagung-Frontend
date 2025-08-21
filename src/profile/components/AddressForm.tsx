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
  label?: string;
  recipient_name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  postal_code: string;
  address: string;
  is_default?: boolean;
  notes?: string;
}

const AddressForm: React.FC<AddressFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  address,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<Address>({
    label: "",
    recipient_name: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    postal_code: "",
    address: "",
    is_default: false,
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Location state
  const [provinces, setProvinces] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [cities, setCities] = useState<Array<{ id: string; name: string }>>([]);
  const [districts, setDistricts] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("");

  useEffect(() => {
    if (address) {
      // Prefill, supporting older payload shapes from backend
      setFormData({
        label: (address as unknown as { label?: string }).label ?? "",
        recipient_name: address.recipient_name,
        phone: address.phone,
        province: address.province,
        city: address.city,
        district: address.district,
        postal_code: address.postal_code,
        address: address.address,
        is_default:
          (address as unknown as { is_default?: boolean }).is_default ?? false,
        notes: (address as unknown as { notes?: string }).notes ?? "",
      });
    } else {
      setFormData({
        label: "",
        recipient_name: "",
        phone: "",
        province: "",
        city: "",
        district: "",
        postal_code: "",
        address: "",
        is_default: false,
        notes: "",
      });
    }
    setError(null);
  }, [address, isOpen]);

  // Fetch provinces when modal opens
  useEffect(() => {
    if (!isOpen) return;
    ApiConfig.get("/provinces")
      .then((res) => setProvinces(res.data))
      .catch(() => setProvinces([]));
  }, [isOpen]);

  // When province changes, fetch cities
  useEffect(() => {
    if (!selectedProvinceId) {
      setCities([]);
      setDistricts([]);
      setSelectedCityId("");
      setSelectedDistrictId("");
      return;
    }
    ApiConfig.get(`/regencies?province_id=${selectedProvinceId}`)
      .then((res) => setCities(res.data))
      .catch(() => setCities([]));
  }, [selectedProvinceId]);

  // When city changes, fetch districts
  useEffect(() => {
    if (!selectedCityId) {
      setDistricts([]);
      setSelectedDistrictId("");
      return;
    }
    ApiConfig.get(`/districts?regency_id=${selectedCityId}`)
      .then((res) => setDistricts(res.data))
      .catch(() => setDistricts([]));
  }, [selectedCityId]);

  // Preselect ids when editing based on names
  useEffect(() => {
    if (!address || provinces.length === 0) return;
    const prov = provinces.find((p) => p.name === address.province);
    if (prov && prov.id !== selectedProvinceId) {
      setSelectedProvinceId(prov.id);
    }
  }, [address, provinces, selectedProvinceId]);

  useEffect(() => {
    if (!address || cities.length === 0) return;
    const city = cities.find((c) => c.name === address.city);
    if (city && city.id !== selectedCityId) {
      setSelectedCityId(city.id);
    }
  }, [address, cities, selectedCityId]);

  useEffect(() => {
    if (!address || districts.length === 0) return;
    const dist = districts.find((d) => d.name === address.district);
    if (dist && dist.id !== selectedDistrictId) {
      setSelectedDistrictId(dist.id);
    }
  }, [address, districts, selectedDistrictId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        label: formData.label?.trim() ?? "",
        recipient_name: formData.recipient_name,
        phone: formData.phone,
        address: formData.address,
        province: formData.province,
        city: formData.city,
        regency_id: selectedCityId || undefined,
        district: formData.district,
        postal_code: formData.postal_code,
        is_default: !!formData.is_default,
        notes: formData.notes ?? "",
      };

      const required: Array<keyof typeof payload> = [
        "label",
        "recipient_name",
        "phone",
        "address",
        "province",
        "city",
        "district",
        "postal_code",
      ];
      const missing = required.filter((k) => !payload[k]);
      if (missing.length) {
        throw new Error("Mohon lengkapi semua field wajib.");
      }

      if (isEditing && address?.id) {
        await ApiConfig.put(`/addresses/${address.id}`, payload);
      } else {
        await ApiConfig.post("/addresses", payload);
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("Failed to save address:", err);
      const message =
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message
          ? (err as { response?: { data?: { message?: string } } }).response!
              .data!.message!
          : "Gagal menyimpan alamat";
      setError(message);
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

        {/* Label Alamat */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Label Alamat <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="label"
            value={formData.label}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
            placeholder="Contoh: Rumah, Kantor, Kost"
          />
        </div>

        {/* Data Penerima */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Data Penerima
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Penerima <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="recipient_name"
                value={formData.recipient_name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
                placeholder="Nama lengkap penerima"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Telepon <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
                placeholder="08xxxxxxxxx"
              />
            </div>
          </div>
        </div>

        {/* Lokasi */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Lokasi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provinsi <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedProvinceId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedProvinceId(id);
                  const prov = provinces.find((p) => p.id === id);
                  setFormData((prev) => ({
                    ...prev,
                    province: prov?.name || "",
                    city: "",
                    district: "",
                  }));
                }}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
              >
                <option value="">Pilih Provinsi</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kota/Kabupaten <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCityId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedCityId(id);
                  const city = cities.find((c) => c.id === id);
                  setFormData((prev) => ({
                    ...prev,
                    city: city?.name || "",
                    district: "",
                  }));
                }}
                required
                disabled={!selectedProvinceId}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <option value="">
                  {!selectedProvinceId
                    ? "Pilih provinsi dulu"
                    : "Pilih Kota/Kabupaten"}
                </option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kecamatan <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedDistrictId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedDistrictId(id);
                  const dist = districts.find((d) => d.id === id);
                  setFormData((prev) => ({
                    ...prev,
                    district: dist?.name || "",
                  }));
                }}
                required
                disabled={!selectedCityId}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <option value="">
                  {!selectedCityId ? "Pilih kota dulu" : "Pilih Kecamatan"}
                </option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Detail Alamat */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Detail Alamat
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                rows={4}
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-gray-900 placeholder-gray-400"
                placeholder="Contoh: Jl. Merdeka No. 123, RT 01/RW 02, dekat Alfamart"
              />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
                  placeholder="12345"
                  maxLength={5}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan (opsional)
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
                  placeholder="Patokan, jam penerimaan, dll"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pengaturan */}
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="is_default"
                id="is_default"
                checked={!!formData.is_default}
                onChange={handleInputChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="is_default"
                className="text-sm font-medium text-gray-800"
              >
                <span className="font-semibold">Jadikan alamat utama</span>
                <br />
                <span className="text-xs text-gray-600">
                  Alamat ini akan digunakan sebagai alamat pengiriman default
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default AddressForm;
