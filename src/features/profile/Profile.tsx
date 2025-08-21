import React, { useEffect, useState } from "react";
import ApiConfig from "../../shared/utils/ApiConfig";
import { useNavigate } from "react-router-dom";
import Notification from "../../shared/components/Notification";
import LogoutConfirmationModal from "../../shared/components/LogoutConfirmationModal";
import BaseModal from "../../shared/components/BaseModal";
import { isAxiosError } from "axios";
import {
  Phone,
  FileText,
  User,
  Calendar,
  UserPlus,
  Edit3,
  MapPin,
  LogOut,
  AlertTriangle,
} from "lucide-react";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role?: string;
  phone?: string | null;
  bio?: string | null;
  avatar?: string | null;
  gender?: string | null;
  birth_date?: string | null;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

interface ProfileFormData {
  name: string;
  phone: string;
  bio: string;
  gender: string;
  birth_date: string;
}

interface ProfileProps {
  onLogout: () => void;
}

// Skeleton Components
const ProfileSkeleton = () => (
  <div className="min-h-screen bg-gray-50 pt-32 pb-12">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-600 to-blue-900 p-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-white/20 animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-8 w-48 bg-white/20 rounded-lg animate-pulse"></div>
              <div className="h-5 w-64 bg-white/20 rounded-lg animate-pulse"></div>
              <div className="h-6 w-20 bg-white/20 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <div className="h-7 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 p-4 rounded-xl border border-gray-100"
                  >
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            {/* Settings Skeleton */}
            <div className="space-y-6">
              <div className="h-7 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-100 rounded-xl animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    phone: "",
    bio: "",
    gender: "",
    birth_date: "",
  });
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("Autentikasi diperlukan.");
          navigate("/login");
          return;
        }

        const [userResponse, profileDetailResponse] = await Promise.all([
          ApiConfig.get("/me"),
          ApiConfig.get("/profile-detail").catch((error) => {
            if (error.response && error.response.status === 404) {
              return { data: {} };
            }
            throw error;
          }),
        ]);

        const combinedUser: UserProfile = {
          ...userResponse.data,
          ...profileDetailResponse.data,
        };

        setUser(combinedUser);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Gagal memuat data profil.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    setShowLogoutModal(true); // Tampilkan modal konfirmasi
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    onLogout(); // Panggil onLogout dari App.tsx untuk reset state navbar
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleOpenModal = () => {
    if (!user) return;
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      bio: user.bio || "",
      gender: user.gender || "Laki-laki",
      birth_date: user.birth_date ? user.birth_date.split("T")[0] : "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Special handling for phone number to remove non-numeric characters
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: numericValue });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);
    try {
      const response = await ApiConfig.post("/profile-detail", formData);

      const updatedDetails = response.data.user || response.data;
      setUser(
        (prevUser) => ({ ...prevUser, ...updatedDetails } as UserProfile)
      );

      handleCloseModal();
      setNotification({
        message: "Profil berhasil diperbarui!",
        type: "success",
      });
    } catch (err) {
      console.error("Failed to update profile", err);
      let message = "Gagal memperbarui profil. Coba lagi.";
      if (isAxiosError(err) && err.response?.data?.message) {
        message = err.response.data.message;
      }
      setNotification({
        message,
        type: "error",
      });
    }
  };

  const profileDataToDisplay = user
    ? [
        { label: "Telepon", value: user.phone, icon: Phone },
        { label: "Bio", value: user.bio, icon: FileText },
        { label: "Jenis Kelamin", value: user.gender, icon: User },
        {
          label: "Tanggal Lahir",
          value: formatDate(user.birth_date),
          icon: Calendar,
        },
        {
          label: "Akun Dibuat",
          value: formatDate(user.created_at),
          icon: UserPlus,
        },
      ]
    : [];

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Terjadi Kesalahan
          </h3>
          <p className="text-gray-600 mb-6">
            {error || "User tidak ditemukan."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Modern Header */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-600 to-blue-900 p-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold text-white border-2 border-white/30">
                  {user.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-1">
                  {user.name}
                </h1>
                <p className="text-blue-100 text-lg mb-2">{user.email}</p>
                {user.role && (
                  <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-white border border-white/30">
                    {user.role}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Information */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Informasi Pribadi
                  </h2>
                  <button
                    onClick={handleOpenModal}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileDataToDisplay.map(
                    ({ label, value, icon: IconComponent }) => (
                      <div
                        key={label}
                        className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                              {label}
                            </h3>
                            <p className="text-gray-900 font-medium">
                              {value || (
                                <span className="text-gray-400">
                                  Belum diisi
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Settings Panel */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Pengaturan</h2>
                <div className="space-y-3">
                  <button
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                    onClick={() => navigate("/address")}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-900">
                        Kelola Alamat
                      </span>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 p-4 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Keluar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Modal */}
      {isModalOpen && (
        <BaseModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Edit Profil"
          onSubmit={handleFormSubmit}
          submitText="Simpan Perubahan"
          cancelText="Batal"
          showActions={true}
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telepon
              </label>
              <input
                type="tel"
                pattern="\d*"
                inputMode="numeric"
                maxLength={15}
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Masukkan nomor telepon"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Ceritakan tentang diri Anda..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Kelamin
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>
          </div>
        </BaseModal>
      )}

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
};

export default Profile;
