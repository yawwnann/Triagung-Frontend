import React from "react";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

const FooterSection: React.FC = () => {
  return (
    <footer className="bg-gray-950 pt-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
        <div>
          <h3 className="font-extrabold text-2xl mb-4 text-white">
            Trijaya Agung
          </h3>
          <p className="text-gray-400 leading-relaxed text-sm">
            Kami menyediakan material bangunan berkualitas tinggi untuk
            membangun impian Anda. Kualitas terjamin, pengiriman cepat, layanan
            terbaik.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4 text-white">Hubungi Kami</h3>
          <div className="flex items-center mb-2">
            <MapPin size={40} className="text-blue-500 mr-2" />
            <p className="text-gray-400">
              Dsn. Demasari RT. 03 RW. 02 Ds. Kepuh Anyar Kec. Mojoanyar Kab.
              Mojokerto
            </p>
          </div>
          <div className="flex items-center mb-2">
            <Phone size={20} className="text-blue-500 mr-2" />
            <p className="text-gray-400">Telepon :+6285748057838</p>
          </div>
          <div className="flex items-center mb-2">
            <MessageCircle size={20} className="text-blue-500 mr-2" />
            <p className="text-gray-400">WhatsApp:+6285748057838</p>
          </div>
          <div className="flex items-center">
            <Mail size={20} className="text-blue-500 mr-2" />
            <p className="text-gray-400">Email : trijaya@gmail.com</p>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4 text-white">Tautan Cepat</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="/about"
                className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
              >
                Tentang Kami
              </a>
            </li>
            <li>
              <a
                href="/produk"
                className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
              >
                Produk
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4 text-white">Lokasi Kami</h3>
          <div className="w-full h-48 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.9375208664983!2d112.4848378!3d-7.4721521000000015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e780db220b6a21d%3A0xefb650994aa35afd!2sUD.%20TRIJAYA%20AGUNG%202!5e0!3m2!1sid!2sid!4v1755788348651!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Trijaya Agung"
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-600 py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-white text-sm gap-3">
          <div className="flex items-center gap-4">
            <span className="text-white">Indonesia</span>
            <a href="#" className="text-white hover:underline">
              Kebijakan Privasi
            </a>
            <span className="hidden md:inline-block text-white/70">|</span>
            <a href="#" className="text-white hover:underline">
              Syarat & Ketentuan
            </a>
          </div>
          <div className="text-center md:text-right w-full md:w-auto">
            &copy; {new Date().getFullYear()} Tri Jaya Agung. Semua hak
            dilindungi.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
