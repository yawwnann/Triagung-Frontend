import React from "react";
import type { Address } from "../types";

interface Location {
  id: string;
  name: string;
}

interface AddressFormProps {
  showForm: boolean;
  editAddress: Address | null;
  formLoading: boolean;
  formError: string | null;
  formSuccess: string | null;
  provinces: Location[];
  cities: Location[];
  districts: Location[];
  selectedProvince: string;
  selectedCity: string;
  setSelectedProvince: (value: string) => void;
  setSelectedCity: (value: string) => void;
  setShowForm: (show: boolean) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  showForm,
  editAddress,
  formLoading,
  formError,
  formSuccess,
  provinces,
  cities,
  districts,
  selectedProvince,
  selectedCity,
  setSelectedProvince,
  setSelectedCity,
  setShowForm,
  handleSubmit,
}) => {
  if (!showForm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {editAddress ? "Edit Alamat" : "Tambah Alamat Baru"}
          </h3>
          <button
            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            onClick={() => setShowForm(false)}
            aria-label="Tutup"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          id="address-form"
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Label Alamat
              </label>
              <input
                name="label"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Rumah, Kantor, dll."
                defaultValue={editAddress?.label || ""}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Nama Penerima
              </label>
              <input
                name="recipient_name"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nama lengkap penerima"
                defaultValue={editAddress?.recipient_name || ""}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Nomor Telepon
            </label>
            <input
              name="phone"
              type="tel"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="08xxxxxxxxxx"
              defaultValue={editAddress?.phone || ""}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Alamat Lengkap
            </label>
            <textarea
              name="address"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Jalan, nomor rumah, RT/RW"
              defaultValue={editAddress?.address || ""}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Provinsi
              </label>
              <select
                name="province"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                required
              >
                <option value="">Pilih Provinsi</option>
                {provinces.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Kota/Kabupaten
              </label>
              <select
                name="city"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                required
                disabled={!selectedProvince || cities.length === 0}
              >
                <option value="">Pilih Kota/Kabupaten</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Kecamatan
              </label>
              <select
                name="district"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                required
                disabled={!selectedCity || districts.length === 0}
              >
                <option value="">Pilih Kecamatan</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Kode Pos
              </label>
              <input
                name="postal_code"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="12345"
                defaultValue={editAddress?.postal_code || ""}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Catatan (Opsional)
            </label>
            <textarea
              name="notes"
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Contoh: Rumah warna biru"
              defaultValue={editAddress?.notes || ""}
            />
          </div>

          <div className="flex items-center pt-2">
            <input
              name="is_default"
              type="checkbox"
              id="is_default"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              defaultChecked={!!editAddress?.is_default}
            />
            <label
              htmlFor="is_default"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Jadikan alamat utama
            </label>
          </div>

          {formError && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {formError}
            </div>
          )}

          {formSuccess && (
            <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
              {formSuccess}
            </div>
          )}
        </form>

        <div className="p-4 bg-gray-50 border-t mt-auto">
          <div className="flex items-center justify-end">
            <div className="flex gap-2">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setShowForm(false)}
                disabled={formLoading}
              >
                Batal
              </button>
              <button
                type="submit"
                form="address-form"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={formLoading}
              >
                {formLoading ? "Menyimpan..." : "Simpan Alamat"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
