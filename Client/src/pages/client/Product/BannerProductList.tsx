import img_product_list_banner from "../../../assets/images/all-product.jpg";
const BannerProductList = () => {
  return (
    <section className="relative">
      <img src={img_product_list_banner} alt="" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">

      </div>
    </section>
  );
};

export default BannerProductList;
