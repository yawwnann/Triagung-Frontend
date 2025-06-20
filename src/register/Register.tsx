import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShoppingCart,
  User,
  ArrowRight,
} from "lucide-react";
import ApiConfig from "../lib/ApiConfig";

type ErrorResponse = { message?: string; errors?: Record<string, string[]> };

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (formData.password !== formData.password_confirmation) {
      setError("Konfirmasi password tidak cocok.");
      setLoading(false);
      return;
    }
    try {
      const response = await ApiConfig.post("/register", formData);
      const data = response.data;
      if (data.user) {
        setShowSuccessModal(true);
      } else {
        setError("Registrasi berhasil, tetapi data user tidak ditemukan.");
      }
    } catch (error: unknown) {
      let errorMessage = "Registrasi gagal. Silakan coba lagi.";
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response
      ) {
        const responseData = (error.response as { data?: ErrorResponse }).data;
        if (responseData?.message) {
          errorMessage = responseData.message;
        } else if (responseData?.errors) {
          errorMessage = Object.values(responseData.errors).flat().join("\n");
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    window.location.href = "/login";
  };

  return (
    <>
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center animate-in fade-in duration-200">
            <div className="flex flex-col items-center mb-4">
              <ShoppingCart className="w-12 h-12 text-blue-600 mb-2" />
              <h2 className="text-xl font-bold mb-2 text-gray-800">
                Registrasi Berhasil!
              </h2>
              <p className="text-gray-600 mb-4">
                Akun Anda berhasil dibuat.
                <br />
                Silakan login untuk melanjutkan.
              </p>
            </div>
            <button
              onClick={handleCloseModal}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-1 transition-all"
            >
              Ke Halaman Login
            </button>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden font-montserrat">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-100/20 to-pink-100/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative w-full max-w-5xl">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Left side - Illustration */}
              <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-900 to-blue-700 p-8 lg:p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>

                <div className="relative z-10 text-center max-w-md">
                  <div className="mb-8">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                      <ShoppingCart className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                      Selamat Datang di
                      <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                        Trijaya Agung
                      </span>
                    </h2>
                    <p className="text-lg text-white/90 leading-relaxed">
                      Toko bangunan modern & terpercaya untuk segala kebutuhan
                      material, renovasi, dan konstruksi Anda.
                    </p>
                  </div>

                  <div className="flex items-center justify-center space-x-4 text-sm text-white/80">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Harga Bersaing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span>Pelayanan Ramah</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Register form */}
              <div className="lg:w-1/2 p-8 lg:p-12">
                <div className="max-w-md mx-auto">
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                      Daftar Akun Baru
                    </h1>
                    <p className="text-gray-600">
                      Silakan isi data di bawah untuk membuat akun Trijaya Agung
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name field */}
                    <div className="relative group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <User
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                            formData.name ? "text-blue-500" : "text-gray-400"
                          }`}
                        />
                        <input
                          type="text"
                          name="name"
                          placeholder="Nama Lengkap"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                          required
                          autoComplete="name"
                        />
                      </div>
                    </div>

                    {/* Email field */}
                    <div className="relative group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                            formData.email ? "text-blue-500" : "text-gray-400"
                          }`}
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="admin@trijaya.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                          required
                          autoComplete="username"
                        />
                      </div>
                    </div>

                    {/* Password field */}
                    <div className="relative group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                            formData.password
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                        />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password field */}
                    <div className="relative group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Konfirmasi Password
                      </label>
                      <div className="relative">
                        <Lock
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                            formData.password_confirmation
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                        />
                        <input
                          type={showPasswordConfirm ? "text" : "password"}
                          name="password_confirmation"
                          placeholder="Ulangi Password"
                          value={formData.password_confirmation}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswordConfirm(!showPasswordConfirm)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                          tabIndex={-1}
                        >
                          {showPasswordConfirm ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Error message */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm animate-in slide-in-from-top-2 duration-300">
                        {error}
                      </div>
                    )}

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-900 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? (
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          ></path>
                        </svg>
                      ) : (
                        <ArrowRight className="w-5 h-5 mr-2" />
                      )}
                      {loading ? "Memuat..." : "Daftar"}
                    </button>
                  </form>
                  <div className="text-center text-sm text-gray-500 mt-8">
                    Sudah punya akun?{" "}
                    <a
                      href="/login"
                      className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors"
                    >
                      Masuk
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
