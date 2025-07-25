import React, { useEffect, useState } from "react";
import ApiConfig from "../../lib/ApiConfig";

interface Product {
  id: number;
  nama: string;
  gambar: string;
}

const ProductHighlight: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ApiConfig.get("/produks");
        const data = response.data;
        // Mapping seperti di ProductCatalog
        const mapped = (Array.isArray(data) ? data : []).map((item) => ({
          id: item.id,
          nama: item.nama,
          gambar: item.gambar,
        }));
        setProducts(mapped.slice(0, 4));
        setLoading(false);
      } catch {
        setProducts([]);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="h-48 bg-gray-300 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 px-4 bg-gray-50 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-600 rounded-full"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-blue-600 rounded-full"></div>
        <div className="absolute bottom-32 left-40 w-3 h-3 bg-blue-600 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-blue-600 rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold mb-4 border border-blue-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Produk Unggulan
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="text-blue-600">SEMEN BERKUALITAS,</span>
            <br />
            <span className="text-gray-800">PILIHAN UTAMA PELANGGAN KAMI</span>
          </h2>

          <p className="text-gray-600 text-lg md:text-xl mb-4 max-w-4xl mx-auto leading-relaxed">
            Produk andalan kami seperti{" "}
            <span className="font-semibold text-blue-600">Semen Tiga Roda</span>{" "}
            dan
            <span className="font-semibold text-orange-500">
              {" "}
              Semen Gresik
            </span>{" "}
            menjadi pilihan utama para kontraktor dan pemilik rumah karena daya
            rekatnya yang kuat, tahan lama, dan sesuai standar SNI.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Standar SNI</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Daya Rekat Kuat</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Tahan Lama</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {Array.isArray(products) &&
            products.map((product, index) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl border-2 border-gray-100 hover:border-blue-300 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image container */}
                <div className="relative w-full h-56 bg-gray-50 overflow-hidden">
                  <img
                    src={product.gambar}
                    alt={product.nama}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzVIMTI1VjEyNUgxMDBWNzVaIiBmaWxsPSIjOUI5QkE0Ii8+CjxwYXRoIGQ9Ik03NSA3NUgxMDBWMTAwSDc1Vjc1WiIgZmlsbD0iIzlCOUJBNCIvPgo8L3N2Zz4K";
                    }}
                  />

                  {/* Quality badge */}
                  <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded font-semibold">
                    Berkualitas
                  </div>
                </div>

                {/* Product info */}
                <div className="p-6">
                  <h3 className="text-gray-900 font-bold text-lg text-center mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {product.nama}
                  </h3>

                  <div className="flex justify-center items-center gap-1 text-sm text-gray-500 mb-4">
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>Pilihan Terbaik</span>
                  </div>

                  {/* Action button */}
                  <div className="text-center"></div>
                </div>
              </div>
            ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 max-w-md mx-auto">
            <div className="mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Jelajahi Koleksi Lengkap
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Temukan berbagai pilihan semen berkualitas untuk kebutuhan
                konstruksi Anda
              </p>
            </div>

            <button
              onClick={() => (window.location.href = "/products")}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:bg-blue-700"
            >
              <span>Lihat Semua Produk</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHighlight;
