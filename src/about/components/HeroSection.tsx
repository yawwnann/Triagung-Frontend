import React from "react";
import { motion } from "framer-motion";

const HeroSection: React.FC = () => (
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

        {/* Konten utama dengan animasi */}
        <div className="relative z-20 mx-auto mt-24 px-4 sm:px-10 pt-16 md:pt-24 max-w-4xl w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
            >
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                    Tentang <span className="text-blue-500">Kami</span>
                </h1>

                <motion.p
                    className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    Membangun masa depan bersama dengan material berkualitas dan pelayanan terbaik
                </motion.p>

                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="h-1 bg-blue-500 w-24 mx-auto mb-8"
                />
            </motion.div>

            {/* Statistik perusahaan */}
            <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto lg:mb-60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
            >
                {[
                    { value: "10+", label: "Tahun Pengalaman" },
                    { value: "500+", label: "Proyek Selesai" },
                    { value: "100%", label: "Kepuasan Klien" },
                    { value: "24/7", label: "Layanan Support" }
                ].map((item, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-white/10 text-center"
                    >
                        <p className="text-3xl font-bold text-blue-500 mb-2">{item.value}</p>
                        <p className="text-white/80">{item.label}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>

        {/* Animasi partikel */}
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

export default HeroSection;
