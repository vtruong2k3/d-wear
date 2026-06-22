import { Link } from "react-router-dom";
import type { IProducts } from "../../../types/IProducts";
import BoxProduct from "../BoxProduct/BoxProduct";

const SectionAllProduct = ({ products }: { products: IProducts[] }) => {
  if (products.length === 0) {
    return (
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <div className="accent-bar mb-4" />
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Tất Cả Sản Phẩm
              </h2>
            </div>
          </div>
          <div className="text-center py-16">
            <div className="text-5xl mb-4">👗</div>
            <p className="text-gray-500 text-lg">
              Sản phẩm đang được cập nhật...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 lg:mb-14">
          <div>
            <div className="accent-bar mb-4" />
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Tất Cả Sản Phẩm
            </h2>
          </div>
          <Link
            to="/product"
            className="h-10 border-2 border-gray-900 px-7 inline-flex items-center font-semibold text-gray-900 rounded-full text-sm hover:bg-gray-900 hover:text-white transition-all duration-300"
          >
            Xem tất cả
          </Link>
        </div>

        {/* Products Grid */}
        <ul className="gap-5 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-6">
          {products.slice(0, 8).map((product) => (
            <BoxProduct key={product._id} item={product} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default SectionAllProduct;
