import { useEffect, useState } from "react";
import apiServiceProduct from "../../services/apiServiceProduct";

const useFetchGetDataProduct = (category, filterParams) => {
  const [products, setProducts] = useState([]);
  const [totalProduct, setTotalProduct] = useState(0);
  useEffect(() => {
    const fetchDataProductByCategory = async () => {
      const res = await apiServiceProduct.getProdductsByCategory(category);
      if (res.status === 200) {
        setProducts(res.data.products);
      }
    };

    const fetchDataAllProduct = async () => {
      const res = await apiServiceProduct.getAllProducts(filterParams);
      if (res.status === 200) {
        setProducts(res.data.products);
        setTotalProduct(res.data.total);
      }
    };
    if (category) {
      fetchDataProductByCategory();
    } else {
      fetchDataAllProduct();
    }
  }, [category, filterParams]);
  return {
    products,
    totalProduct,
  };
};

export default useFetchGetDataProduct;
