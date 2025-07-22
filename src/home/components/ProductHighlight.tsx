import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApiConfig from "../../lib/ApiConfig";

interface Product {
  id: number;
  nama: string;
  gambar: string;
}

const ProductHighlight: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await ApiConfig.get("/produks");
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setProducts(data.slice(0, 4));
      } catch {
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="w-full py-12 px-2 font-sans bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-black mb-4 text-left md:text-center">
          "SEMEN BERKUALITAS, PILIHAN UTAMA PELANGGAN KAMI."
        </h2>
        <p className="text-black/80 text-base md:text-lg mb-10 text-left md:text-center max-w-3xl mx-auto">
          Produk andalan kami seperti Semen Tiga Roda dan Semen Gresik menjadi
          pilihan utama para kontraktor dan pemilik rumah karena daya rekatnya
          yang kuat, tahan lama, dan sesuai standar SNI. Tak heran jika produk
          ini menjadi salah satu yang paling sering dibeli setiap bulannya.
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-8">
          {Array.isArray(products) &&
            products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-gray-200 hover:border-blue-500 shadow-sm hover:shadow-lg transition-all duration-200 p-4 flex flex-col items-center w-64 group"
              >
                <div className="w-full h-48 flex items-center justify-center mb-3 overflow-hidden rounded-xl bg-gray-50">
                  <img
                    src={p.gambar}
                    alt={p.nama}
                    className="object-contain h-40 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <span className="text-black font-semibold text-base md:text-lg text-center mb-1">
                  {p.nama}
                </span>
              </div>
            ))}
        </div>
        <div className="flex justify-center">
          <Link
            to="/products"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            Lihat Semua Produk
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductHighlight;
