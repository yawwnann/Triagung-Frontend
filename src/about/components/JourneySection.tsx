import React from "react";
import { motion } from "framer-motion";


const JourneySection: React.FC = () => {
    return (
        <section className="bg-gradient-to-b from-gray-900 to-black py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        <span className="text-blue-500">Perjalanan</span> Kami
                    </h2>
                    <div className="w-20 h-1 bg-blue-500 mx-auto mb-6"></div>
                    <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                        Dari toko lokal hingga menjadi penyedia distribusi berskala luas, inilah sejarah perjalanan kami.
                    </p>
                </motion.div>
                <div className="relative">
                    <div className="hidden md:block absolute left-1/2 h-full w-0.5 bg-blue-500/30 transform -translate-x-1/2"></div>
                    <div className="space-y-12 md:space-y-0">
                        {[
                            {
                                year: "2017",
                                title: "Avval Berdiri",
                                description: "Tri Agung Jaya Material didirikan di Jakarta sebagai toko bahan bangunan lokal yang mengutamakan kualitas dan pelayanan cepat.",
                                icon: "🏗️"
                            },
                            {
                                year: "2019",
                                title: "Ekspansi Produk & Digital",
                                description: "Menambahkan berbagai kategori produk baru dan mulai merambah ke penjualan berbasis e-commerce.",
                                icon: "🛒"
                            },
                            {
                                year: "2021",
                                title: "Fokus Pada Distribusi Besar",
                                description: "Mulai menyediakan layanan pengiriman langsung ke proyek konstruksi berskala besar.",
                                icon: "🚚"
                            },
                            {
                                year: "2023",
                                title: "Inovasi Dan Perluasan Pasar",
                                description: "Mengembangkan platform online untuk kemudahan transaksi dan memperluas jangkauan ke seluruh Pulau Jawa.",
                                icon: "🌐"
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                <div className="md:absolute left-1/2 transform -translate-x-1/2 w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl z-10 mb-4 md:mb-0">
                                    {item.year}
                                </div>
                                <div className={`md:w-5/12 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
                                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300">
                                        <div className="text-3xl mb-2">{item.icon}</div>
                                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                        <p className="text-gray-300">{item.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    viewport={{ once: true }}
                    className="mt-20 bg-gray-800/30 backdrop-blur-sm p-8 rounded-xl border border-gray-700 max-w-4xl mx-auto text-center"
                >
                    <h3 className="text-2xl font-bold text-white mb-4">Sejak Awal Berdiri</h3>
                    <p className="text-gray-300">
                        PT. Tri Agung Jaya Material berkomitmen menjadi solusi terpercaya bagi kebutuhan material bangunan masyarakat Indonesia.
                        Melalui inovasi, pelayanan terbaik, dan produk sesuai standar nasional, kami terus berkembang dari toko lokal menjadi
                        penyedia distribusi berskala luas. Perjalanan ini bukan hanya tentang angka penjualan, tetapi tentang membangun kepercayaan.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

export default JourneySection;