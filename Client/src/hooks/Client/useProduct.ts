// hooks/useProductList.ts
import { useState, useEffect } from "react";
import type { IProducts } from "../../types/IProducts";
import type { AxiosRequestConfig } from "axios";
import axios from "axios";

interface ProductListResponse {
  message?: string;
  total?: number;
  page?: number;
  totalPages?: number;
  products: IProducts[];
}

interface UseProductListResult {
  data: IProducts[];
  total: number;
  loading: boolean;
  error: unknown;
  refetch: () => Promise<void>;
}

export const useProductList = (
  path: string,
  query: Record<string, string | number | boolean> = {},
  config: AxiosRequestConfig = {}
): UseProductListResult => {
  const [data, setData] = useState<IProducts[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams(
        Object.entries(query).reduce((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString();
  
  
      const response = await axios.get<ProductListResponse>(
        `/api/${path}?${queryString}`,
        config
      );
  
      setData(response.data.products || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(query), JSON.stringify(config)]);
  

  return {
    data,
    total,
    loading,
    error,
    refetch: fetchProducts,
  };
};

export default useProductList;
