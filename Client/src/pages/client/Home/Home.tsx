import { useEffect, useState } from "react";
import BannerTop from "../../../components/Client/Banners/BannerTop";
import SectionService from "../../../components/Client/SectionService/SectionService";

import apiServiceProduct from "../../../services/client/apiServiceProduct";

import SectionAllProduct from "../../../components/Client/SectionAllProduct/SectionAllProduct";
import SectionNewArrivals from "../../../components/Client/SectionNewArrivals/SectionNewArrivals";
import SectionOurCategories from "../../../components/Client/SectionOurCategories/SectionOurCategories";


const Home = () => {
  const [products, setProducts] = useState([]);
  const fetchDataGetAllProduct = async () => {
    const res = await apiServiceProduct.getAllProducts({});
    console.log(res, "resresres");
    if (res.status === 200) {
      setProducts(res.data.products);
    }
  };
  useEffect(() => {
    fetchDataGetAllProduct();
  }, []);
  return (
    <>
      <BannerTop />
      <SectionService />
      <SectionOurCategories type={1} />
      <SectionAllProduct products={products} />
      <SectionOurCategories type={2} />
      <SectionNewArrivals products={products} />
    </>
  );
};

export default Home;