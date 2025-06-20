import React from "react";

const products = [
  {
    name: "Semen Tiga Roda",
    img: "/gambar1.jpg",
  },
  {
    name: "Semen Tiga Roda",
    img: "/gambar1.jpg",
  },
  {
    name: "Semen Tiga Roda",
    img: "/gambar1.jpg",
  },
];

const ProductHighlight: React.FC = () => (
  <section className="w-full py-12 px-2 font-sans bg-white">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-extrabold text-black mb-4 text-left md:text-center">
        "SEMEN BERKUALITAS, PILIHAN UTAMA PELANGGAN KAMI."
      </h2>
      <p className="text-black/80 text-base md:text-lg mb-10 text-left md:text-center max-w-3xl mx-auto">
        Produk andalan kami seperti Semen Tiga Roda dan Semen Gresik menjadi
        pilihan utama para kontraktor dan pemilik rumah karena daya rekatnya
        yang kuat, tahan lama, dan sesuai standar SNI. Tak heran jika produk ini
        menjadi salah satu yang paling sering dibeli setiap bulannya.
      </p>
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
        {products.map((p, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-blue-400 p-4 flex flex-col items-center w-64 shadow-sm"
          >
            <img
              src={p.img}
              alt={p.name}
              className="w-full h-56 object-cover rounded-t-2xl mb-2"
            />
            <span className="text-black mt-2 text-base md:text-lg">
              {p.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductHighlight;
