import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Menggunakan Link dari react-router-dom

const ProductHeroSection: React.FC = () => (
    <section className="relative min-h-[480px] md:min-h-[600px] flex flex-col justify-between font-sans overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0">
            <motion.img
                src="/assets/about/bgAbout.png"
                alt="About Background"
                className="w-full h-full object-cover object-center"
                initial={{ scale: 1 }}
                animate={{ scale: 1.05 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            />
            <div className="absolute top-0 left-0 w-full h-2/5 bg-gradient-to-b from-black/80 to-transparent z-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-black/90 z-10" />
        </div>

        <div className="relative z-20 mx-auto mt-24 px-4 sm:px-10 pt-16 md:pt-24 max-w-4xl w-full flex flex-col items-center text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
            >
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                    Temukan <span className="text-blue-500">Material Terbaik</span>
                    <br />untuk Proyek Anda
                </h1>

                <motion.p
                    className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    Jelajahi koleksi lengkap semen, pasir, cat, besi, dan perlengkapan konstruksi
                    lainnya dengan kualitas terjamin dan harga bersaing.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.8, type: "spring", stiffness: 150 }}
                    className="flex flex-col sm:flex-row justify-center gap-4 mt-8"
                >
                    <Link
                        to="/products" 
                        className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300"
                    >
                        Lihat Semua Produk
                    </Link>
                    <Link
                        to="/contact" 
                        className="px-8 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-colors duration-300"
                    >
                        Butuh Bantuan? Hubungi Kami
                    </Link>
                </motion.div>
            </motion.div>

            <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 w-full max-w-4xl mb-24"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
            >
                {[
                    { value: "Kualitas Terjamin", icon: "✅" }, 
                    { value: "Harga Kompetitif", icon: "💰" },
                    { value: "Pengiriman Cepat", icon: "🚚" },
                    { value: "Support 24/7", icon: "📞" }
                ].map((item, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        className="bg-black/40 backdrop-blur-sm p-5 rounded-lg border border-white/10 text-center"
                    >
                        <p className="text-3xl font-bold text-orange-500 mb-2">{item.icon}</p>
                        <p className="text-white/80 text-sm">{item.value}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>

        <div className="absolute inset-0 overflow-hidden z-10">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/10"
                    style={{
                        width: Math.random() * 10 + 5 + 'px',
                        height: Math.random() * 10 + 5 + 'px',
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%',
                    }}
                    animate={{
                        y: [0, (Math.random() * 100) - 50],
                        x: [0, (Math.random() * 60) - 30],
                        opacity: [0.1, 0.5, 0],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: Math.random() * 5,
                    }}
                />
            ))}
        </div>
    </section>
);

export default ProductHeroSection;