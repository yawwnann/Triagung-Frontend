import React from "react";

const HeroSection: React.FC = () => (
  <section className="relative min-h-[480px] md:min-h-[600px] flex flex-col justify-between font-sans">
    {/* Background image with overlay */}
    <div className="absolute inset-0 z-0">
      <img
        src="/hero-bg.png"
        alt="Hero Background"
        className="w-full h-full object-cover object-center opacity-60"
      />
      {/* Top gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-2/5 bg-gradient-to-b from-black/80 to-transparent z-20" />
      {/* Main gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-black/90 z-10" />
    </div>

    {/* Hero Content */}
    <div className="relative z-20 flex flex-col items-start ml-24 mt-24 px-10 py-16 md:py-24 max-w-2xl">
      <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
        Bangun Lebih Mudah,
        <br />
        Belanja Lebih Cepat
      </h1>
      <p className="text-white text-lg md:text-xl mb-6 drop-shadow">
        "Kami Menyediakan Berbagai Pilihan Material Bangunan
        <br />
        Dengan Kualitas Terjamin Dan Harga Kompetitif."
      </p>
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition flex items-center gap-2">
        View All Products <span className="text-xl">→</span>
      </button>
    </div>
  </section>
);

export default HeroSection;
