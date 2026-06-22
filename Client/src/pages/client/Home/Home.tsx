import { useCallback, useEffect, useState } from "react";
import BannerTop from "../../../components/Client/Banners/BannerTop";
import SectionService from "../../../components/Client/SectionService/SectionService";

import apiServiceProduct from "../../../services/client/apiServiceProduct";

import SectionAllProduct from "../../../components/Client/SectionAllProduct/SectionAllProduct";
import SectionNewArrivals from "../../../components/Client/SectionNewArrivals/SectionNewArrivals";
import SectionOurCategories from "../../../components/Client/SectionOurCategories/SectionOurCategories";
import SectionComingSoon from "../../../components/Client/SectionComingSoon/SectionComingSoon";
import type { IProducts } from "../../../types/IProducts";
import { useLoading } from "../../../contexts/LoadingContext";
import type { ErrorType } from "../../../types/error/IError";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Home = () => {
  const { setLoading } = useLoading();
  const [products, setProducts] = useState<IProducts[]>([]);

  const fetchDataGetAllProduct = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiServiceProduct.getAllProducts({});

      if (res.status === 200) {
        setProducts(res.data.products);
      }
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  useEffect(() => {
    fetchDataGetAllProduct();
  }, [fetchDataGetAllProduct]);

  return (
    <>
      {/* 1. Hero Banner */}
      <BannerTop />

      {/* 2. Announcement Marquee Bar */}
      <SectionService />

      {/* 3. New Arrivals - Hàng mới nhất */}
      <SectionNewArrivals products={products} />

      {/* 5. Categories - Editorial Grid */}
      <SectionOurCategories />

      {/* 6. Brand Story + Social Proof Stats */}
      <section className="relative overflow-hidden bg-[#0a0a0a] py-20 lg:py-28">
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.08) 40px, rgba(255,255,255,0.08) 80px)",
            }}
          />
        </div>
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container relative z-10 text-center">
          <p className="text-amber-500 text-xs font-bold uppercase tracking-[0.3em] mb-4">Our Story</p>
          <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-4">
            Phong Cách Của Bạn,{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Câu Chuyện Của Bạn
            </span>
          </h2>
          <p className="text-white/50 text-base lg:text-lg max-w-2xl mx-auto mb-12 font-light">
            D-Wear mang đến những bộ sưu tập thời trang chất lượng cao,
            giúp bạn tự tin thể hiện cá tính riêng mỗi ngày.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
            {[
              { value: "10K+", label: "Khách hàng tin dùng" },
              { value: "500+", label: "Mẫu sản phẩm" },
              { value: "5★", label: "Đánh giá trung bình" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl lg:text-4xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-gray-500 text-xs uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>

          <Link
            to="/product"
            className="inline-flex items-center h-12 px-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full text-sm hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Khám phá bộ sưu tập
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* 7. All Products */}
      <SectionAllProduct products={products} />

      {/* 8. Coming Soon - Giữ chân khách, cuối trang */}
      <SectionComingSoon />
    </>
  );
};

export default Home;