import { useEffect, useState } from "react";
import BannerTop from "../../../components/Client/Banners/BannerTop";
import SectionService from "../../../components/Client/SectionService/SectionService";
import SectionOurCategories from "../../../components/Client/SectionOurCategories/SectionOurCategories";
import SectionBestseller from "../../../components/Client/SectionBestseller/SectionBestseller";
import apiServiceProduct from "../../../services/apiServiceProduct";
import SectionNewArrivals from "../../../components/Client/SectionNewArrivals/SectionNewArrivals";


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
      <SectionBestseller products={products} />
      <SectionOurCategories type={2} />
      <SectionNewArrivals products={products} />
    </>
  );
};

export default Home;
