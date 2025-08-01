import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import img_banner1 from "../../../assets/images/banner.webp";
import img_banner2 from "../../../assets/images/banner_2.webp";
import img_banner3 from "../../../assets/images/banner_3.webp";

const bannerData = [
  {
    id: 1,
    image: img_banner1,

    link: "/product"
  },
  {
    id: 2,
    image: img_banner2,

    link: "/product"
  },
  {
    id: 3,
    image: img_banner3,

    link: "/product"
  }
];

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto slide - tự chạy liên tục
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentSlide((prev) => (prev + 1) % bannerData.length);
      }
    }, 3000); // Chuyển slide mỗi 4 giây

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
            className={`absolute inset-0 transition-all duration-1000 ${index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
          >
            <img
              className="w-full h-full object-cover transition-transform duration-[6000ms] hover:scale-110"
              src={slide.image}
              alt={`Banner ${index + 1}`}
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>

            {/* Content */}
            <div className="absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-4">


              {/* Shop now button - chỉ hiện khi hover */}
              <Link
                to={slide.link}
                className={`inline-flex items-center h-12 px-8 bg-white text-black font-semibold rounded-full text-base hover:bg-black hover:text-white transition-all duration-500 transform shadow-lg ${isHovered
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-8 scale-95"
                  }`}
              >
                Shop now
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
        {bannerData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
              ? "!bg-white w-8"
              : "!bg-white/50 hover:bg-white/75"
              }`}
          />
        ))}
      </div>

      {/* Progress Bar tự chạy */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
        <div
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{
            width: `${((currentSlide + 1) / bannerData.length) * 100}%`
          }}
        />
      </div>


    </section>
  );
};

export default BannerSlider;