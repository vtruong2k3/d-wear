import { Link } from "react-router-dom";
import type { IProducts } from "../../../types/IProducts";
import BoxProduct from "../BoxProduct/BoxProduct";
import { useState, useRef, useEffect } from "react";

const SectionSaleProducts = ({ products }: { products: IProducts[] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const totalSlides = Math.ceil(products.length / itemsPerView);
  const canGoNext = currentSlide < totalSlides - 1;
  const canGoPrev = currentSlide > 0;

  const nextSlide = () => {
    if (canGoNext) setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (canGoPrev) setCurrentSlide((prev) => prev - 1);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (products.length === 0) {
    return (
      <section className="py-16 lg:py-20 bg-amber-50/40">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <div className="accent-bar mb-4" />
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Sản Phẩm Nổi Bật
              </h2>
              <p className="mt-2 text-gray-500">
                Khuyến mãi hấp dẫn — Cơ hội không thể bỏ lỡ!
              </p>
            </div>
          </div>
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🛍️</div>
            <p className="text-gray-500 text-lg">
              Sản phẩm đang được cập nhật...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="accent-bar mb-4" />
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Hàng Mới Về
            </h2>
            <p className="mt-2 text-gray-500">
              Những thiết kế mới nhất vừa ra lò — Cập nhật hàng tuần!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/product"
              className="h-10 border-2 border-gray-900 px-7 inline-flex items-center font-semibold text-gray-900 rounded-full text-sm hover:bg-gray-900 hover:text-white transition-all duration-300"
            >
              Xem tất cả
            </Link>
            {/* Navigation buttons */}
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                disabled={!canGoPrev}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  canGoPrev
                    ? "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                    : "border-gray-300 text-gray-300 cursor-not-allowed"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                disabled={!canGoNext}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  canGoNext
                    ? "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                    : "border-gray-300 text-gray-300 cursor-not-allowed"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Slider Container */}
        <div className="relative mt-10 overflow-hidden">
          <div
            ref={sliderRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * (100 / totalSlides)}%)`,
              width: `${totalSlides * 100}%`,
            }}
          >
            {Array.from({ length: totalSlides }, (_, slideIndex) => (
              <div
                key={slideIndex}
                className="grid gap-5"
                style={{ 
                  width: `${100 / totalSlides}%`,
                  gridTemplateColumns: `repeat(${itemsPerView}, minmax(0, 1fr))` 
                }}
              >
                {products
                  .slice(
                    slideIndex * itemsPerView,
                    (slideIndex + 1) * itemsPerView
                  )
                  .map((item) => (
                    <div key={item._id} className="min-w-0">
                      <BoxProduct item={item} />
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        {/* Dots indicator */}
        {totalSlides > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "bg-amber-600 w-8"
                    : "bg-gray-300 w-2 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SectionSaleProducts;
