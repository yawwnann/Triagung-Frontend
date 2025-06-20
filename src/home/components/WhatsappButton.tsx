import React from "react";

const WhatsappButton: React.FC = () => (
  <a
    href="https://wa.me/6281234567890" // Ganti dengan nomor WhatsApp Anda
    target="_blank"
    rel="noopener noreferrer"
    className="fixed z-50 bottom-6 right-6 bg-green-500 hover:bg-green-600 rounded-full shadow-lg w-16 h-16 flex items-center justify-center transition-colors"
    aria-label="Chat via WhatsApp"
  >
    <img
      src="/whatsapp-icon.webp"
      alt="WhatsApp"
      className="w-9 h-9 object-contain"
      width={36}
      height={36}
    />
  </a>
);

export default WhatsappButton;
