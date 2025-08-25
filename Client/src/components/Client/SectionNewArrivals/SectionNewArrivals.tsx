import { Link } from "react-router-dom";
import type { IProducts } from "../../../types/IProducts";
import BoxProduct from "../BoxProduct/BoxProduct";
import { useState, useRef, useEffect } from "react";

const SectionSaleProducts = ({ products }: { products: IProducts[] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [itemsPerView, setItemsPerView] = useState(4);

  // Responsive items per view
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
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const totalSlides = Math.ceil(products.length / itemsPerView);
  const canGoNext = currentSlide < totalSlides - 1;
  const canGoPrev = currentSlide > 0;

  const nextSlide = () => {
    if (canGoNext) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (canGoPrev) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="pt-16 pb-8 bg-red-50">
      <div className="container">
        <div className="lg:flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-red-600">Sản phẩm Sale</h2>
            <p className="mt-2 text-gray-600">
              Khuyến mãi hấp dẫn - Cơ hội không thể bỏ lỡ!
            </p>
          </div>
          <div className="flex items-center gap-4 mt-6 lg:mt-0">
            <Link
              to="/product"
              className="h-9 border border-red-600 px-7 inline-flex items-center font-semibold text-red-600 rounded-full text-[15px] hover:bg-red-600 hover:text-white transition-all duration-300"
            >
              Xem tất cả
            </Link>
            {/* Navigation buttons */}
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                disabled={!canGoPrev}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${canGoPrev
                  ? 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
                  : 'border-gray-300 text-gray-300 cursor-not-allowed'
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                disabled={!canGoNext}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${canGoNext
                  ? 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
                  : 'border-gray-300 text-gray-300 cursor-not-allowed'
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Slider Container */}
        <div className="relative mt-8 overflow-hidden">
          <div
            ref={sliderRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * (100 / totalSlides)}%)`,
              width: `${totalSlides * 100}%`
            }}
          >
            {Array.from({ length: totalSlides }, (_, slideIndex) => (
              <div
                key={slideIndex}
                className="flex gap-5"
                style={{ width: `${100 / totalSlides}%` }}
              >
                {products
                  .slice(slideIndex * itemsPerView, (slideIndex + 1) * itemsPerView)
                  .map((item) => (
                    <div key={item._id} className="flex-1 min-w-0">
                      <BoxProduct item={item} />
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        {/* Dots indicator */}
        {totalSlides > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300
        ${currentSlide === index
                    ? 'bg-red-600 !border-2 !border-red-600 scale-110'
                    : 'bg-transparent !border !border-red-500 hover:!border-red-600'} 
      `}
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
