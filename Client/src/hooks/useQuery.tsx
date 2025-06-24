/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

const useQuery = <T extends Record<string, any>>(initial: T): [T, (newQuery: Partial<T>) => void, () => void]=>
{
  const [query, setQuery] = useState(initial);
  const updateQuery = (newQuery: Partial<T>) => {
    setQuery((prev) => ({
      ...prev,
      ...newQuery,
    }));
  };
  const resetQuery = () => {
    setQuery(initial);
  };
  return [query, updateQuery, resetQuery];
};
export default useQuery;
