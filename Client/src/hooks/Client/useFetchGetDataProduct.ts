import { useEffect, useState } from "react";
import apiServiceProduct from "../../services/client/apiServiceProduct";
import type { IProducts } from "../../types/IProducts";

const useFetchGetDataProduct = (category_id: string, exclude_id: string) => {
  const [products, setProducts] = useState<IProducts[]>([]);

  useEffect(() => {
    if (!category_id) return;

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
