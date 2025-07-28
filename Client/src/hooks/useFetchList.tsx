import { useState, useEffect } from "react";

import axios from "axios";
import type { AxiosRequestConfig } from "axios";

interface UseFetchListResult<T> {
  data: T[];
  total: number; // ✅ thêm dòng này
  loading: boolean;
  error: unknown;
  refetch: () => Promise<void>;
}

interface BaseListResponse<T> {
  message?: string;
  page?: number;
  totalPages?: number;
  total?: number;
  products: T[];
}


export const useFetchList = <
  T,
  Q extends Record<string, string | number | boolean> = Record<
    string,
    string | number | boolean
  >
>(
  path: string,
  query: Q = {} as Q,
  config: AxiosRequestConfig = {}
): UseFetchListResult<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [total, setTotal] = useState<number>(0);
  const fetchApi = async () => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams(
        Object.entries(query).reduce((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString();

      const res = await axios.get<BaseListResponse<T>>(
        `/api/${path}?${queryString}`,
        config
      );

      setData(res.data.products || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApi();
  }, [path, JSON.stringify(query), JSON.stringify(config)]);

  return { data, total, loading, error, refetch: fetchApi };
};

export default useFetchList;
