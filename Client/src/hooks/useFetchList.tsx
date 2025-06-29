import { useState, useEffect } from "react";
import { api } from "../configs/AxiosConfig";
interface UseFetchListResult<T> {
  data: T[];
  loading: boolean;
  error: any;
  refetch: () => Promise<void>
}

export const useFetchList= <T= any>(
  path: string,
  query: Record<string, any> = {},
  config: Record<string, any> = {}
): UseFetchListResult<T> => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);


  const fetchApi = async () => {
    try {
      const queryString = new URLSearchParams(query).toString();
      const res = await api.get(`${path}/search?${queryString}`, config);
      console.log(res.data);
      setData(res.data[path] || res.data);
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
