import React from "react";

const stats = [
  {
    icon: null,
    title: "2.000+",
    desc: "Produk Terjual",
    highlight: false,
  },
  {
    icon: null,
    title: "134",
    desc: "Produk Tersedia",
    highlight: false,
  },
  {
    title: "4.9/5",
    desc: "Rating Pelanggan",
    highlight: false,
  },
  {
    title: "Produk Berkualitas",
    desc: "Standar Mutu Sesuai SNI & ISO.",
    highlight: true,
  },
];

const StatsSection: React.FC = () => (
  <section className="w-full bg-blue-600 py-8 px-2 font-sans">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/30">
      {stats.map((item, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center py-4 px-2 text-center min-h-[90px]"
        >
          {item.icon && <div className="mb-1">{item}</div>}
          <span
            className={`text-white text-lg md:text-xl font-bold ${
              item.highlight ? "flex items-center justify-center" : ""
            }`}
          >
            {item.title}
          </span>
          {item.desc && (
            <span className="text-white/90 text-sm md:text-base font-normal mt-1">
              {item.desc}
            </span>
          )}
        </div>
      ))}
    </div>
  </section>
);

export default StatsSection;
