import React from 'react';
import {motion} from 'framer-motion';


const AboutSection: React.FC = () => {
    return (
        <section className="bg-gradient-to-r from-[#FFFDF6] to-[#F5F7F8]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-16 px-4 md:px-10 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="w-full max-w-md mx-auto"
                >
                    <img
                        src="/assets/about/bangunan.png"
                        alt="Gedung Perusahaan"
                        className='w-full '
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className='text-white'
                >
                    <p className="text-2xl md:text-3xl font-semibold mb-4 text-black">
                        <motion.span
                            className="inline-block border-b-2 border-blue-500 pb-1"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            Tentang
                        </motion.span>
                        <span> Kami</span>
                    </p>

                    <h2 className='text-3xl md:text-4xl font-bold mb-6 text-black'>
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            Bangun Lebih Mudah
                        </motion.span>
                        <br />
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            viewport={{ once: true }}
                        >
                            Belanja Lebih Cepat
                        </motion.span>
                    </h2>

                    <motion.p
                        className="text-lg md:text-xl leading-relaxed max-w-lg text-black"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        viewport={{ once: true }}
                    >
                        Tri Agun Jaya Material adalah perusahaan yang bergerak di bidang distribusi bahan bangunan sejak tahun 2017. Kami berkomitmen menyediakan produk berkualitas tinggi seperti semen, pasir, cat, dan perlengkapan konstruksi lainnya. Dengan pengalaman bertahun-tahun dan jaringan yang luas, kami menjadi mitra terpercaya bagi kontraktor, tukang, dan pemilik rumah di seluruh Indonesia.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        viewport={{ once: true }}
                        className="flex gap-4 mt-8"
                    >
                        <button className="px-6 py-3 bg-[#1A1A19] hover:bg-[#3F3F44] text-white font-medium rounded-md transition-colors duration-300 shadow-lg hover:shadow-blue-500/20">
                            Hubungi Kami
                        </button>
                        <button className="px-6 py-3 border border-[#1A1A19] text-black hover:text-white hover:bg-[#3F3F44] font-medium rounded-md transition-colors duration-300">
                            Lihat Produk
                        </button>
                    </motion.div>
                </motion.div>
            </div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-20"></div>
            </div>
        </section>
    );
}

export default AboutSection;