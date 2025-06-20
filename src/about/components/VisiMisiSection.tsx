import React from "react";
import { motion, type Variants } from "framer-motion";
import { Target, Handshake, Leaf, Users, Rocket } from "lucide-react";

const VisiMisiSection: React.FC = () => {
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.8,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  return (
    <>
      <section className="bg-gradient-to-r from-[#FFFDF6] to-[#F5F7F8] py-16 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-black mb-4"
            >
              Visi & <span className="text-blue-500">Misi</span> Kami
            </motion.h2>
            <motion.div
              variants={itemVariants}
              className="w-24 h-1 bg-blue-500 mx-auto mb-6"
            ></motion.div>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-700 max-w-2xl mx-auto"
            >
              {" "}
              {/* Ubah text-black ke text-gray-700 untuk kelembutan */}
              Fondasi kuat yang menggerakkan setiap langkah kami dalam
              menyediakan material bangunan terbaik dan terpercaya.
            </motion.p>
          </motion.div>

          {/* Visi Section */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            {/* Area untuk "gambar" visi, diganti dengan elemen non-gambar */}
            <motion.div
              variants={itemVariants}
              className="md:order-2 flex items-center justify-center p-8 bg-white rounded-lg shadow-xl border border-gray-200"
            >
              {" "}
              {/* Ubah bg dan border */}
              <Rocket size={120} className="text-blue-500" />
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="text-black md:order-1"
            >
              {" "}
              {/* Ubah text-white ke text-black */}
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-blue-500">
                Visi
              </h3>
              <p className="text-lg md:text-xl leading-relaxed text-gray-700">
                {" "}
                {/* Ubah text-gray-300 ke text-gray-700 */}
                Menjadi perusahaan distribusi material bangunan terdepan di
                Indonesia, dikenal karena kualitas produk, inovasi layanan, dan
                komitmen terhadap kepuasan pelanggan serta keberlanjutan.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <motion.div
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <span className="text-blue-500 text-2xl">✓</span>
                  <p className="text-gray-700">
                    Kualitas produk yang tak tertandingi.
                  </p>{" "}
                  {/* Ubah text-gray-200 ke text-gray-700 */}
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <span className="text-blue-500 text-2xl">✓</span>
                  <p className="text-gray-700">
                    Inovasi berkelanjutan dalam layanan dan teknologi.
                  </p>{" "}
                  {/* Ubah text-gray-200 ke text-gray-700 */}
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <span className="text-blue-500 text-2xl">✓</span>
                  <p className="text-gray-700">
                    Kepuasan pelanggan sebagai prioritas utama.
                  </p>{" "}
                  {/* Ubah text-gray-200 ke text-gray-700 */}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Misi Section */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            {/* Area untuk "gambar" misi, diganti dengan elemen non-gambar */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center p-8 bg-white rounded-lg shadow-xl border border-gray-200"
            >
              {" "}
              {/* Ubah bg dan border */}
              {/* Menggunakan Ikon koleksi untuk merepresentasikan Misi */}
              <div className="grid grid-cols-2 grid-rows-2 gap-4">
                <Handshake size={60} className="text-blue-500" />
                <Leaf size={60} className="text-blue-500" />
                <Users size={60} className="text-blue-500" />
                <Target size={60} className="text-blue-500" />
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="text-black">
              {" "}
              {/* Ubah text-white ke text-black */}
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-blue-500">
                Misi
              </h3>
              <ul className="list-none space-y-4 text-lg md:text-xl leading-relaxed text-gray-700">
                {" "}
                {/* Ubah text-gray-300 ke text-gray-700 */}
                <motion.li
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <span className="text-blue-500 text-2xl">➔</span>
                  <p>
                    Menyediakan beragam material bangunan berkualitas tinggi
                    dari pemasok terpercaya.
                  </p>
                </motion.li>
                <motion.li
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <span className="text-blue-500 text-2xl">➔</span>
                  <p>
                    Memberikan pelayanan pelanggan yang responsif, efisien, dan
                    personal.
                  </p>
                </motion.li>
                <motion.li
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <span className="text-blue-500 text-2xl">➔</span>
                  <p>
                    Mengembangkan jaringan distribusi yang luas untuk menjangkau
                    seluruh wilayah Indonesia.
                  </p>
                </motion.li>
                <motion.li
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <span className="text-blue-500 text-2xl">➔</span>
                  <p>
                    Menerapkan praktik bisnis berkelanjutan yang bertanggung
                    jawab terhadap lingkungan dan masyarakat.
                  </p>
                </motion.li>
                <motion.li
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <span className="text-blue-500 text-2xl">➔</span>
                  <p>
                    Menciptakan lingkungan kerja yang inovatif dan kolaboratif
                    bagi seluruh karyawan.
                  </p>
                </motion.li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
        {/* Animasi latar belakang radial dari AboutSection, disesuaikan agar tidak kontras dengan putih */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent opacity-30"></div>{" "}
          {/* Ubah warna dan opacity */}
        </div>
      </section>
    </>
  );
};

export default VisiMisiSection;
