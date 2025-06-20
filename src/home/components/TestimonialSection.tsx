// src/components/ui/InfiniteMovingCards.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "../../lib/utils";

interface TestimonialItem {
  quote: string;
  name: string;
  title: string;
}

interface InfiniteMovingCardsProps {
  items: TestimonialItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}

export const InfiniteMovingCards: React.FC<InfiniteMovingCardsProps> = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  // Effect untuk setup duplikasi DOM dan memulai animasi
  useEffect(() => {
    function addAnimation() {
      if (containerRef.current && scrollerRef.current) {
        if (items && scrollerRef.current.children.length === items.length) {
          const scrollerContent = Array.from(
            scrollerRef.current.children
          ) as HTMLElement[];
          scrollerContent.forEach((item) => {
            const duplicatedItem = item.cloneNode(true) as HTMLElement;
            if (duplicatedItem instanceof HTMLElement) {
              duplicatedItem.setAttribute("aria-hidden", "true");
            }
            if (scrollerRef.current) {
              scrollerRef.current.appendChild(duplicatedItem);
            }
          });
        }
        if (!start) {
          setStart(true);
        }
      }
    }
    addAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // Effect terpisah untuk mengatur speed dan direction (CSS Custom Properties)
  useEffect(() => {
    const getDirection = () => {
      if (containerRef.current) {
        if (direction === "left") {
          containerRef.current.style.setProperty(
            "--animation-direction",
            "forwards"
          );
        } else {
          containerRef.current.style.setProperty(
            "--animation-direction",
            "reverse"
          );
        }
      }
    };

    const getSpeed = () => {
      if (containerRef.current) {
        if (speed === "fast") {
          containerRef.current.style.setProperty("--animation-duration", "20s");
        } else if (speed === "normal") {
          containerRef.current.style.setProperty("--animation-duration", "40s");
        } else {
          containerRef.current.style.setProperty("--animation-duration", "80s");
        }
      }
    };

    getDirection();
    getSpeed();
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] bg-gray-900",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items?.map((item, idx) => (
          <li
            className="relative w-[350px] max-w-full shrink-0 rounded-2xl border border-b-0 border-zinc-100 bg-white px-8 py-6 shadow-sm md:w-[450px] dark:border-white dark:bg-white"
            key={`${item.name || "item"}-${idx}`}
          >
            <blockquote>
              <span className="relative z-20 text-sm leading-[1.6] font-normal text-slate-800">
                {item.quote}
              </span>
              <div className="relative z-20 mt-6 flex flex-row items-center">
                <span className="flex flex-col gap-1">
                  <span className="text-sm leading-[1.6] font-semibold text-slate-600">
                    {item.name}
                  </span>
                  <span className="text-sm leading-[1.6] font-normal text-slate-500">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Data Testimonials (Disesuaikan)
const testimonials: TestimonialItem[] = [
  {
    quote:
      "Pelayanan di Tri Jaya Agung sangat ramah dan cepat. Saya selalu mendapatkan material bangunan dengan kualitas terbaik dan harga bersaing.",
    name: "Bapak Andi",
    title: "Kontraktor Rumah, Lamongan",
  },
  {
    quote:
      "Belanja bahan bangunan di Tri Jaya Agung sangat mudah, pilihan produknya lengkap dan pengirimannya selalu tepat waktu.",
    name: "Ibu Sari",
    title: "Pemilik Toko Bangunan, Babat",
  },
  {
    quote:
      "Saya sudah langganan bertahun-tahun di Tri Jaya Agung. Produk semen dan bata merahnya selalu berkualitas dan sesuai standar proyek.",
    name: "Pak Slamet",
    title: "Mandor Proyek, Lamongan",
  },
  {
    quote:
      "Tri Jaya Agung selalu memberikan solusi terbaik untuk kebutuhan material bangunan saya. Adminnya responsif dan sangat membantu!",
    name: "Bu Rina",
    title: "Arsitek, Lamongan",
  },
  {
    quote:
      "Harga di Tri Jaya Agung sangat kompetitif dan produknya lengkap. Sangat direkomendasikan untuk para kontraktor dan pemilik rumah.",
    name: "Pak Joko",
    title: "Kontraktor, Lamongan",
  },
];

// Komponen Demo (Wrapper)
export function InfiniteMovingCardsDemo() {
  return (
    <div className="pb-10 pt-4 md:pt-8 rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden bg-gray-900">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-6">
        Apa Kata Mereka Tentang Tri Jaya Agung?
      </h2>
      <p className="text-white text-center text-2xl mb-6">
        Lihat pengalaman mereka yang telah berbelanja bahan <br /> bangunan
        berkualitas di Tri Jaya Agung
      </p>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
        pauseOnHover={true}
        className=""
      />
    </div>
  );
}

export default InfiniteMovingCardsDemo;
