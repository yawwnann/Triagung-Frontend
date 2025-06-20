import React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

const FooterSection: React.FC = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    viewport: { once: true, amount: 0.3 },
  };

  const slideInFromLeft = {
    initial: { opacity: 0, x: -50 },
    whileInView: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, delay: 0.2 },
    },
    viewport: { once: true, amount: 0.3 },
  };

  const slideInFromRight = {
    initial: { opacity: 0, x: 50 },
    whileInView: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, delay: 0.2 },
    },
    viewport: { once: true, amount: 0.3 },
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black pt-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 pb-8">
        <motion.div {...fadeIn}>
          <h3 className="font-extrabold text-2xl mb-4 text-white">Startup</h3>
          <p className="text-gray-400 leading-relaxed text-sm">
            Kami menyediakan material bangunan berkualitas tinggi untuk
            membangun impian Anda. Kualitas terjamin, pengiriman cepat, layanan
            terbaik.
          </p>
        </motion.div>

        <motion.div {...slideInFromLeft}>
          <h3 className="font-bold text-lg mb-4 text-white">Hubungi Kami</h3>
          <div className="flex items-center mb-2">
            <MapPin size={20} className="text-blue-500 mr-2" />
            <p className="text-gray-400">Jl. Lamongan x, Jawa Timur</p>
          </div>
          <div className="flex items-center mb-2">
            <Phone size={20} className="text-blue-500 mr-2" />
            <p className="text-gray-400">Telepon : xxxxxxxxxxxx</p>
          </div>
          <div className="flex items-center mb-2">
            <MessageCircle size={20} className="text-blue-500 mr-2" />
            <p className="text-gray-400">WhatsApp: xxxxxxxxxxxxxxxx</p>
          </div>
          <div className="flex items-center">
            <Mail size={20} className="text-blue-500 mr-2" />
            <p className="text-gray-400">Email : trijaya@gmail.com</p>
          </div>
          <div className="mt-4">
            <a
              href="#"
              className="text-blue-500 text-base font-medium hover:underline"
            >
              Lihat di Peta
            </a>
          </div>
        </motion.div>

        <motion.div {...slideInFromRight}>
          <h3 className="font-bold text-lg mb-4 text-white">Tautan Cepat</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
              >
                Tentang Kami
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
              >
                Produk
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
              >
                Layanan
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
              >
                Artikel
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
              >
                FAQ
              </a>
            </li>
          </ul>
        </motion.div>
      </div>

      <div className="bg-blue-600 py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-white text-sm gap-3">
          <motion.div {...fadeIn} className="flex items-center gap-4">
            <span className="text-white">Indonesia</span>
            <a href="#" className="text-white hover:underline">
              Privacy Policy
            </a>
            <span className="hidden md:inline-block text-white/70">|</span>
            <a href="#" className="text-white hover:underline">
              Terms & Conditions
            </a>
          </motion.div>
          <motion.div
            {...fadeIn}
            className="text-center md:text-right w-full md:w-auto"
          >
            &copy; {new Date().getFullYear()} Tri Jaya Agung. All rights
            reserved.
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
