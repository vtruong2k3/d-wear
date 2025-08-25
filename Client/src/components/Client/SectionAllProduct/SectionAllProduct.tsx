


import { Link } from "react-router-dom";
import type { IProducts } from "../../../types/IProducts";
import BoxProduct from "../BoxProduct/BoxProduct";

const SectionAllProduct = ({ products }: { products: IProducts[] }) => {

  return (
    <section className="mt-9 lg:mt-24 pt-16 pb-8 bg-gray">
      <div className="container">
        <div className="lg:flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold">Sản Phẩm</h2>
          </div>
          <Link
            to="/product"
            className="mt-6 lg:mt-0 h-9 border border-black px-7 inline-flex items-center font-semibold text-black rounded-full text-[15px] hover:bg-black hover:text-white transition-all duration-300"
          >
            Xem tất cả
          </Link>
        </div>

        <ul className="gap-5 mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.slice(0, 8).map((product) => (
            <BoxProduct key={product._id} item={product} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default SectionAllProduct;
