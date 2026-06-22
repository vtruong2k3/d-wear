import React from "react";
import { Link } from "react-router-dom";
import imgPolo from "../../../assets/images/polo.jpg";
import imgQuanAu from "../../../assets/images/quan-au.jpg";
import imgQuanJean from "../../../assets/images/quan-jean.jpg";
import imgSoMi from "../../../assets/images/so-mi.jpg";

interface CategoryType {
  name: string;
  image: string;
  tag?: string;
  slug: string;
}

const categories: CategoryType[] = [
  { name: "Áo Polo", image: imgPolo, tag: "Bestseller", slug: "polo" },
  { name: "Quần Âu", image: imgQuanAu, tag: "Classic", slug: "quan-au" },
  { name: "Áo Sơ Mi", image: imgSoMi, tag: "Smart", slug: "so-mi" },
  { name: "Quần Jean", image: imgQuanJean, tag: "Street", slug: "quan-jean" },
];

const SectionOurCategories: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-[#0f0f0f]">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 lg:mb-14">
          <div>
            <p className="text-red-500 text-xs font-bold uppercase tracking-[0.3em] mb-2">
              Explore
            </p>
            <h2 className="text-2xl lg:text-4xl font-black text-white tracking-tight">
              Danh Mục Sản Phẩm
            </h2>
            <p className="mt-2 text-gray-500 text-sm">
              Tìm kiếm phong cách phù hợp với bạn
            </p>
          </div>
          <Link
            to="/product"
            className="flex-shrink-0 h-10 border border-gray-700 px-6 inline-flex items-center font-semibold text-gray-300 rounded-full text-sm hover:bg-white hover:text-black hover:border-white transition-all duration-300"
          >
            Tất cả danh mục →
          </Link>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-3 lg:gap-4 h-[480px] lg:h-[560px]">
          {/* Card 0 - Large Left (spans 2 rows on desktop) */}
          <Link
            to="/product"
            className="group relative col-span-1 lg:col-span-2 row-span-2 rounded-2xl lg:rounded-3xl overflow-hidden bg-gray-900 block"
          >
            <img
              src={categories[0].image}
              alt={categories[0].name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 group-hover:from-black/70 transition-all duration-500" />
            {/* Tag */}
            {categories[0].tag && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full">
                  {categories[0].tag}
                </span>
              </div>
            )}
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
              <h3 className="text-white text-xl lg:text-3xl font-black tracking-tight mb-2">
                {categories[0].name}
              </h3>
              <span className="inline-flex items-center gap-1 text-white/70 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                Khám phá →
              </span>
            </div>
          </Link>

          {/* Cards 1, 2, 3 - Right side (3 small cards) */}
          {categories.slice(1).map((cat, i) => (
            <Link
              key={cat.slug}
              to="/product"
              className="group relative rounded-2xl overflow-hidden bg-gray-900 block"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent group-hover:from-black/60 transition-all duration-500" />
              {/* Tag */}
              {cat.tag && (
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 bg-white/10 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-wider rounded-full border border-white/20">
                    {cat.tag}
                  </span>
                </div>
              )}
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-400">
                <h3 className="text-white text-sm lg:text-lg font-black tracking-tight">
                  {cat.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-white/60 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  Xem ngay →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionOurCategories;
