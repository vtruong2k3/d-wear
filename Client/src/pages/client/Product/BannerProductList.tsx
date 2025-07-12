import img_product_list_banner from "../../../assets/images/img_product_list_banner.png";
const BannerProductList = () => {
  return (
    <section className="relative">
      <img src={img_product_list_banner} alt="" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <h2 className="text-4xl font-semibold">Products</h2>
        <ul className="flex items-center gap-3 justify-center mt-2">
          <li>
            <a href="index.html">Home / </a>
          </li>
          <li>
            <a href="index.html">Products</a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default BannerProductList;
