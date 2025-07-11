import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiConfig from "../../lib/ApiConfig";
import type { Address } from "../types";

export const useAddress = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>(
    []
  );
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>(
    []
  );

  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const fetchAddresses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ApiConfig.get("/addresses");
      setAddresses(res.data);
    } catch {
      setError("Gagal memuat alamat. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    ApiConfig.get("/provinces")
      .then((res) => setProvinces(res.data))
      .catch(() => setProvinces([]));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      ApiConfig.get(`/regencies?province_id=${selectedProvince}`)
        .then((res) => setCities(res.data))
        .catch(() => setCities([]));
    } else {
      setCities([]);
      setDistricts([]);
      setSelectedCity("");
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedCity) {
      ApiConfig.get(`/districts?regency_id=${selectedCity}`)
        .then((res) => setDistricts(res.data))
        .catch(() => setDistricts([]));
    } else {
      setDistricts([]);
    }
  }, [selectedCity]);

  const handleShowForm = (addr: Address | null) => {
    setEditAddress(addr);
    setShowForm(true);
    setFormError(null);
    setFormSuccess(null);
    if (addr) {
      setSelectedProvince("");
      setSelectedCity("");
    } else {
      setSelectedProvince("");
      setSelectedCity("");
    }
  };

  const handleDeleteAddress = async (addr: Address) => {
    if (
      !window.confirm(
        `Apakah Anda yakin ingin menghapus alamat "${addr.label}"?`
      )
    )
      return;
    try {
      await ApiConfig.delete(`/addresses/${addr.id}`);
      fetchAddresses();
    } catch {
      alert("Gagal menghapus alamat. Silakan coba lagi.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const provObj = provinces.find((p) => p.id === selectedProvince);
    const cityObj = cities.find((c) => c.id === selectedCity);
    const districtId = formData.get("district") as string;
    const districtObj = districts.find((d) => d.id === districtId);

    if (!provObj || !cityObj || !districtObj) {
      setFormError(
        "Provinsi, kota, atau kecamatan tidak valid. Silakan pilih ulang."
      );
      setFormLoading(false);
      return;
    }

    const payload = {
      label: formData.get("label") as string,
      recipient_name: formData.get("recipient_name") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      province: provObj.name,
      city: cityObj.name,
      regency_id: cityObj.id,
      district: districtObj.name,
      postal_code: formData.get("postal_code") as string,
      is_default: formData.get("is_default") === "on",
      notes: formData.get("notes") as string,
    };

    const requiredFields: (keyof typeof payload)[] = [
      "label",
      "recipient_name",
      "phone",
      "address",
      "province",
      "city",
      "district",
      "postal_code",
    ];
    const emptyFields = requiredFields.filter((field) => !payload[field]);
    if (emptyFields.length > 0) {
      setFormError("Mohon lengkapi semua field yang wajib diisi.");
      setFormLoading(false);
      return;
    }

    try {
      if (editAddress) {
        await ApiConfig.put(`/addresses/${editAddress.id}`, payload);
        setFormSuccess("Alamat berhasil diperbarui.");
      } else {
        await ApiConfig.post("/addresses", payload);
        setFormSuccess("Alamat berhasil ditambahkan.");
      }
      setTimeout(() => {
        setShowForm(false);
        fetchAddresses();
      }, 1000);
    } catch {
      setFormError("Gagal menyimpan alamat. Silakan coba lagi.");
    } finally {
      setFormLoading(false);
    }
  };

  return {
    addresses,
    loading,
    error,
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
    navigate,
    setSelectedProvince,
    setSelectedCity,
    setShowForm,
    handleShowForm,
    handleDeleteAddress,
    handleSubmit,
    fetchAddresses,
  };
};
