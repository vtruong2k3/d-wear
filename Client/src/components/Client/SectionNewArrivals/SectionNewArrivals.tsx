
import BoxProduct from "../BoxProduct/BoxProduct";

const SectionNewArrivals = ({ products }) => {
  return (
    <section className="pt-16 pb-8 bg-gray">
      <div className="container">
        <div className="lg:flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold">New Arrivals</h2>
            <p className="mt-2 text-lightGray">
              Experience the best products at our store!
            </p>
          </div>
          <a
            href="#none"
            className="mt-6 lg:mt-0 h-9 border border-black px-7 inline-flex items-center font-semibold text-black rounded-full text-[15px] hover:bg-black hover:text-white transition-all duration-300"
          >
            View All
          </a>
        </div>
        <ul className="gap-5 mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.slice(10, 18).map((item) => (
            <BoxProduct key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default SectionNewArrivals;
