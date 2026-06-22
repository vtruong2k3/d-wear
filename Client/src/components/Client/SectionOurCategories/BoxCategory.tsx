import React from "react";
import { Link } from "react-router-dom";

interface BoxCategoryProps {
  data: {
    name: string;
    image: string;
  };
  idx: number;
}

const BoxCategory: React.FC<BoxCategoryProps> = ({ data }) => {
  if (!data) return null;

  return (
    <li>
      <Link to="/product" className="block group">
        <div className="rounded-2xl overflow-hidden relative">
          <div className="w-full aspect-[3/4] overflow-hidden bg-gray-100">
            <img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              src={data.image}
              alt={data.name}
            />
          </div>
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category Name */}
          <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
            <h3 className="text-white text-lg lg:text-xl font-bold tracking-wide drop-shadow-md transition-transform duration-300 group-hover:translate-y-[-4px]">
              {data.name}
            </h3>
            <span className="inline-flex items-center gap-1 text-white/80 text-sm mt-1 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              Xem thêm
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default BoxCategory;
