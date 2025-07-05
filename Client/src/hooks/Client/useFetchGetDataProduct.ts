import { useEffect, useState } from "react";
import apiServiceProduct from "../../services/apiServiceProduct";

const useFetchGetDataProduct = (category_id, exclude_id) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!category_id) return; // Đợi khi có category_id mới gọi

    const fetch = async () => {
      try {
        const res = await apiServiceProduct.getProductsByCategory(
          category_id,
          exclude_id
        );
        if (res.status === 200) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.error("Fetch related products failed", err);
      }
    };

    fetch();
  }, [category_id, exclude_id]);

  return { products };
};

export default useFetchGetDataProduct;
