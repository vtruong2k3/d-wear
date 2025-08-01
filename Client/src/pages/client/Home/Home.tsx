import { useCallback, useEffect, useState } from "react";
import BannerTop from "../../../components/Client/Banners/BannerTop";
import SectionService from "../../../components/Client/SectionService/SectionService";

import apiServiceProduct from "../../../services/client/apiServiceProduct";

import SectionAllProduct from "../../../components/Client/SectionAllProduct/SectionAllProduct";
import SectionNewArrivals from "../../../components/Client/SectionNewArrivals/SectionNewArrivals";
import SectionOurCategories from "../../../components/Client/SectionOurCategories/SectionOurCategories";
import type { IProducts } from "../../../types/IProducts";
import { useLoading } from "../../../contexts/LoadingContext";
import type { ErrorType } from "../../../types/error/IError";
import toast from "react-hot-toast";


const Home = () => {
  const { setLoading } = useLoading()
  const [products, setProducts] = useState<IProducts[]>([]);

  const fetchDataGetAllProduct = useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiServiceProduct.getAllProducts({});

      if (res.status === 200) {
        setProducts(res.data.products);
      }
    } catch (error) {
      const errorMessage =
        (error as ErrorType).response?.data?.message ||
        (error as ErrorType).message ||
        "Đã xảy ra lỗi, vui lòng thử lại.";
      toast.error(errorMessage);
    } finally { setLoading(false) }
  }, [setLoading])

  useEffect(() => {
    fetchDataGetAllProduct();
  }, [fetchDataGetAllProduct]);
  return (
    <>
      <BannerTop />
      <SectionService />
      <SectionOurCategories type={1} />
      <SectionNewArrivals products={products} />
      <SectionOurCategories type={2} />
      <SectionAllProduct products={products} />
    </>
  );
};

export default Home;