import React from "react";
import BoxCategory from "./BoxCategory";
import useFetchGetDataAllCategory from "../../../hooks/Client/useFetchGetDataAllCategory";
type SectionOurCategoriesProps = {
  type: number;
};

const SectionOurCategories: React.FC<SectionOurCategoriesProps> = ({ type })  => {
  const { categories } = useFetchGetDataAllCategory();

  return type === 1 ? (
    <section className="mt-8 lg:mt-24">
      <div className="container">
        <div className="lg:flex justify-between items-center">
          <h2 className="text-3xl font-bold">Our Categories</h2>
          <a
            href="#none"
            className="mt-6 lg:mt-0 h-9 border border-black px-7 inline-flex items-center font-semibold text-black rounded-full text-[15px] hover:bg-black hover:text-white transition-all duration-300"
          >
            View All
          </a>
        </div>

        <ul className="mt-10 md:grid grid-cols-3 place-items-stretch gap-10 cursor-pointer">
          {categories.slice(11, 14).map((item, index) => (
            <BoxCategory key={index} data={item} idx={index} type={1} />
          ))}
        </ul>
      </div>
    </section>
  ) : (
    <section className="mt-9 lg:mt-24">
      <div className="container">
        <h2 className="text-3xl font-bold text-center">Our Categories</h2>

        <ul className="mt-6 grid grid-cols-2 gap-10 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {categories.slice(0, 8).map((item, index) => (
            <BoxCategory key={item.name} idx={index} data={item} type={2} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default SectionOurCategories;
