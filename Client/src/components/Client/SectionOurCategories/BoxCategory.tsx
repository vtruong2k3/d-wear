import React from "react";
import { avatarFake } from "../../../utils/constants/mockData";

type BoxCategoryProps = {
  data: { name: string };
  idx: number;
  type: number;
};

const BoxCategory: React.FC<BoxCategoryProps> = ({ data, idx, type }) => {
  const avatarSrc = avatarFake[idx] ?? ""; // An toàn, không lỗi TS

  return (
    <li className="mt-6 md:mt-0">
      {type === 1 ? (
        <div className="rounded-[20px] overflow-hidden relative group">
          <img className="" src={avatarSrc} alt={data.name} />
          <a
            href="#none"
            className="absolute group-hover:bottom-10 left-1/2 -translate-x-1/2 -bottom-10 mt-8 h-9 bg-white px-7 inline-flex items-center font-semibold text-black rounded-full text-[15px] hover:bg-black hover:text-white transition-all duration-300"
          >
            {data.name}
          </a>
        </div>
      ) : (
        <a href="#none">
          <div className="rounded-lg overflow-hidden">
            <img className="" src={avatarSrc} alt={data.name} />
          </div>
          <h3 className="mt-4 font-semibold">{data.name}</h3>
        </a>
      )}
    </li>
  );
};

export default BoxCategory;
