import React from "react";

const HeroSection: React.FC = () => (
  <section
    className="relative min-h-[480px] md:min-h-[600px] flex flex-col justify-between font-sans"
    data-aos="fade-up"
  >
    {/* Background image with overlay */}
    <div
      className="absolute inset-0 z-0"
      data-aos="fade-in"
      data-aos-delay="100"
    >
      <img
        src="/hero-bg.png"
        alt="Hero Background"
        className="w-full h-full object-cover object-center opacity-60"
      />
      {/* Top gradient overlay */}
      <div
        className="absolute top-0 left-0 w-full h-2/5 bg-gradient-to-b from-black/80 to-transparent z-20"
        data-aos="fade-down"
        data-aos-delay="150"
      />
      {/* Main gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-black/90 z-10"
        data-aos="fade-in"
        data-aos-delay="200"
      />
    </div>

    {/* Hero Content */}
    <div
      className="relative z-20 flex flex-col items-center md:items-start mx-auto md:ml-14 md:mr-auto mt-16 px-4 py-16 md:py-24 max-w-2xl text-center md:text-left"
      data-aos="fade-up"
      data-aos-delay="250"
    >
      <h1
        className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg text-center md:text-left"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        Bangun Lebih Mudah,
        <br />
        Belanja Lebih Cepat
      </h1>
      <p
        className="text-white text-lg md:text-xl mb-6 drop-shadow text-center md:text-left"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        "Kami Menyediakan Berbagai Pilihan Material Bangunan
        <br />
        Dengan Kualitas Terjamin Dan Harga Kompetitif."
      </p>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition flex items-center gap-2 self-center md:self-start"
        data-aos="zoom-in"
        data-aos-delay="500"
      >
        View All Products <span className="text-xl">→</span>
      </button>
    </div>
  </section>
);

export default HeroSection;
