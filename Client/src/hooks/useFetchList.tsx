import { useState, useEffect } from "react";
import axios from "axios";

interface UseFetchListResult<T> {
  data: T[];
  loading: boolean;
  error: any;
  refetch: () => Promise<void>;
}

export const useFetchList = <T = any>(
  path: string,
  query: Record<string, any> = {},
  config: Record<string, any> = {}
): UseFetchListResult<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchApi = async () => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams(query).toString();
      const res = await axios.get(`/api/${path}?${queryString}`, config);

      // Ví dụ response:
      // { message: "...", page: 1, totalPages: 1, products: [...] }
      setData(res.data.products || []); // tùy vào key chứa danh sách
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
