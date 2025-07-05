

import BoxProduct from "../BoxProduct/BoxProduct";

const SectionAllProduct = ({ products }) => {
  console.log(products, "All product");
  return (
    <section className="mt-9 lg:mt-24 pt-16 pb-8 bg-gray">
      <div className="container">
        <div className="lg:flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold">Tất cả sản phẩm</h2>
          </div>
          <a
            href="#none"
            className="mt-6 lg:mt-0 h-9 border border-black px-7 inline-flex items-center font-semibold text-black rounded-full text-[15px] hover:bg-black hover:text-white transition-all duration-300"
          >
            Hiển thị tất cả
          </a>
        </div>

        <ul className="gap-5 mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.slice(0, 8).map((product) => (
            <BoxProduct key={product.id} item={product} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default SectionAllProduct;
