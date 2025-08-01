import React from "react";

interface BoxCategoryProps {
  data: {
    name: string;
    image: string;
  };
  idx: number;
  type: number;
}

const BoxCategory: React.FC<BoxCategoryProps> = ({ data, type }) => {
  if (!data) return null;

  return type === 1 ? (
    <li className="mt-6 md:mt-0">
      <div className="rounded-[20px] overflow-hidden relative group">
        <div className="w-full h-96  lg:h-[560px] overflow-hidden">
          <img
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={data.image}
            alt={data.name}
          />
        </div>
        <a
          href="#none"
          className="absolute group-hover:bottom-10 left-1/2 -translate-x-1/2 -bottom-10 mt-8 h-9 bg-white px-7 inline-flex items-center font-semibold text-black rounded-full text-[15px] hover:bg-black hover:text-white transition-all duration-300"
        >
          {data.name}
        </a>
      </div>
    </li>
  ) : (
    <li className="mt-6 md:mt-0">
      <a href="#none" className="block group">
        <div className="rounded-lg overflow-hidden">
          <div className="w-full h-80 lg:h-[420px] overflow-hidden">
            <img
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              src={data.image}
              alt={data.name}
            />
          </div>
        </div>
        <h3 className="mt-4 font-semibold text-center lg:text-left">{data.name}</h3>
      </a>
    </li>
  );
};

export default BoxCategory;