import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import img_banner1 from "../../../assets/images/banner.webp";
import img_banner2 from "../../../assets/images/banner_2.webp";
import img_banner3 from "../../../assets/images/banner_3.webp";

const bannerData = [
  {
    id: 1,
    image: img_banner1,
    headline: "Bộ Sưu Tập Mới",
    subtitle: "Khám phá xu hướng thời trang mùa hè 2025",
    link: "/product",
  },
  {
    id: 2,
    image: img_banner2,
    headline: "Phong Cách Hiện Đại",
    subtitle: "Nâng tầm phong cách với những thiết kế độc đáo",
    link: "/product",
  },
  {
    id: 3,
    image: img_banner3,
    headline: "Sale Đến 50%",
    subtitle: "Ưu đãi đặc biệt cho các sản phẩm được yêu thích nhất",
    link: "/product",
  },
];

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentSlide((prev) => (prev + 1) % bannerData.length);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isHovered]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section
      className="relative overflow-hidden h-[500px] lg:h-[700px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slider Images */}
      <div className="relative w-full h-full">
        {bannerData.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <img
              className="w-full h-full object-cover transition-transform duration-[8000ms] ease-out"
              src={slide.image}
              alt={slide.headline}
              style={{
                transform: index === currentSlide ? "scale(1.05)" : "scale(1)",
              }}
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              {/* Headline */}
              <h2
                className={`!text-white text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-tight drop-shadow-lg transition-all duration-700 ${
                  index === currentSlide
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                {slide.headline}
              </h2>

              {/* Subtitle */}
              <p
                className={`mt-4 lg:mt-6 !text-white/90 text-base sm:text-lg lg:text-xl font-light max-w-lg drop-shadow transition-all duration-700 delay-150 ${
                  index === currentSlide
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                {slide.subtitle}
              </p>

              {/* CTA Button */}
              <Link
                to={slide.link}
                className={`mt-8 lg:mt-10 inline-flex items-center h-12 lg:h-14 px-8 lg:px-10 bg-gradient-to-r from-gray-900 to-slate-800 !text-white font-semibold rounded-full text-sm lg:text-base hover:from-gray-800 hover:to-slate-700 transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-105 ${
                  index === currentSlide
                    ? "opacity-100 translate-y-0 delay-300"
                    : "opacity-0 translate-y-8"
                }`}
              >
                Khám phá ngay
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {bannerData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === currentSlide
                ? "!bg-white w-10"
                : "!bg-white/40 w-2 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-300 ease-linear"
          style={{
            width: `${((currentSlide + 1) / bannerData.length) * 100}%`,
          }}
        />
      </div>
    </section>
  );
};

export default BannerSlider;