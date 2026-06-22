import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { IProducts } from "../../../types/IProducts";
import { formatCurrency } from "../../../utils/Format";

interface Props {
  products: IProducts[];
}

const SectionFlashSale = ({ products }: Props) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 59, seconds: 59 });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) return { hours, minutes, seconds: seconds - 1 };
        if (minutes > 0) return { hours, minutes: minutes - 1, seconds: 59 };
        if (hours > 0) return { hours: hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollCards = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 220 : -220, behavior: "smooth" });
  };

  const saleProducts = products.slice(0, 10);
  if (saleProducts.length === 0) return null;

  const getImgSrc = (product: IProducts) => {
    const url = product.imageUrls?.[0];
    if (!url) return "/default.png";
    return url.startsWith("http")
      ? url
      : `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/${url}`;
  };

  return (
    <section className="py-8 lg:py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ═══ BANNER CONTAINER ═══ */}
        <div
          className="rounded-2xl overflow-hidden flex flex-col lg:flex-row"
          style={{ background: "linear-gradient(135deg,#c0392b 0%,#e74c3c 50%,#e67e22 100%)" }}
        >

          {/* ── CỘT TRÁI: Flash Sale Info ── */}
          <div className="flex-shrink-0 lg:w-[200px] xl:w-[220px] flex flex-row lg:flex-col items-center lg:items-center justify-center gap-4 lg:gap-6 px-6 py-5 lg:py-8 relative overflow-hidden">
            {/* bg deco */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

            {/* Title */}
            <div className="text-center relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-400 rounded-xl mb-2 shadow-md">
                <span className="text-xl">⚡</span>
              </div>
              <h2
                className="font-black italic text-white leading-tight tracking-tight"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
              >
                FLASH<br />
                <span className="text-yellow-300">SALE</span>
              </h2>
            </div>

            {/* Countdown */}
            <div className="text-center relative z-10">
              <p className="text-white/70 text-[10px] uppercase tracking-widest mb-2 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-ping inline-block" />
                Kết thúc sau
              </p>
              <div className="flex items-center justify-center gap-1">
                {[
                  { val: timeLeft.hours, label: "Giờ" },
                  { val: timeLeft.minutes, label: "Phút" },
                  { val: timeLeft.seconds, label: "Giây" },
                ].map((item, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="flex flex-col items-center gap-0.5">
                      <span
                        className="font-black text-white tabular-nums flex items-center justify-center rounded-lg"
                        style={{
                          background: "rgba(0,0,0,0.3)",
                          border: "1px solid rgba(255,255,255,0.25)",
                          width: "2.5rem",
                          height: "2.5rem",
                          fontSize: "1.2rem",
                        }}
                      >
                        {String(item.val).padStart(2, "0")}
                      </span>
                      <span className="text-white/60 text-[9px] font-bold">{item.label}</span>
                    </span>
                    {i < 2 && (
                      <span className="text-yellow-300 font-black text-lg mb-3 animate-pulse">:</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link
              to="/product"
              className="relative z-10 hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-red-600 font-black text-xs uppercase tracking-wide hover:bg-yellow-300 hover:text-red-700 transition-all shadow-md whitespace-nowrap"
            >
              Xem tất cả →
            </Link>
          </div>

          {/* ── ĐƯỜNG PHÂN CÁCH ── */}
          <div className="hidden lg:block w-px bg-white/20 my-5" />
          <div className="block lg:hidden h-px bg-white/20 mx-5" />

          {/* ── CỘT PHẢI: Sản phẩm cuộn ngang ── */}
          <div className="relative flex-1 min-w-0 py-5 px-3 lg:px-4">
            {/* Scroll buttons */}
            <button
              onClick={() => scrollCards("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-red-600 shadow-lg transition-all hover:scale-110"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollCards("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-red-600 shadow-lg transition-all hover:scale-110"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Product Row */}
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {saleProducts.map((product) => {
                const originalPrice = Math.round(product.basePrice * 1.25);
                const imgSrc = getImgSrc(product);

                return (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="group flex-shrink-0 bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                    style={{ width: "148px" }}
                  >
                    {/* Ảnh */}
                    <div
                      className="relative overflow-hidden bg-gray-50 flex-shrink-0"
                      style={{ aspectRatio: "1/1" }}
                    >
                      <span className="absolute top-2 left-2 z-10 bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-md shadow">
                        -20%
                      </span>
                      <img
                        src={imgSrc}
                        alt={product.product_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300 flex items-end justify-center pb-3">
                        <span className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
                          Mua ngay
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-2.5 flex flex-col flex-1">
                      <h3 className="text-gray-800 text-[11px] font-semibold line-clamp-2 leading-tight mb-2 flex-1">
                        {product.product_name}
                      </h3>
                      <div className="mb-1.5">
                        <p className="text-red-600 font-black text-sm leading-tight">{formatCurrency(product.basePrice)}</p>
                        <p className="text-gray-400 text-[10px] line-through">{formatCurrency(originalPrice)}</p>
                      </div>
                      {/* Progress */}
                      <div className="h-1.5 bg-red-100 rounded-full overflow-hidden mb-1">
                        <div
                          className="h-full bg-gradient-to-r from-orange-400 to-red-600 rounded-full"
                          style={{ width: "72%" }}
                        />
                      </div>
                      <p className="text-[9px] text-orange-600 font-bold">🔥 Đã bán 72%</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionFlashSale;
