import { useState, useEffect } from "react";
import axios from "axios";
import type { AxiosRequestConfig } from "axios";


interface UseFetchListResult<T> {
  data: T[];
  loading: boolean;
  error: unknown;
  refetch: () => Promise<void>;
}

<<<<<<< HEAD
interface BaseListResponse<T> {
  message?: string;
  page?: number;
  totalPages?: number;
  products: T[];
}
=======
export const useFetchList= <T= any>(
  path: string,
  query: Record<string, any> = {},
  config: Record<string, any> = {}
): UseFetchListResult<T> => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
>>>>>>> 2f4304c4bb5670e0c2e5c2bee030a77089bb968c

export const useFetchList = <
  T,
  Q extends Record<string, string | number | boolean> = Record<string, string | number | boolean>
>(
  path: string,
  query: Q = {} as Q,
  config: AxiosRequestConfig = {}
): UseFetchListResult<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

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
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApi();
  }, [path, JSON.stringify(query), JSON.stringify(config)]);

  return { data, loading, error, refetch: fetchApi };
};

export default useFetchList;
